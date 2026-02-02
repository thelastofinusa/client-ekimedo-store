import Stripe from "stripe";
import { Resend } from "resend";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client, writeClient } from "@/sanity/lib/client";
import { ORDER_BY_STRIPE_PAYMENT_ID_QUERY } from "@/sanity/queries/orders";
import { stripe } from "@/lib/stripe";

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

if (!process.env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL) {
  throw new Error("NEXT_PUBLIC_RESEND_CONTACT_EMAIL is not defined");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const contactEmail = process.env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const stripePaymentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : ((session.payment_intent as Stripe.PaymentIntent)?.id ?? null);

  const metadata = session.metadata ?? {};

  // Handle Consultation Booking (does not require stripePaymentId)
  if (String(metadata.type ?? "").trim() === "consultation_booking") {
    // We cannot reliably access event.type here because event is not passed to this function.
    // However, we know this function is only called for checkout.session.completed
    console.log("Processing consultation booking webhook:", {
      eventType: "checkout.session.completed",
      sessionId: session.id,
      metadataType: metadata.type,
    });

    const {
      bookingId,
      serviceTitle,
      customerName,
      customerEmail: metadataCustomerEmail,
      customerPhone,
      dateTime,
      endTime,
      location,
      groupSize,
    } = metadata;

    if (!bookingId) {
      console.error("Missing bookingId in metadata");
      return;
    }

    try {
      await writeClient.patch(bookingId).set({ status: "confirmed" }).commit();

      console.log(`Booking ${bookingId} confirmed`);

      const adminHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

              <!-- Header -->
              <div style="border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 40px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                      Ekimedo
                  </h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #666666;">
                      New Booking Notification
                  </p>
              </div>

              <!-- Intro -->
              <div style="margin-bottom: 40px;">
                  <p style="font-size: 16px; line-height: 1.5; margin: 0; color: #333333;">
                      A new consultation has been booked through the platform. Please review the details below.
                  </p>
              </div>

              <!-- Booking Details -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                      Booking Details
                  </h2>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Service</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700; border-bottom: 1px solid #eeeeee;">${serviceTitle}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Date</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${new Date(dateTime).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Time</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Location</td>
                          <td style="padding: 12px 0; text-align: right; text-transform: capitalize; border-bottom: 1px solid #eeeeee;">${location}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666;">Group Size</td>
                          <td style="padding: 12px 0; text-align: right;">${groupSize} Participant</td>
                      </tr>
                  </table>
              </div>

              <!-- Customer Information -->
              <div style="margin-bottom: 40px; padding: 20px; border: 1px solid #eeeeee;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 15px;">
                      Customer Information
                  </h2>
                  <p style="font-size: 14px; margin: 0 0 8px 0; color: #333333;"><strong>Name:</strong> ${customerName}</p>
                  <p style="font-size: 14px; margin: 0 0 8px 0; color: #333333;"><strong>Email:</strong> ${metadataCustomerEmail}</p>
                  <p style="font-size: 14px; margin: 0; color: #333333;"><strong>Phone:</strong> ${customerPhone}</p>
              </div>

              <!-- Action -->
              <div style="margin-bottom: 60px; text-align: center;">
                  <a target="_blank" rel="noopener noreferrer" href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/structure/booking;${bookingId}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000;">
                      View Booking in Studio
                  </a>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Ekimedo Admin</p>
                  <p style="margin: 0; color: #999999; font-size: 11px; letter-spacing: 0.5px;">
                      Internal Notification • Order Management System
                  </p>
              </div>

          </div>
      </body>
      </html>
      `;

      const adminTo = (
        process.env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL ?? ""
      ).trim();

      if (!adminTo) {
        console.error(
          "Consultation webhook: NEXT_PUBLIC_RESEND_CONTACT_EMAIL is empty, skipping admin email",
        );
      } else {
        const { error: adminError } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: adminTo,
          subject: `New Booking: ${serviceTitle}`,
          html: adminHtml,
        });
        if (adminError) {
          console.error("Resend admin booking email failed:", adminError);
        } else {
          console.log(`Booking notification email sent to ${adminTo}`);
        }
      }

      const start = new Date(dateTime).toISOString().replace(/-|:|\.\d+/g, "");
      const end = new Date(endTime).toISOString().replace(/-|:|\.\d+/g, "");

      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        serviceTitle,
      )}&dates=${start}/${end}&details=${encodeURIComponent(
        `Consultation with ${customerName}`,
      )}&location=${encodeURIComponent(location)}`;

      const customerHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

              <!-- Header -->
              <div style="border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 40px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                      Ekimedo
                  </h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #666666;">
                      Consultation Confirmed
                  </p>
              </div>

              <!-- Intro -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">Hello, ${customerName}</h2>
                  <p style="font-size: 16px; line-height: 1.5; margin: 0; color: #333333;">
                      Your consultation has been confirmed. We look forward to seeing you soon. Please find your booking details below.
                  </p>
              </div>

              <!-- Booking Details -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                      Booking Details
                  </h2>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Service</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700; border-bottom: 1px solid #eeeeee;">${serviceTitle}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Date</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${new Date(dateTime).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Time</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666;">Location</td>
                          <td style="padding: 12px 0; text-align: right; text-transform: capitalize;">${location}</td>
                      </tr>
                  </table>
              </div>

              <!-- Note Section -->
              <div style="border: 1px solid #000000; padding: 20px; margin-bottom: 40px;">
                  <p style="font-size: 14px; margin: 0; line-height: 1.5; color: #333333;">
                      <strong>Questions?</strong><br>
                      If you have any questions or need to reschedule, please reply to this email or contact our support team directly.
                  </p>
              </div>

              <!-- Action -->
              <div style="margin-bottom: 60px; text-align: center;">
                  <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000;">
                      Add to Calendar
                  </a>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Ekimedo</p>
                  <p style="margin: 0; color: #999999; font-size: 11px; letter-spacing: 0.5px; line-height: 1.4;">
                      Bespoke design solutions for modern brands.<br>
                      &copy; 2024 EKIMEDO. ALL RIGHTS RESERVED.
                  </p>
              </div>

          </div>
      </body>
      </html>
      `;

      const customerTo = String(metadataCustomerEmail ?? "").trim() || adminTo;

      if (!customerTo) {
        console.error(
          "Consultation webhook: No valid customer or admin email found, skipping customer confirmation",
        );
      } else {
        const { error: customerError } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: customerTo,
          subject: `Your consultation is confirmed – ${serviceTitle}`,
          html: customerHtml,
        });
        if (customerError) {
          console.error(
            "Resend customer booking confirmation failed:",
            customerError,
          );
        } else {
          console.log(`Booking confirmation email sent to ${customerTo}`);
        }
      }
    } catch (error) {
      console.error("Error processing booking webhook:", error);
    }
    return;
  }

  if (!stripePaymentId) {
    console.error("Missing payment_intent in session");
    return;
  }

  try {
    // Idempotency check: prevent duplicate processing on webhook retries
    // This also handles backward compatibility for orders created with random IDs
    const existingOrder = await client.fetch(ORDER_BY_STRIPE_PAYMENT_ID_QUERY, {
      stripePaymentId,
    });

    if (existingOrder) {
      console.log(
        `Webhook already processed for payment ${stripePaymentId}, skipping`,
      );
      return;
    }

    // Extract metadata
    const { clerkUserId, userEmail, sanityCustomerId } = session.metadata ?? {};

    if (!clerkUserId) {
      console.error("Missing clerkUserId in checkout session metadata");
      return;
    }

    // Get line items from Stripe with product details expanded
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const orderItems = [];
    const stockUpdates = new Map<string, number>();

    for (const item of lineItems.data) {
      const price = item.price;
      const product = price?.product as Stripe.Product;
      const quantity = item.quantity ?? 1;

      // Try to get productId from metadata
      const productId = product?.metadata?.productId;

      if (!productId) {
        console.error(`Missing productId metadata for line item ${item.id}`);
        continue;
      }

      orderItems.push({
        _key: item.id,
        product: {
          _type: "reference" as const,
          _ref: productId,
        },
        quantity: quantity,
        priceAtPurchase: item.amount_total
          ? item.amount_total / 100 / quantity
          : 0,
      });

      stockUpdates.set(
        productId,
        (stockUpdates.get(productId) || 0) + quantity,
      );
    }

    if (orderItems.length === 0) {
      console.error("No valid order items found");
      return;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Extract shipping address
    const shippingAddress = session.customer_details?.address;
    const address = shippingAddress
      ? {
          name: session.customer_details?.name ?? "",
          line1: shippingAddress.line1 ?? "",
          line2: shippingAddress.line2 ?? "",
          city: shippingAddress.city ?? "",
          postcode: shippingAddress.postal_code ?? "",
          country: shippingAddress.country ?? "",
        }
      : undefined;

    // Create order in Sanity with customer reference
    // Use stripePaymentId as the document _id to ensure idempotency and prevent duplicates
    let order;
    try {
      order = await writeClient.create({
        _id: stripePaymentId,
        _type: "order",
        orderNumber,
        ...(sanityCustomerId && {
          customer: {
            _type: "reference",
            _ref: sanityCustomerId,
          },
        }),
        clerkUserId,
        email: userEmail ?? session.customer_details?.email ?? "",
        items: orderItems,
        total: (session.amount_total ?? 0) / 100,
        status: "paid",
        stripePaymentId,
        address,
        createdAt: new Date().toISOString(),
      });

      console.log(`Order created: ${order._id} (${orderNumber})`);
    } catch (err: unknown) {
      const error = err as { statusCode?: number; message?: string };
      if (
        error.statusCode === 409 ||
        error.message?.includes("already exists")
      ) {
        console.log(
          `Order for payment ${stripePaymentId} already exists, skipping creation and side effects`,
        );
        return;
      }
      throw err;
    }

    // Decrease stock for all products in a single transaction
    const stockTransaction = writeClient.transaction();
    for (const [productId, quantity] of stockUpdates.entries()) {
      stockTransaction.patch(productId, (p) => p.dec({ stock: quantity }));
    }
    await stockTransaction.commit();

    console.log(`Stock updated for ${stockUpdates.size} unique products`);

    // Send emails
    const customerEmail = userEmail ?? session.customer_details?.email;
    const totalItems = Array.from(stockUpdates.values()).reduce(
      (a, b) => a + b,
      0,
    );

    // Email to admin/contact
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: contactEmail,
        subject: `New Order: ${orderNumber}`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

                <!-- Header -->
                <div style="border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 40px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                        Ekimedo
                    </h1>
                    <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #666666;">
                        Order Receipt
                    </p>
                </div>

                <!-- Intro -->
                <div style="margin-bottom: 40px;">
                    <p style="font-size: 16px; line-height: 1.5; margin: 0;">
                        A new order has been confirmed and is currently being processed.
                    </p>
                </div>

                <!-- Order Summary -->
                <div style="margin-bottom: 40px;">
                    <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                        Order Summary
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 10px 0; color: #666666;">Order Number</td>
                            <td style="padding: 10px 0; text-align: right; font-weight: 700;">${orderNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #666666;">Items</td>
                            <td style="padding: 10px 0; text-align: right;">${totalItems} item(s)</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #666666;">Status</td>
                            <td style="padding: 10px 0; text-align: right; text-transform: uppercase; font-size: 11px; font-weight: 700;">PAID</td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 10px 0; font-size: 16px; font-weight: 700; border-top: 1px solid #000000;">Total Amount</td>
                            <td style="padding: 20px 0 10px 0; text-align: right; font-size: 16px; font-weight: 700; border-top: 1px solid #000000;">$${((session.amount_total ?? 0) / 100).toFixed(2)}</td>
                        </tr>
                    </table>
                </div>

                <!-- Shipping & Contact -->
                <div style="display: table; width: 100%; margin-bottom: 40px;">
                    <!-- Customer -->
                    <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
                        <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666; margin-bottom: 10px;">Customer</h3>
                        <p style="font-size: 13px; margin: 0; line-height: 1.4;">
                            ${customerEmail}
                        </p>
                    </div>
                    <!-- Shipping -->
                    <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
                        <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666; margin-bottom: 10px;">Shipping To</h3>
                        <p style="font-size: 13px; margin: 0; line-height: 1.4;">
                            ${
                              address
                                ? `${address.name}
        ${address.line1}
        ${address.line2 ? address.line2 + "\n" : ""}${address.city}
        ${address.postcode}
        ${address.country}`
                                : "No address provided"
                            }
                        </p>
                    </div>
                </div>

                <!-- Action -->
                <div style="margin-bottom: 60px; text-align: center;">
                    <a target="_blank" rel="noopener noreferrer" href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/structure/order;${order._id}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000;">
                        View Order Details
                    </a>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 11px; letter-spacing: 0.5px;">
                        &copy; 2024 EKIMEDO MANAGEMENT SYSTEM. ALL RIGHTS RESERVED.
                    </p>
                </div>

            </div>
        </body>
        </html>
        `,
      });
      console.log(`Order notification email sent to ${contactEmail}`);
    } catch (emailError) {
      console.error("Failed to send order notification email:", emailError);
    }

    // Email to customer
    if (customerEmail) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: customerEmail,
          subject: `Order Confirmation: ${orderNumber}`,
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Order Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

                  <!-- Header -->
                  <div style="border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 40px;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                          Ekimedo
                      </h1>
                      <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #666666;">
                          Order Confirmed
                      </p>
                  </div>

                  <!-- Intro -->
                  <div style="margin-bottom: 40px;">
                      <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">Thank You!</h2>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0; color: #333333;">
                          Thank you for your purchase! Your order has been received and payment has been confirmed. We're currently preparing your items for delivery.
                      </p>
                  </div>

                  <!-- Order Summary -->
                  <div style="margin-bottom: 40px;">
                      <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                          Order Confirmation
                      </h2>
                      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                          <tr>
                              <td style="padding: 10px 0; color: #666666;">Order Number</td>
                              <td style="padding: 10px 0; text-align: right; font-weight: 700;">${orderNumber}</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #666666;">Items</td>
                              <td style="padding: 10px 0; text-align: right;">${totalItems} item(s)</td>
                          </tr>
                          <tr>
                              <td style="padding: 10px 0; color: #666666;">Payment Status</td>
                              <td style="padding: 10px 0; text-align: right; text-transform: uppercase; font-size: 11px; font-weight: 700;">✓ Confirmed</td>
                          </tr>
                          <tr>
                              <td style="padding: 20px 0 10px 0; font-size: 16px; font-weight: 700; border-top: 1px solid #000000;">Total Amount</td>
                              <td style="padding: 20px 0 10px 0; text-align: right; font-size: 16px; font-weight: 700; border-top: 1px solid #000000;">$${((session.amount_total ?? 0) / 100).toFixed(2)}</td>
                          </tr>
                      </table>
                  </div>

                  <!-- Next Steps / Info Box -->
                  <div style="border: 1px solid #000000; padding: 20px; margin-bottom: 40px;">
                      <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 10px;">What's next?</h3>
                      <p style="font-size: 14px; margin: 0; line-height: 1.5; color: #333333;">
                          Our team is now processing your order. You will receive a notification email as soon as your items have been dispatched.
                      </p>
                  </div>

                  <!-- Contact Section -->
                  <div style="margin-bottom: 40px;">
                      <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666; margin-bottom: 10px;">Questions?</h3>
                      <p style="font-size: 13px; margin: 0; line-height: 1.5; color: #333333;">
                          If you have any questions about your order, please don't hesitate to reach out to our customer service team.
                      </p>
                  </div>

                  <!-- Action -->
                  <div style="margin-bottom: 60px; text-align: center;">
                      <a target="_blank" rel="noopener noreferrer" href="${process.env.NEXT_PUBLIC_SITE_URL}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000;">
                          Visit Our Website
                      </a>
                  </div>

                  <!-- Footer -->
                  <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
                      <p style="margin: 0 0 10px 0; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Ekimedo</p>
                      <p style="margin: 0; color: #999999; font-size: 11px; letter-spacing: 0.5px; line-height: 1.4;">
                          Discover our latest collections and exclusive designs.<br>
                          &copy; 2024 EKIMEDO. ALL RIGHTS RESERVED.
                      </p>
                  </div>

              </div>
          </body>
          </html>
          `,
        });
        console.log(`Order confirmation email sent to ${customerEmail}`);
      } catch (emailError) {
        console.error(
          "Failed to send customer confirmation email:",
          emailError,
        );
      }
    }
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    throw error; // Re-throw to return 500 and trigger Stripe retry
  }
}
