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
        <html>
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Booking Received</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6; padding: 0 20px;">A new consultation has been booked on Ekimedo.</p>
                <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 20px; border-radius: 4px;">
                  <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
                  <table style="width: 100%; font-size: 14px; color: #555555;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Service:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600;">${serviceTitle}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date(dateTime).toLocaleDateString()}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; text-transform: capitalize;">${location}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Group Size:</strong></td><td style="padding: 8px 0; text-align: right;">${groupSize}</td></tr>
                  </table>
                </div>
                <div style="margin: 24px 20px;">
                  <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Customer Information</h3>
                  <p style="margin: 0 0 8px 0; color: #555555; font-size: 14px;"><strong>Name:</strong> ${customerName}</p>
                  <p style="margin: 0 0 8px 0; color: #555555; font-size: 14px;"><strong>Email:</strong> ${metadataCustomerEmail}</p>
                  <p style="margin: 0; color: #555555; font-size: 14px;"><strong>Phone:</strong> ${customerPhone}</p>
                </div>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/structure/booking;${bookingId}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">View Booking in Studio</a>
                </div>
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

      const customerHtml = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Consultation Confirmed</h1>
              </div>
              <div style="padding: 20px 0;">
                <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6; padding: 0 20px;">Hi ${customerName}, your consultation has been confirmed. We look forward to seeing you.</p>
                <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 20px; border-radius: 4px;">
                  <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
                  <table style="width: 100%; font-size: 14px; color: #555555;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Service:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600;">${serviceTitle}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date(dateTime).toLocaleDateString()}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Location:</strong></td><td style="padding: 8px 0; text-align: right; text-transform: capitalize;">${location}</td></tr>
                  </table>
                </div>
                <p style="margin: 0 24px 24px; color: #666; font-size: 14px;">If you have any questions, reply to this email or contact us.</p>
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

    const orderSummary = `
Order Number: ${orderNumber}
Total: £${((session.amount_total ?? 0) / 100).toFixed(2)}
Items: ${totalItems} item(s)
Status: Paid
    `.trim();

    // Email to admin/contact
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: contactEmail,
        subject: `New Order: ${orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Order Received</h1>
                </div>

                <!-- Content -->
                <div style="padding: 20px 0;">
                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    A new order has been placed on Ekimedo.
                  </p>

                  <!-- Order Details Card -->
                  <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
                    <table style="width: 100%; font-size: 14px; color: #555555;">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Order Number:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;"><code style="background-color: #e8e8e8; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${orderNumber}</code></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Total:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600; color: #667eea;">$${((session.amount_total ?? 0) / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Items:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${totalItems} item(s)</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong>Status:</strong></td>
                        <td style="padding: 8px 0; text-align: right;"><span style="background-color: #d4edda; color: #155724; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">PAID</span></td>
                      </tr>
                    </table>
                  </div>

                  <!-- Customer Email -->
                  <div style="margin: 24px 0;">
                    <p style="margin: 0 0 8px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Customer Email</p>
                    <p style="margin: 0; color: #333333; font-size: 14px;">${customerEmail}</p>
                  </div>

                  <!-- Shipping Address -->
                  <div style="margin: 24px 0; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                    <p style="margin: 0 0 12px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Shipping Address</p>
                    <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-line;">
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

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/structure/order;${order._id}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">View Order in Studio</a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Ekimedo • Order Management System
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
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Thank You!</h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your order has been confirmed</p>
                  </div>

                  <!-- Content -->
                  <div style="padding: 20px 0;">
                    <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Thank you for your purchase! Your order has been received and payment has been confirmed.
                    </p>

                    <!-- Order Confirmation Card -->
                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Order Confirmation</h3>
                      <table style="width: 100%; font-size: 14px; color: #555555;">
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Order Number:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;"><code style="background-color: #e8e8e8; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${orderNumber}</code></td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Total Amount:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600; color: #667eea; font-size: 16px;">$${((session.amount_total ?? 0) / 100).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Items:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${totalItems} item(s)</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
                          <td style="padding: 8px 0; text-align: right;"><span style="background-color: #d4edda; color: #155724; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">✓ CONFIRMED</span></td>
                        </tr>
                      </table>
                    </div>

                    <!-- Info Box -->
                    <div style="background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 16px; margin: 24px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #1565c0; font-size: 14px; line-height: 1.6;">
                        <strong>What's next?</strong><br>
                        We're preparing your order for shipment. You'll receive a tracking number via email as soon as your items ship.
                      </p>
                    </div>

                    <!-- Divider -->
                    <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e0e0;">

                    <!-- Contact Section -->
                    <div style="margin: 24px 0;">
                      <p style="margin: 0 0 12px 0; color: #999999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Questions?</p>
                      <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                        If you have any questions about your order, please don't hesitate to reach out to our customer service team.
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 12px 0; color: #333333; font-size: 14px; font-weight: 600;">Ekimedo</p>
                    <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      Discover our latest collections and exclusive designs.<br>
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #667eea; text-decoration: none;">Visit our website</a>
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
