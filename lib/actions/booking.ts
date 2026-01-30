"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { SERVICE_BY_ID_QUERY } from "@/sanity/queries/service";
import { randomUUID } from "crypto";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function createBooking(formData: FormData) {
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
        serviceSlug,
        serviceTitle: service.title || "",
        groupSize: groupSize.toString(),
        dateTime,
        endTime, // Added endTime to metadata
        customerName,
        customerEmail,
        customerPhone,
        location,
        bookingId: createdBooking._id,
        socialMediaHandles: JSON.stringify(socialMediaHandles).substring(
          0,
          500,
        ),
        agreedToCancellation: agreedToCancellation.toString(),
        // Store as JSON strings, truncated if necessary (Stripe metadata key 500 chars limit)
        // We'll prioritize asset IDs.
        styleInspirationAssetIds: JSON.stringify(imageAssetIds).substring(
          0,
          500,
        ),
        // We might skip URLs if they are too long, or store just the first one for reference
        styleInspirationPreviewUrl: imageUrls[0] || "",
      },
      customer_email: customerEmail,
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
}
