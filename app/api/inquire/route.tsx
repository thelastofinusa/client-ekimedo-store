import { NextResponse } from "next/server";
import { Resend } from "resend";
import { client, writeClient } from "@/sanity/lib/client";
import { SOCIAL_QUERY } from "@/sanity/queries/social";
import { env } from "@/lib/env";
import { randomUUID } from "crypto";
import { siteConfig } from "@/site.config";
import { inquireFormSchema } from "@/lib/validators/inquire-form";
import { CustomOrderInquiryEmail } from "@/emails/custom-order-inquiry";
import { render } from "@react-email/render";

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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Convert FormData to object for Zod validation
    const rawData: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "inspirationPhotos") {
        rawData[key] = value;
      }
    }

    const result = inquireFormSchema.safeParse(rawData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { fullName, email, phone, eventType, eventDate, budget, dreamDress } =
      result.data;
    const inspirationPhotos = formData.getAll("inspirationPhotos") as File[];

    const contactEmail = env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;
    if (!contactEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: "Contact email is not configured." },
        { status: 500 },
      );
    }

    // 1. Upload images to Sanity
    const imageAssetIds: string[] = [];
    if (inspirationPhotos && inspirationPhotos.length > 0) {
      for (const file of inspirationPhotos) {
        if (file.size > 0 && file instanceof File) {
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
      eventDate: eventDate.toISOString().split("T")[0], // YYYY-MM-DD
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
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const socialHandles = await client.fetch(SOCIAL_QUERY);

    const emailHtml = await render(
      <CustomOrderInquiryEmail
        fullName={fullName}
        email={email}
        phone={phone}
        eventTypeLabel={eventTypeLabel}
        formattedDate={formattedDate}
        budgetLabel={budgetLabel}
        dreamDress={dreamDress}
        imageCount={imageAssetIds.length}
        inquiryId={inquiryId}
        socialLinks={socialHandles || []}
        siteUrl={env.NEXT_PUBLIC_SITE_URL}
      />,
    );

    const { error } = await resend.emails.send({
      from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
      to: contactEmail,
      replyTo: email,
      subject: `New Custom Order Inquiry: ${fullName}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      // We log but don't fail because the inquiry is saved in Sanity
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
