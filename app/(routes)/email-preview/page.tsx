"use client";

import React from "react";
import { Container } from "@/components/shared/container";
import { AdminOrderNotificationEmail } from "@/emails/admin-order-notification";
import { AdminBookingNotificationEmail } from "@/emails/admin-booking-notification";
import { AppointmentConfirmationEmail } from "@/emails/appointment-confirmation";
import { ContactInquiryEmail } from "@/emails/contact-inquiry";
import { CustomOrderInquiryEmail } from "@/emails/custom-order-inquiry";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { render } from "@react-email/render";
import { notFound } from "next/navigation";

import { consultationsData } from "@/lib/constants/consultation";
import { siteConfig } from "@/site.config";

const testSocialLinks = [
  { name: "Instagram", url: "https://instagram.com/ekieajibade" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "Pinterest", url: "https://pinterest.com" },
];

const testOrderItems = [
  {
    name: "Classic Silk Gown",
    quantity: 1,
    price: 1,
    imageUrl: "https://ekimedo.com/twitter-image.png",
  },
  {
    name: "Bridal Veil",
    quantity: 1,
    price: 1,
    imageUrl: "https://ekimedo.com/twitter-image.png",
  },
];

const testAddress = {
  name: "Jane Doe",
  line1: "123 Fashion Ave",
  city: "New York",
  postcode: "10001",
  country: "USA",
};

// Generate dynamic consultation emails
const consultationEmails = consultationsData.flatMap((consultation) => {
  // Determine available locations for this consultation type
  const locationField = consultation.formCards
    .flatMap((card) => card.fields)
    .find((field) => field.name === "location");

  const locations = locationField?.options?.map((opt: any) => opt.value) || [
    "in-person",
  ];

  return locations.map((loc: string) => {
    const isVirtual = loc === "virtual";
    const locationLabel = isVirtual ? "Virtual" : "In-Person";

    return {
      id: `${consultation.slug}-${loc}`,
      name: `${consultation.title} (${locationLabel})`,
      category: consultation.title,
      component: (
        <AppointmentConfirmationEmail
          customerName="Alice Smith"
          serviceTitle={consultation.title}
          serviceSlug={consultation.slug}
          dateTime={new Date()}
          location={loc as "in-person" | "virtual"}
          calendarUrl="https://calendar.google.com"
          siteUrl={siteConfig.url}
          socialLinks={testSocialLinks}
          eventDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
          budgetType="2000-5000"
          paymentMethod="stripe"
          rushOrder="no"
          interests={["Modern", "Classic"]}
        />
      ),
      adminComponent: (
        <AdminBookingNotificationEmail
          customerName="Alice Smith"
          serviceTitle={consultation.title}
          dateTime={new Date()}
          location={loc as "in-person" | "virtual"}
          bookingId="booking_123"
          siteUrl={siteConfig.url}
          socialLinks={testSocialLinks}
          eventDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
          budgetType="2000-5000"
          paymentMethod="stripe"
          rushOrder="no"
          interests={["Modern", "Classic"]}
        />
      ),
    };
  });
});

const otherEmails = [
  {
    id: "admin-order",
    name: "Admin Order Notification",
    category: "Store",
    component: (
      <AdminOrderNotificationEmail
        orderNumber="ORD-12345"
        customerEmail="jane@example.com"
        totalAmount={2}
        items={testOrderItems}
        shippingAddress={testAddress}
        orderId="order_123"
        siteUrl={siteConfig.url}
        socialLinks={testSocialLinks}
      />
    ),
  },
  {
    id: "contact-inquiry",
    name: "Contact Inquiry",
    category: "Forms",
    component: (
      <ContactInquiryEmail
        fullName="Bob Johnson"
        email="bob@example.com"
        phone="+1 234 567 890"
        inquiryType="General Question"
        message="I'm interested in your upcoming collection. When will it be released?"
        socialLinks={testSocialLinks}
        siteUrl={siteConfig.url}
      />
    ),
  },
  {
    id: "custom-order-inquiry",
    name: "Custom Order Inquiry",
    category: "Forms",
    component: (
      <CustomOrderInquiryEmail
        fullName="Sarah Williams"
        email="sarah@example.com"
        phone="+1 987 654 321"
        eventTypeLabel="Wedding"
        formattedDate="October 24, 2026"
        budgetLabel="$5,000+"
        dreamDress="I want a mermaid style gown with long sleeves and heavy lace detailing."
        imageCount={3}
        inquiryId="inq_789"
        socialLinks={testSocialLinks}
        siteUrl={siteConfig.url}
      />
    ),
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation (Customer)",
    category: "Store",
    component: (
      <OrderConfirmationEmail
        orderNumber="ORD-12345"
        customerEmail="jane@example.com"
        totalAmount={2}
        items={testOrderItems}
        siteUrl={siteConfig.url}
        socialLinks={testSocialLinks}
      />
    ),
  },
];

export default function EmailPreview() {
  if (process.env.NODE_ENV === "production") return notFound();

  // Group consultation emails by category
  const groupedConsultations = consultationEmails.reduce(
    (acc, email) => {
      if (!acc[email.category]) {
        acc[email.category] = [];
      }
      acc[email.category].push(email);
      return acc;
    },
    {} as Record<string, typeof consultationEmails>,
  );

  return (
    <div className="min-h-screen bg-neutral-50 py-32 md:py-40">
      <Container size="lg">
        <div className="mb-20">
          <h1 className="mb-12 font-serif text-4xl text-neutral-900">
            Email Previews
          </h1>

          {Object.entries(groupedConsultations).map(([category, items]) => (
            <div key={category} className="mb-20">
              <h2 className="mb-8 border-b pb-4 font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
                {category}
              </h2>
              <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                {(items as typeof consultationEmails).map((item) => (
                  <React.Fragment key={item.id}>
                    <EmailCard
                      name={`${item.name} - Customer`}
                      component={item.component}
                    />
                    <EmailCard
                      name={`${item.name} - Admin`}
                      component={item.adminComponent as React.ReactElement}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-20">
            <h2 className="mb-8 border-b pb-4 font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
              Other Notifications
            </h2>
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {otherEmails.map((email) => (
                <EmailCard
                  key={email.id}
                  name={email.name}
                  component={email.component}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function EmailCard({
  name,
  component,
}: {
  name: string;
  component: React.ReactElement;
}) {
  const [html, setHtml] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function renderEmail() {
      try {
        const rendered = await render(component);
        if (mounted) setHtml(rendered);
      } catch {
        if (mounted) setHtml("<p>Failed to render email</p>");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    renderEmail();
    return () => {
      mounted = false;
    };
  }, [component]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b bg-neutral-100 px-4 py-2">
        <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
          {name}
        </span>
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 rounded-full bg-green-400" />
        </div>
      </div>

      <div className="relative bg-neutral-200 p-3">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-200/60 backdrop-blur-sm">
            <div className="border-charcoal h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}

        <iframe
          srcDoc={html}
          title={name}
          className="h-[700px] w-full rounded bg-white"
        />
      </div>
    </div>
  );
}
