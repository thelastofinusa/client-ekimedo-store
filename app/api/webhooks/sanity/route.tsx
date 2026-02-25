import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { headers } from "next/headers";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { client, writeClient } from "@/sanity/lib/client";
import { SOCIAL_QUERY } from "@/sanity/queries/social";
import { siteConfig } from "@/site.config";
import { env } from "@/lib/env";

import {
  AppointmentConfirmationEmail,
  AppointmentConfirmationProps,
} from "@/emails/appointment-confirmation";

const resend = new Resend(env.RESEND_API_KEY);
const secret = env.SANITY_WEBHOOK_SECRET;

async function renderConfirmationEmail(props: AppointmentConfirmationProps) {
  return await render(<AppointmentConfirmationEmail {...props} />);
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get(SIGNATURE_HEADER_NAME);

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 401 });
    }

    if (!isValidSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const jsonBody = JSON.parse(body);
    const { _id, status, confirmationEmailSent } = jsonBody;

    console.log(`[Sanity Webhook] Received update for ${_id}:`, {
      status,
      confirmationEmailSent,
    });

    // Only process if status is 'confirmed' and email hasn't been sent yet
    if (status !== "confirmed" || confirmationEmailSent === true) {
      console.log(`[Sanity Webhook] Skipping processing for ${_id}`);
      return NextResponse.json({ message: "No action needed" });
    }

    // Fetch full booking details from Sanity to double check status and flag
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
        customBudget,
        paymentMethod,
        rushOrder,
        status,
        confirmationEmailSent
      }`,
      { id: _id },
    );

    if (!booking) {
      console.log(`[Sanity Webhook] Booking ${_id} not found`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (
      booking.status !== "confirmed" ||
      booking.confirmationEmailSent === true
    ) {
      console.log(`[Sanity Webhook] Re-verification failed for ${_id}:`, {
        status: booking.status,
        confirmationEmailSent: booking.confirmationEmailSent,
      });
      return NextResponse.json({ message: "No action needed (re-verified)" });
    }

    console.log(`[Sanity Webhook] Processing confirmation email for ${_id}`);

    const socialHandles = await client.fetch(SOCIAL_QUERY);
    const customerName = `${booking.fName} ${booking.lName}`.trim();

    // Prepare Calendar URL
    const start = new Date(booking.consultationDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const end = booking.endTime
      ? new Date(booking.endTime).toISOString().replace(/-|:|\.\d+/g, "")
      : new Date(new Date(booking.consultationDate).getTime() + 60 * 60 * 1000)
          .toISOString()
          .replace(/-|:|\.\d+/g, "");

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      booking.service,
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      `Consultation with ${customerName}`,
    )}&location=${encodeURIComponent(
      booking.location === "in-person"
        ? "https://maps.app.goo.gl/bpVmXDswvhJ9Y72K7"
        : booking.location,
    )}`;

    // Render email
    const customerHtml = await renderConfirmationEmail({
      customerName,
      serviceTitle: booking.service,
      dateTime: booking.consultationDate,
      location: booking.location as "in-person" | "virtual",
      calendarUrl,
      siteUrl: siteConfig.url,
      socialLinks: socialHandles || [],
      eventDate: booking.eventDate,
      budgetType: booking.budget,
      customBudget: booking.customBudget,
      paymentMethod: booking.paymentMethod,
      rushOrder: booking.rushOrder ? "yes" : "no",
    });

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
      to: booking.email,
      replyTo: env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL,
      subject: `${booking.service} Appointment`,
      html: customerHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    // Mark as sent in Sanity and add audit log entry
    await writeClient
      .patch(_id)
      .set({ confirmationEmailSent: true })
      .append("auditLog", [
        {
          _key: randomUUID(),
          timestamp: new Date().toISOString(),
          action: "CONFIRMATION_EMAIL_SENT",
          note: `Appointment confirmation email sent to ${booking.email} after manual approval.`,
        },
      ])
      .commit();

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent",
    });
  } catch (error) {
    console.error("Sanity webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
