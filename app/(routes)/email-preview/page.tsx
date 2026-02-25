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

const testSocialLinks = [
  { name: "Instagram", url: "https://instagram.com/ekieajibade" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "Pinterest", url: "https://pinterest.com" },
];

const testOrderItems = [
  {
    name: "Classic Silk Gown",
    quantity: 1,
    price: 1200,
    imageUrl: "https://ekimedo.com/twitter-image.png",
  },
  {
    name: "Bridal Veil",
    quantity: 1,
    price: 150,
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

const emails = [
  {
    id: "admin-order",
    name: "Admin Order Notification",
    component: (
      <AdminOrderNotificationEmail
        orderNumber="ORD-12345"
        customerEmail="jane@example.com"
        totalAmount={1350}
        items={testOrderItems}
        shippingAddress={testAddress}
        orderId="order_123"
        siteUrl=""
        socialLinks={testSocialLinks}
      />
    ),
  },
  {
    id: "admin-booking",
    name: "Admin Booking Notification",
    component: (
      <AdminBookingNotificationEmail
        customerName="Alice Smith"
        serviceTitle="Pre-Made Dresses Try-On"
        dateTime={new Date()}
        location="in-person"
        bookingId="booking_456"
        siteUrl=""
        socialLinks={testSocialLinks}
        eventDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)} // 90 days out
        budgetType="2000-5000"
        paymentMethod="stripe"
      />
    ),
  },
  {
    id: "contact-inquiry",
    name: "Contact Inquiry",
    component: (
      <ContactInquiryEmail
        fullName="Bob Johnson"
        email="bob@example.com"
        phone="+1 234 567 890"
        inquiryType="General Question"
        message="I'm interested in your upcoming collection. When will it be released?"
        socialLinks={testSocialLinks}
        siteUrl=""
      />
    ),
  },
  {
    id: "custom-order-inquiry",
    name: "Custom Order Inquiry",
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
        siteUrl=""
      />
    ),
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation (Customer)",
    component: (
      <OrderConfirmationEmail
        orderNumber="ORD-12345"
        customerEmail="jane@example.com"
        totalAmount={1350}
        items={testOrderItems}
        siteUrl=""
        socialLinks={testSocialLinks}
      />
    ),
  },
  {
    id: "appointment-confirmation",
    name: "Appointment Confirmation (Customer)",
    component: (
      <AppointmentConfirmationEmail
        customerName="Alice Smith"
        serviceTitle="Pre-Made Dresses Try-On"
        serviceSlug="try-on"
        dateTime={new Date()}
        location="in-person"
        calendarUrl="https://calendar.google.com"
        siteUrl=""
        socialLinks={testSocialLinks}
        eventDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
        budgetType="2000-5000"
        paymentMethod="stripe"
      />
    ),
  },
];

export default function EmailPreview() {
  if (process.env.NODE_ENV === "production") return notFound();

  return (
    <div className="min-h-screen bg-neutral-50 py-32 md:py-40">
      <Container size="lg">
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              name={email.name}
              component={email.component}
            />
          ))}
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
