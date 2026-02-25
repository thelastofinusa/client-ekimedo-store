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
    (booking: { consultationDate: string }) =>
      new Date(booking.consultationDate),
  );
}

export async function createBookingService(formData: FormData) {
  try {
    const serviceSlug = formData.get("serviceType") as string;
    const guestsRaw = formData.get("guests") as string | null;
    const guests =
      guestsRaw && !Number.isNaN(parseInt(guestsRaw)) ? parseInt(guestsRaw) : 1;
    const dateTime = formData.get("consultationDate") as string;
    let endTime = formData.get("endTime") as string | null;
    const eventDate = formData.get("eventDate") as string | null;
    const fName = formData.get("fName") as string;
    const lName = formData.get("lName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const budget = formData.get("budget") as string | null;
    const customBudget = formData.get("customBudget") as string | null;
    const referBy = formData.get("referBy") as string | null;
    const dressSize = formData.get("dressSize") as string | null;
    const dressColor = formData.get("dressColor") as string | null;
    const specialRequirements = formData.get("specialRequirements") as string | null;
    const priceRange = formData.get("priceRange") as string | null;

    const timelineValues = formData.getAll("timeline") as string[];
    const timeline = timelineValues.includes("timeline-acknowledged");
    const rushOrder = timelineValues.includes("rush-required");

    const cancellationPolicyValues = formData.getAll("cancellationPolicy") as string[];
    const cancellationPolicy = cancellationPolicyValues.includes("cancellation-accepted");

    const interests = formData.getAll("interests") as string[];

    // Handle multiple files
    const inspirationFiles = [
      ...(formData.getAll("inspiration") as File[]),
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

    if (inspirationFiles && inspirationFiles.length > 0) {
      // Upload images to Sanity
      for (const file of inspirationFiles) {
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
      fName,
      lName,
      email,
      phone,
      service: service.title || serviceSlug,
      consultationDate: new Date(dateTime).toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
      eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
      status: "pending",
      location,
      guests,
      budget: budget || undefined,
      customBudget: customBudget || undefined,
      priceRange: priceRange || undefined,
      interests,
      referBy: referBy || undefined,
      timeline,
      rushOrder,
      cancellationPolicy,
      dressSize: dressSize || undefined,
      dressColor: dressColor || undefined,
      specialRequirements: specialRequirements || undefined,
      responses,
      inspiration: imageAssetIds.map((id) => ({
        _key: randomUUID(),
        _type: "image",
        asset: {
          _type: "reference",
          _ref: id,
        },
      })),
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
          customerEmail: email,
          customerName: `${fName} ${lName}`.trim(),
          serviceTitle: service.title || "Consultation",
          dateTime,
          endTime,
          location,
          eventDate,
          budgetType: budget || "",
          customBudget: customBudget || "",
          paymentMethod,
          rushOrder: rushOrder ? "yes" : "no",
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
