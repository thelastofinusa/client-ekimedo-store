"use server";

import { writeClient } from "@/sanity/lib/client";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { randomUUID } from "crypto";
import { siteConfig } from "@/site.config";

const resend = new Resend(process.env.RESEND_API_KEY);

const EVENT_TYPES: Record<string, string> = {
  wedding: "Wedding",
  prom: "Prom",
  reception: "Reception",
  "special-occasion": "Special Occasion",
};

const BUDGET_RANGES: Record<string, string> = {
  "under-500": "Under $500",
  "500-1000": "$500 - $1,000",
  "1000-2500": "$1,000 - $2,500",
  "2500-5000": "$2,500 - $5,000",
  "over-5000": "$5,000+",
};

export type SubmitInquiryResult =
  | { success: true }
  | { success: false; error: string };

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function submitInquiry(
  formData: FormData,
): Promise<SubmitInquiryResult> {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const eventType = formData.get("eventType") as string;
    const eventDate = formData.get("eventDate") as string;
    const budget = formData.get("budget") as string;
    const dreamDress = formData.get("dreamDress") as string;
    const inspirationPhotos = formData.getAll("inspirationPhotos") as File[];

    if (
      !fullName ||
      !email ||
      !phone ||
      !eventType ||
      !eventDate ||
      !budget ||
      !dreamDress
    ) {
      return { success: false, error: "Missing required fields" };
    }

    const contactEmail = env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;
    if (!contactEmail?.trim()) {
      console.error("Contact email is not configured.");
      return { success: false, error: "Contact email is not configured." };
    }

    // 1. Upload images to Sanity
    const imageAssetIds: string[] = [];
    if (inspirationPhotos && inspirationPhotos.length > 0) {
      for (const file of inspirationPhotos) {
        if (file.size > 0) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const asset = await writeClient.assets.upload("image", buffer, {
            filename: file.name,
          });
          imageAssetIds.push(asset._id);
        }
      }
    }

    // 2. Create Inquiry in Sanity
    const inquiry = await writeClient.create({
      _type: "inquiry",
      fullName,
      email,
      phone,
      eventType,
      eventDate, // Expecting ISO string or YYYY-MM-DD
      budget,
      dreamDress,
      inspirationPhotos: imageAssetIds.map((id) => ({
        _key: randomUUID(),
        _type: "image",
        asset: {
          _type: "reference",
          _ref: id,
        },
      })),
      status: "new",
    });

    const inquiryId = inquiry._id;

    // 3. Send Email via Resend
    const eventTypeLabel = EVENT_TYPES[eventType] || eventType;
    const budgetLabel = BUDGET_RANGES[budget] || budget;
    const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: contactEmail,
      replyTo: email,
      subject: `New Custom Order Inquiry: ${fullName}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Custom Order Inquiry</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

              <!-- Header -->
              <div style="border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 40px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                      ${siteConfig.title}
                  </h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #666666;">
                      Custom Order Inquiry Received
                  </p>
              </div>

              <!-- Customer Details -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                      Customer Information
                  </h2>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Name</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700; border-bottom: 1px solid #eeeeee;">${escapeHtml(fullName)}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Email</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">
                              <a href="mailto:${escapeHtml(email)}" style="color: #000000; text-decoration: underline;">${escapeHtml(email)}</a>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Phone</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${escapeHtml(phone)}</td>
                      </tr>
                  </table>
              </div>

              <!-- Event Details -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">
                      Event Details
                  </h2>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Event Type</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700; border-bottom: 1px solid #eeeeee;">${escapeHtml(eventTypeLabel)}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Event Date</td>
                          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${escapeHtml(formattedDate)}</td>
                      </tr>
                      <tr>
                          <td style="padding: 12px 0; color: #666666;">Estimated Budget</td>
                          <td style="padding: 12px 0; text-align: right; font-weight: 700;">${escapeHtml(budgetLabel)}</td>
                      </tr>
                  </table>
              </div>

              <!-- Vision / Description -->
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 15px;">
                      Dream Dress Vision
                  </h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #333333; white-space: pre-wrap;">
                      ${escapeHtml(dreamDress)}
                  </div>
              </div>

              <!-- Inspiration Photos Note -->
              ${
                imageAssetIds.length > 0
                  ? `
              <div style="margin-bottom: 40px;">
                  <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 15px;">
                      Inspiration Photos
                  </h2>
                  <p style="font-size: 14px; color: #666666;">
                      ${imageAssetIds.length} photo(s) attached and uploaded to CMS.
                  </p>
              </div>
              `
                  : ""
              }

              <!-- Action -->
              <div style="margin-bottom: 60px; text-align: center;">
                  <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000;">
                      Reply to Customer
                  </a>
                  <a href="${env.NEXT_PUBLIC_SITE_URL}/studio/structure/inquiry;${inquiryId}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 15px 40px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000000; margin-left: 10px;">
                      Open in Studio
                  </a>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${siteConfig.title} Admin</p>
                  <p style="margin: 0; color: #999999; font-size: 11px; letter-spacing: 0.5px;">
                      Automated notification from your website.
                  </p>
              </div>

          </div>
      </body>
      </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // We don't fail the whole request if email fails, but we should probably log it.
      // Or maybe we should warn? For now, we'll return success as the data is safe in Sanity.
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
