import { client, writeClient } from "@/sanity/lib/client";
import { BOOKED_DATES_QUERY } from "@/sanity/queries/booking";
import { randomUUID } from "crypto";
import { stripe } from "@/lib/stripe";
import { paypalClient } from "@/lib/paypal";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { siteConfig } from "@/site.config";
import { consultationsData } from "../constants/consultation";

export async function getBookedDatesService() {
  const bookings = await client.fetch(BOOKED_DATES_QUERY);
  return bookings.map(
    (booking: { bookingDate: string }) => new Date(booking.bookingDate),
  );
}

export async function createBookingService(formData: FormData) {
  try {
    const serviceSlug = formData.get("serviceType") as string;
    const groupSizeRaw = formData.get("groupSize") as string | null;
    const groupSize =
      groupSizeRaw && !Number.isNaN(parseInt(groupSizeRaw))
        ? parseInt(groupSizeRaw)
        : 1;
    const dateTime = formData.get("dateTime") as string;
    let endTime = formData.get("endTime") as string | null;
    const eventDate = formData.get("eventDate") as string | null;
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const location = formData.get("location") as string;
    const socialMediaHandles = formData.getAll("socialMediaHandle") as string[];
    const budgetType = formData.get("budgetType") as string | null;
    const customBudget = formData.get("customBudget") as string | null;
    const understoodProductionProcess =
      formData.get("understoodProductionProcess") === "true";

    // Handle multiple files
    const styleInspirationFiles = [
      ...(formData.getAll("styleInspiration") as File[]),
      ...(formData.getAll("inspirationPhotos") as File[]),
    ];

    if (!serviceSlug) {
      throw new Error("Missing service type");
    }

    // Fetch service details from Sanity
    const service = consultationsData.find(({ slug }) => slug === serviceSlug);

    if (!service) {
      throw new Error("Service not found");
    }

    // Process dynamic form fields
    const responses: { key: string; label: string; value: string }[] = [];

    const imageAssetIds: string[] = [];
    const imageUrls: string[] = [];

    if (styleInspirationFiles && styleInspirationFiles.length > 0) {
      // Upload images to Sanity
      for (const file of styleInspirationFiles) {
        if (file.size > 0) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const asset = await writeClient.assets.upload("image", buffer, {
            filename: file.name,
          });
          imageAssetIds.push(asset._id);
          imageUrls.push(asset.url);
        }
      }
    }

    if (!endTime && dateTime && service?.duration) {
      const start = new Date(dateTime);
      const end = new Date(start.getTime() + service.duration * 60000);
      endTime = end.toISOString();
    }

    // Create Booking in Sanity
    const bookingDoc = {
      _type: "booking",
      customerName,
      customerEmail,
      customerPhone,
      service: service.title || serviceSlug,
      bookingDate: new Date(dateTime).toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
      eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
      status: "pending",
      location,
      groupSize,
      budgetType: budgetType || undefined,
      customBudget: customBudget || undefined,
      socialMediaHandles,
      responses,
      styleInspiration: imageAssetIds.map((id) => ({
        _key: randomUUID(),
        _type: "image",
        asset: {
          _type: "reference",
          _ref: id,
        },
      })),
      understoodProductionProcess,
    };

    const createdBooking = await writeClient.create(bookingDoc);

    const paymentMethod = formData.get("paymentMethod") as string;

    const baseUrl =
      siteConfig.url ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      "http://localhost:3000";

    if (paymentMethod === "stripe") {
      // Create Stripe Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: service.title || "Consultation",
                images: imageUrls.length > 0 ? [imageUrls[0]] : undefined,
              },
              unit_amount: Math.round((service.price || 0) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/consultation?success=true`,
        cancel_url: `${baseUrl}/consultation?canceled=true`,
        metadata: {
          type: "consultation_booking",
          bookingId: createdBooking._id,
          customerEmail,
          customerName,
          serviceTitle: service.title || "Consultation",
          dateTime,
          endTime,
          location,
          eventDate,
          budgetType: budgetType || "",
          customBudget: customBudget || "",
          paymentMethod,
        },
      });

      return { success: true, url: session.url };
    } else if (paymentMethod === "paypal") {
      // Create PayPal Order
      const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: (service.price || 0).toString(),
            },
            description: service.title || "Consultation",
            custom_id: createdBooking._id, // Store booking ID for webhook/capture
          },
        ],
        application_context: {
          return_url: `${baseUrl}/api/bookings/paypal/capture?booking_id=${createdBooking._id}`,
          cancel_url: `${baseUrl}/consultation?canceled=true`,
          brand_name: `${siteConfig.title}`,
          user_action: "PAY_NOW",
        },
      });

      const response = await paypalClient.client().execute(request);
      const order = response.result;

      // Find the approval link
      const approvalLink = order.links.find(
        (link: { rel: string; href: string }) => link.rel === "approve",
      );

      if (!approvalLink) {
        throw new Error("PayPal approval link not found");
      }

      return { success: true, url: approvalLink.href };
    }

    return { success: true, message: "Booking created successfully" };
  } catch (error: unknown) {
    console.error("Booking error:", error);

    if (error instanceof Error && error.message) {
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.error_description || parsedError.error) {
          return {
            success: false,
            error: (parsedError.error_description ||
              parsedError.error) as string,
          };
        }
      } catch (e) {
        // Not a JSON error message, use the raw message
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
