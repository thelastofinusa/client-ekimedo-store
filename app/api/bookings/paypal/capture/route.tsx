import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { paypalClient } from "@/lib/paypal";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { client, writeClient } from "@/sanity/lib/client";
import { SOCIAL_QUERY } from "@/sanity/queries/social";
import {
  AdminBookingNotificationEmail,
  AdminBookingNotificationProps,
} from "@/emails/admin-booking-notification";
import { siteConfig } from "@/site.config";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

async function renderAdminBookingNotification(
  props: AdminBookingNotificationProps,
) {
  return await render(<AdminBookingNotificationEmail {...props} />);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token"); // PayPal order ID
    const bookingId = searchParams.get("booking_id");

    if (!token || !bookingId) {
      return NextResponse.redirect(
        new URL("/consultation?canceled=true", req.url),
      );
    }

    // Capture the payment
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token);
    // @ts-expect-error - PayPal SDK types might be outdated for empty body
    request.requestBody({});

    const response = await paypalClient.client().execute(request);

    if (response.result.status === "COMPLETED") {
      // Update booking status in Sanity to 'paid' (NOT 'confirmed')
      await writeClient
        .patch(bookingId)
        .set({
          status: "paid",
          paymentStatus: "paid",
          paypalOrderId: token,
        })
        .append("auditLog", [
          {
            _key: randomUUID(),
            timestamp: new Date().toISOString(),
            action: "PAYMENT_RECEIVED",
            note: `PayPal payment captured (${token}).`,
          },
        ])
        .commit();

      // Send admin notification email (same as the Stripe path)
      try {
        const booking = await client.fetch(
          `*[_type == "booking" && _id == $id][0]{
            fName,
            lName,
            email,
            service,
            consultationDate,
            endTime,
            location,
            eventDate,
            budget,
            paymentMethod,
            rushOrder
          }`,
          { id: bookingId },
        );

        if (booking) {
          const socialHandles = await client.fetch(SOCIAL_QUERY);
          const customerName = `${booking.fName} ${booking.lName}`.trim();
          const adminTo = env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

          if (adminTo) {
            const adminHtml = await renderAdminBookingNotification({
              customerName: customerName,
              serviceTitle: booking.service,
              dateTime: booking.consultationDate,
              location: (booking.location as "in-person") || "virtual",
              bookingId: bookingId,
              siteUrl: siteConfig.url,
              socialLinks: socialHandles || [],
              eventDate: booking.eventDate,
              budgetType: booking.budget,
              paymentMethod: "paypal",
              rushOrder: booking.rushOrder ? "yes" : "no",
            });

            const { error: adminError } = await resend.emails.send({
              from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
              to: adminTo,
              replyTo: booking.email || undefined,
              subject: `New Appointment: ${booking.service}`,
              html: adminHtml,
            });

            if (adminError) {
              console.error(
                "PayPal capture: failed to send admin notification email:",
                adminError,
              );
            } else {
              console.log(
                `PayPal capture: admin notification email sent to ${adminTo}`,
              );
            }
          }
        }
      } catch (emailError) {
        // Non-fatal: log but don't fail the redirect
        console.error(
          "PayPal capture: error sending admin notification:",
          emailError,
        );
      }

      return NextResponse.redirect(
        new URL("/consultation?success=true", req.url),
      );
    } else {
      return NextResponse.redirect(
        new URL("/consultation?canceled=true", req.url),
      );
    }
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.redirect(
      new URL("/consultation?canceled=true", req.url),
    );
  }
}
