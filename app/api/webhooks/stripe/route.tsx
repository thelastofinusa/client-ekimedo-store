import Stripe from "stripe";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client, writeClient } from "@/sanity/lib/client";
import {
  ORDER_BY_STRIPE_PAYMENT_ID_QUERY,
  ORDER_BY_ID_QUERY,
} from "@/sanity/queries/orders";
import { SOCIAL_QUERY } from "@/sanity/queries/social";
import { stripe } from "@/lib/stripe";
import { siteConfig } from "@/site.config";
import { env } from "@/lib/env";

import { AppointmentConfirmationEmail } from "@/emails/appointment-confirmation";
import { AdminBookingNotificationEmail } from "@/emails/admin-booking-notification";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { AdminOrderNotificationEmail } from "@/emails/admin-order-notification";

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
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const socialHandles = await client.fetch(SOCIAL_QUERY);

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
      dateTime,
      endTime,
      location,
      eventDate,
      budgetType,
      customBudget,
      paymentMethod,
    } = metadata;

    if (!bookingId) {
      console.error("Missing bookingId in metadata");
      return;
    }

    try {
      await writeClient.patch(bookingId).set({ status: "confirmed" }).commit();

      console.log(`Booking ${bookingId} confirmed`);

      const adminTo = env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

      if (!adminTo) {
        console.error(
          "Consultation webhook: NEXT_PUBLIC_RESEND_CONTACT_EMAIL is empty, skipping admin email",
        );
      } else {
        const adminHtml = await render(
          <AdminBookingNotificationEmail
            customerName={customerName}
            serviceTitle={serviceTitle}
            dateTime={dateTime}
            location={(location as "in-person") || "virtual"}
            bookingId={bookingId}
            siteUrl={siteConfig.url}
            socialLinks={socialHandles || []}
            eventDate={eventDate}
            budgetType={budgetType}
            customBudget={customBudget}
            paymentMethod={paymentMethod}
          />,
        );

        const { error: adminError } = await resend.emails.send({
          from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
          to: adminTo,
          replyTo: metadataCustomerEmail || undefined,
          subject: `New Appointment: ${serviceTitle}`,
          text: `New appointment confirmed.\nService: ${serviceTitle}\nCustomer: ${customerName}\nDate: ${new Date(dateTime).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${new Date(dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}\nLocation: ${
            location === "in-person" &&
            serviceTitle === "Pre-made Dresses Try On"
              ? "In-Person (Showroom) - 1211 Marblewood Ave, Capitol Heights, MD 20743, USA"
              : location === "in-person"
                ? "In-Person (Showroom)"
                : "Virtual (Zoom/Google Meet)"
          }${
            eventDate
              ? `\nWedding/Event Date: ${new Date(eventDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}`
              : ""
          }${
            budgetType || customBudget
              ? `\nEstimated Budget: ${
                  customBudget && customBudget.length > 0
                    ? customBudget
                    : budgetType
                }`
              : ""
          }${
            paymentMethod
              ? `\nPayment Method: ${String(paymentMethod).toUpperCase()}`
              : ""
          }`,
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

      const customerTo = String(metadataCustomerEmail ?? "").trim() || adminTo;

      if (!customerTo) {
        console.error(
          "Consultation webhook: No valid customer or admin email found, skipping customer confirmation",
        );
      } else {
        const customerHtml = await render(
          <AppointmentConfirmationEmail
            customerName={customerName}
            serviceTitle={serviceTitle}
            dateTime={dateTime}
            location={(location as "in-person") || "virtual"}
            calendarUrl={calendarUrl}
            siteUrl={siteConfig.url}
            socialLinks={socialHandles || []}
            eventDate={eventDate}
            budgetType={budgetType}
            customBudget={customBudget}
            paymentMethod={paymentMethod}
          />,
        );

        const { error: customerError } = await resend.emails.send({
          from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
          to: customerTo,
          replyTo: adminTo,
          subject: `${serviceTitle} Appointment Pending`,
          text: `Dear ${customerName},\n\nYou have successfully booked an appointment with ${siteConfig.title}!\n\nService: ${serviceTitle}\nAppointment Date & Time: ${new Date(dateTime).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${new Date(dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}\nLocation: ${
            location === "in-person" &&
            serviceTitle === "Pre-made Dresses Try On"
              ? "In-Person (Showroom) - 1211 Marblewood Ave, Capitol Heights, MD 20743, USA"
              : location === "in-person"
                ? "In-Person (Showroom)"
                : "Virtual (Zoom/Google Meet)"
          }${
            eventDate
              ? `\nWedding/Event Date: ${new Date(eventDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}`
              : ""
          }${
            budgetType || customBudget
              ? `\nEstimated Budget: ${
                  customBudget && customBudget.length > 0
                    ? customBudget
                    : budgetType
                }`
              : ""
          }${
            paymentMethod
              ? `\nPayment Method: ${String(paymentMethod).toUpperCase()}`
              : ""
          }\n\nPlease be on time. A late fee of $20 applies after 10 mins. Canceled after 15 mins.\n\nLooking forward to meeting you.\n${siteConfig.author.fullName}`,
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
    const address = {
      name: session.customer_details?.name ?? "N/A",
      line1: shippingAddress?.line1 ?? "N/A",
      line2: shippingAddress?.line2 ?? "",
      city: shippingAddress?.city ?? "N/A",
      postcode: shippingAddress?.postal_code ?? "N/A",
      country: shippingAddress?.country ?? "N/A",
    };

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

    const emailItems = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product;
      return {
        name: product.name,
        quantity: item.quantity ?? 1,
        price: item.amount_total / 100 / (item.quantity ?? 1),
        imageUrl: product.images?.[0] || undefined,
      };
    });

    // Email to admin/contact
    try {
      const adminHtml = await render(
        <AdminOrderNotificationEmail
          orderNumber={orderNumber}
          customerEmail={customerEmail || "Unknown"}
          totalAmount={(session.amount_total ?? 0) / 100}
          items={emailItems}
          shippingAddress={address}
          orderId={order._id}
          siteUrl={siteConfig.url}
          socialLinks={socialHandles || []}
        />,
      );

      await resend.emails.send({
        from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
        to: contactEmail,
        replyTo: customerEmail,
        subject: `New Order: ${orderNumber}`,
        text: `New order received.\nOrder Number: ${orderNumber}\nCustomer: ${customerEmail}\nTotal: $${((session.amount_total ?? 0) / 100).toFixed(2)}\nStatus: PAID`,
        html: adminHtml,
      });
      console.log(`Order notification email sent to ${contactEmail}`);
    } catch (emailError) {
      console.error("Failed to send order notification email:", emailError);
    }

    // Email to customer
    if (customerEmail) {
      try {
        const customerHtml = await render(
          <OrderConfirmationEmail
            orderNumber={orderNumber}
            customerEmail={customerEmail}
            totalAmount={(session.amount_total ?? 0) / 100}
            items={emailItems}
            siteUrl={siteConfig.url}
            socialLinks={socialHandles || []}
          />,
        );

        await resend.emails.send({
          from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
          to: customerEmail,
          replyTo: contactEmail,
          subject: `Order Confirmation: ${orderNumber}`,
          text: `Order confirmed!\nOrder Number: ${orderNumber}\nTotal: $${((session.amount_total ?? 0) / 100).toFixed(2)}\n\nThank you for your purchase!`,
          html: customerHtml,
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

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  const socialHandles = await client.fetch(SOCIAL_QUERY);
  const { orderId } = paymentIntent.metadata;

  if (!orderId) {
    console.log("No orderId in payment intent metadata, skipping");
    return;
  }

  // Fetch order
  const order = await client.fetch(ORDER_BY_ID_QUERY, { id: orderId });

  if (!order) {
    console.error(`Order ${orderId} not found`);
    return;
  }

  if (order.status === "paid") {
    console.log(`Order ${orderId} already paid`);
    return;
  }

  // Update status and decrease stock
  const stockUpdates = new Map<string, number>();
  // Use order.items which are already in Sanity format
  // Note: ORDER_BY_ID_QUERY returns items with product expanded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const item of (order.items || []) as any[]) {
    if (item.product?._id) {
      stockUpdates.set(
        item.product._id,
        (stockUpdates.get(item.product._id) || 0) + (item.quantity || 1),
      );
    }
  }

  // Extract shipping address from paymentIntent if available
  const shipping = paymentIntent.shipping;
  const addressUpdate = shipping
    ? {
        address: {
          name: shipping.name ?? "",
          line1: shipping.address?.line1 ?? "",
          line2: shipping.address?.line2 ?? "",
          city: shipping.address?.city ?? "",
          postcode: shipping.address?.postal_code ?? "",
          country: shipping.address?.country ?? "",
        },
      }
    : {};

  const transaction = writeClient.transaction();
  transaction.patch(orderId, (p) =>
    p.set({
      status: "paid",
      ...addressUpdate,
    }),
  );

  for (const [productId, quantity] of stockUpdates.entries()) {
    transaction.patch(productId, (p) => p.dec({ stock: quantity }));
  }

  await transaction.commit();
  console.log(`Order ${orderId} marked as paid and stock updated`);

  // Send emails
  const customerEmail =
    paymentIntent.receipt_email ??
    order.email ??
    paymentIntent.metadata.userEmail;
  const orderNumber = order.orderNumber;
  const amountTotal = paymentIntent.amount;
  const rawAddress = shipping
    ? {
        name: shipping.name ?? "",
        line1: shipping.address?.line1 ?? "",
        line2: shipping.address?.line2 ?? "",
        city: shipping.address?.city ?? "",
        postcode: shipping.address?.postal_code ?? "",
        country: shipping.address?.country ?? "",
      }
    : order.address;

  const address = {
    name: rawAddress?.name || "N/A",
    line1: rawAddress?.line1 || "N/A",
    line2: rawAddress?.line2 || "",
    city: rawAddress?.city || "N/A",
    postcode: rawAddress?.postcode || "N/A",
    country: rawAddress?.country || "N/A",
  };

  // Generate items for email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emailItems = ((order.items || []) as any[]).map((item) => {
    const product = item.product || {};
    return {
      name: product.name || "Item",
      quantity: item.quantity || 1,
      price: (item.priceAtPurchase || 0) / 100,
      imageUrl: product.image?.asset?.url || undefined,
    };
  });

  // Email to admin/contact
  try {
    const adminHtml = await render(
      <AdminOrderNotificationEmail
        orderNumber={orderNumber || "Unknown"}
        customerEmail={customerEmail || "Unknown"}
        totalAmount={(amountTotal ?? 0) / 100}
        items={emailItems}
        shippingAddress={address || undefined}
        orderId={order._id}
        siteUrl={siteConfig.url}
        socialLinks={socialHandles || []}
      />,
    );

    await resend.emails.send({
      from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
      to: contactEmail,
      replyTo: customerEmail,
      subject: `New Order: ${orderNumber}`,
      text: `New order received.\nOrder Number: ${orderNumber}\nCustomer: ${customerEmail}\nTotal: $${((amountTotal ?? 0) / 100).toFixed(2)}\nStatus: PAID`,
      html: adminHtml,
    });
    console.log(`Order notification email sent to ${contactEmail}`);
  } catch (emailError) {
    console.error("Failed to send order notification email:", emailError);
  }

  // Email to customer
  if (customerEmail) {
    try {
      const customerHtml = await render(
        <OrderConfirmationEmail
          orderNumber={orderNumber || "Unknown"}
          customerEmail={customerEmail}
          totalAmount={(amountTotal ?? 0) / 100}
          items={emailItems}
          siteUrl={siteConfig.url}
          socialLinks={socialHandles || []}
        />,
      );

      await resend.emails.send({
        from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
        to: customerEmail,
        replyTo: contactEmail,
        subject: `Order Confirmation: ${orderNumber}`,
        text: `Order confirmed!\nOrder Number: ${orderNumber}\nTotal: $${((amountTotal ?? 0) / 100).toFixed(2)}\n\nThank you for your purchase!`,
        html: customerHtml,
      });
      console.log(`Order confirmation email sent to ${customerEmail}`);
    } catch (emailError) {
      console.error("Failed to send customer confirmation email:", emailError);
    }
  }
}
