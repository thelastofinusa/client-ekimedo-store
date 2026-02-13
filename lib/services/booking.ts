import { client, writeClient } from "@/sanity/lib/client";
import { SERVICE_BY_ID_QUERY } from "@/sanity/queries/service";
import { BOOKED_DATES_QUERY } from "@/sanity/queries/booking";
import { randomUUID } from "crypto";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function getBookedDatesService() {
  const bookings = await client.fetch(BOOKED_DATES_QUERY);
  return bookings.map((booking: { bookingDate: string }) => new Date(booking.bookingDate));
}

export async function createBookingService(formData: FormData) {
  try {
    const serviceSlug = formData.get("serviceType") as string;
    const groupSize = parseInt(formData.get("groupSize") as string);
    const dateTime = formData.get("dateTime") as string;
    const endTime = formData.get("endTime") as string;
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const location = formData.get("location") as string;
    const socialMediaHandles = formData.getAll("socialMediaHandle") as string[];
    const agreedToCancellation =
      formData.get("agreedToCancellation") === "true";

    // Handle multiple files
    const styleInspirationFiles = formData.getAll("styleInspiration") as File[];

    if (!serviceSlug) {
      throw new Error("Missing service type");
    }

    // Fetch service details from Sanity
    const services = await client.fetch(SERVICE_BY_ID_QUERY, {
      slug: serviceSlug,
    });
    const service = services[0];

    if (!service) {
      throw new Error("Service not found");
    }

    // Process dynamic form fields
    const responses: { key: string; label: string; value: string }[] = [];
    if (service.formBuilder && Array.isArray(service.formBuilder)) {
      for (const field of service.formBuilder) {
        const value = formData.get(field.name);
        if (value) {
          responses.push({
            key: field.name,
            label: field.label,
            value: value.toString(),
          });
        }
      }
    }

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

    // Create Booking in Sanity
    const bookingDoc = {
      _type: "booking",
      customerName,
      customerEmail,
      customerPhone,
      service: {
        _type: "reference",
        _ref: service._id,
      },
      bookingDate: new Date(dateTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      status: "pending",
      location,
      groupSize,
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
      agreedToCancellation,
    };

    const createdBooking = await writeClient.create(bookingDoc);

    const baseUrl =
      env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      "http://localhost:3000";

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
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking`,
      metadata: {
        bookingId: createdBooking._id,
        customerEmail,
      },
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Booking error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
