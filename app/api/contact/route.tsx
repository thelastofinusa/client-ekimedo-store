import { NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { SOCIAL_QUERY } from "@/sanity/queries/social";
import { env } from "@/lib/env";
import { siteConfig } from "@/site.config";
import { ContactInquiryEmail } from "@/emails/contact-inquiry";
import { formSchema } from "@/lib/validators/contact-form";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = formSchema.safeParse(body);

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

    const { fName, lName, email, phone, inquiryType, message } = result.data;
    const fullName = `${fName} ${lName}`.trim();

    const contactEmail = env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;
    if (!contactEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: "Contact email is not configured." },
        { status: 500 },
      );
    }

    const socialHandles = await client.fetch(SOCIAL_QUERY);

    const emailHtml = await render(
      <ContactInquiryEmail
        fullName={fullName}
        email={email}
        phone={phone}
        inquiryType={inquiryType}
        message={message}
        socialLinks={socialHandles || []}
        siteUrl={env.NEXT_PUBLIC_SITE_URL}
      />,
    );

    const { error } = await resend.emails.send({
      from: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
      to: contactEmail,
      replyTo: email,
      subject: `Inquiry: ${inquiryType} – ${fullName}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
