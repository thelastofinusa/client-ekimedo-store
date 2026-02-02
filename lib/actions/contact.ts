"use server";

import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendContactMessageResult =
  | { success: true }
  | { success: false; error: string };

export async function sendContactMessage(params: {
  fName: string;
  lName: string;
  email: string;
  inquiryType: string;
  phone: string;
  message: string;
}): Promise<SendContactMessageResult> {
  try {
    const contactEmail = env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;
    if (!contactEmail?.trim()) {
      return { success: false, error: "Contact email is not configured." };
    }
    const fullName = `${params.fName} ${params.lName}`.trim() || params.email;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: contactEmail,
      replyTo: params.email,
      subject: `Inquiry: ${params.inquiryType} – ${fullName}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Inquiry</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

              <!-- Header -->
              <div style="border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 40px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                      Ekimedo
                  </h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #666666;">
                      Contact Inquiry Received
                  </p>
              </div>

              <!-- Details Table -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                      Sender Information
                  </h2>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Name</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700; border-bottom: 1px solid #eeeeee;">${escapeHtml(fullName)}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Email</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">
                              <a href="mailto:${escapeHtml(params.email)}" style="color: #000000; text-decoration: underline;">${escapeHtml(params.email)}</a>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Phone</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${escapeHtml(params.phone)}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666;">Inquiry Type</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700;">${escapeHtml(params.inquiryType)}</td>
                      </tr>
                  </table>
              </div>

              <!-- Message Content -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 15px;">
                      Message
                  </h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #333333; white-space: pre-wrap;">
                      ${escapeHtml(params.message)}
                  </div>
              </div>

              <!-- Action -->
              <div style="margin-bottom: 60px; text-align: center;">
                  <a href="mailto:${escapeHtml(params.email)}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000;">
                      Reply to Inquiry
                  </a>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Ekimedo Admin</p>
                  <p style="margin: 0; color: #999999; font-size: 11px; letter-spacing: 0.5px;">
                      Internal Notification • Contact Form Submission
                  </p>
              </div>

          </div>
      </body>
      </html>
      `,
    });

    if (error) {
      console.error("Resend contact form email failed:", error);
      return {
        success: false,
        error: error.message ?? "Failed to send message",
      };
    }
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send message";
    console.error("Contact form error:", err);
    return { success: false, error: message };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
