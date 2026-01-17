import Stripe from "stripe";
import { Resend } from "resend";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client, writeClient } from "@/sanity/lib/client";
import { ORDER_BY_STRIPE_PAYMENT_ID_QUERY } from "@/sanity/queries/orders";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

if (!process.env.NEXT_PUBLIC_RESENT_CONTACT_EMAIL) {
  throw new Error("NEXT_PUBLIC_RESENT_CONTACT_EMAIL is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover" as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const contactEmail = process.env.NEXT_PUBLIC_RESENT_CONTACT_EMAIL;

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
  const stripePaymentId = session.payment_intent as string;

  try {
    // Idempotency check: prevent duplicate processing on webhook retries
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
    const {
      clerkUserId,
      userEmail,
      sanityCustomerId,
      productIds: productIdsString,
      quantities: quantitiesString,
    } = session.metadata ?? {};

    if (!clerkUserId || !productIdsString || !quantitiesString) {
      console.error("Missing metadata in checkout session");
      return;
    }

    const productIds = productIdsString.split(",");
    const quantities = quantitiesString.split(",").map(Number);

    // Get line items from Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Build order items array
    const orderItems = productIds.map((productId, index) => ({
      _key: `item-${index}`,
      product: {
        _type: "reference" as const,
        _ref: productId,
      },
      quantity: quantities[index],
      priceAtPurchase: lineItems.data[index]?.amount_total
        ? lineItems.data[index].amount_total / 100
        : 0,
    }));

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
    const order = await writeClient.create({
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

    // Decrease stock for all products in a single transaction
    await productIds
      .reduce(
        (tx, productId, i) =>
          tx.patch(productId, (p) => p.dec({ stock: quantities[i] })),
        writeClient.transaction(),
      )
      .commit();

    console.log(`Stock updated for ${productIds.length} products`);

    // Send emails
    const customerEmail = userEmail ?? session.customer_details?.email;
    const orderSummary = `
Order Number: ${orderNumber}
Total: £${((session.amount_total ?? 0) / 100).toFixed(2)}
Items: ${quantities.reduce((a, b) => a + b, 0)} item(s)
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
                <div style="padding: 40px 30px;">
                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    A new order has been placed on Ekie Fashion.
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
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600; color: #667eea;">£${((session.amount_total ?? 0) / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Items:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${quantities.reduce((a, b) => a + b, 0)} item(s)</td>
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
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">View Order in Studio</a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Ekie Fashion • Order Management System
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
                  <div style="padding: 40px 30px;">
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
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600; color: #667eea; font-size: 16px;">£${((session.amount_total ?? 0) / 100).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Items:</strong></td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${quantities.reduce((a, b) => a + b, 0)} item(s)</td>
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
                    <p style="margin: 0 0 12px 0; color: #333333; font-size: 14px; font-weight: 600;">Ekie Fashion</p>
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
