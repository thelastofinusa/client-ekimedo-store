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
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 20px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">New Contact Inquiry</h1>
              </div>
              <div style="padding: 24px;">
                <table style="width: 100%; font-size: 14px; color: #333;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${escapeHtml(fullName)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;"><a href="mailto:${escapeHtml(params.email)}">${escapeHtml(params.email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${escapeHtml(params.phone)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Inquiry type</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${escapeHtml(params.inquiryType)}</td>
                  </tr>
                </table>
                <div style="margin-top: 24px;">
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                  <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(params.message)}</p>
                </div>
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
