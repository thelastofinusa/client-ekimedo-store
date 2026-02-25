import { siteConfig } from "@/site.config";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Heading,
  Button,
} from "@react-email/components";
import * as React from "react";
import {
  main,
  container,
  header,
  logo,
  content,
  heading,
  paragraph,
  detailsCard,
  infoGrid,
  infoRow,
  infoLabel,
  infoValue,
  buttonContainer,
  button,
  footer,
  footerBrand,
  footerText,
  socialContainer,
  socialLink,
} from "./styles";

interface SocialLink {
  name: string | null;
  url: string | null;
}

interface AdminBookingNotificationProps {
  customerName: string;
  serviceTitle: string;
  dateTime: string | Date;
  location: "in-person" | "virtual";
  bookingId: string;
  siteUrl?: string;
  socialLinks?: SocialLink[];
  eventDate?: string | Date | null;
  budgetType?: string | null;
  customBudget?: string | null;
  paymentMethod?: string | null;
  rushOrder?: string | null;
  interests?: string[];
  dressSize?: string | null;
  dressColor?: string | null;
  specialRequirements?: string | null;
}

export const AdminBookingNotificationEmail = ({
  customerName,
  serviceTitle,
  dateTime,
  location,
  bookingId,
  siteUrl,
  socialLinks = [],
  eventDate,
  budgetType,
  customBudget,
  paymentMethod,
  rushOrder,
  interests,
  dressSize,
  dressColor,
  specialRequirements,
}: AdminBookingNotificationProps) => {
  const dateObj = new Date(dateTime);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const eventDateStr = eventDate
    ? new Date(eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const budgetLabel =
    (customBudget && customBudget.length > 0 ? customBudget : budgetType) ||
    null;

  const paymentMethodLabel = paymentMethod
    ? paymentMethod === "stripe"
      ? "Credit Card (Stripe)"
      : "PayPal"
    : null;

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          `}
        </style>
      </Head>
      <Preview>
        New Consultation: {serviceTitle} - {customerName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Section style={logo}>
              <Img
                src={`${siteUrl}/logo/logo-charcoal.svg`}
                alt={siteConfig.title}
                width="80"
                height="auto"
              />
            </Section>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>New {serviceTitle} Booking</Heading>

            <Text style={paragraph}>Hello Eki,</Text>
            <Text style={paragraph}>
              A new <strong>{serviceTitle}</strong> has been booked by{" "}
              {customerName}. The details are recorded below.
            </Text>

            {/* Booking Details */}
            <Section style={detailsCard}>
              <table style={infoGrid}>
                <tbody>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Customer</td>
                    <td style={infoValue}>{customerName}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Service</td>
                    <td style={infoValue}>{serviceTitle}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Date & Time</td>
                    <td style={infoValue}>
                      {dateStr}
                      <br />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "#666",
                        }}
                      >
                        {timeStr}
                      </span>
                    </td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Location</td>
                    <td style={infoValue}>
                      {location === "in-person"
                        ? "Showroom (In-Person)"
                        : "Virtual Consultation"}
                    </td>
                  </tr>
                  {eventDateStr && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Event Date</td>
                      <td style={infoValue}>{eventDateStr}</td>
                    </tr>
                  )}
                  {budgetLabel && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Budget</td>
                      <td style={infoValue}>{budgetLabel}</td>
                    </tr>
                  )}
                  <tr style={infoRow}>
                    <td style={infoLabel}>Payment</td>
                    <td style={infoValue}>{paymentMethodLabel}</td>
                  </tr>
                  {rushOrder && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Rush Order</td>
                      <td style={infoValue}>
                        {rushOrder === "yes" ? "Yes" : "No"}
                      </td>
                    </tr>
                  )}
                  {interests && interests.length > 0 && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Interests</td>
                      <td style={infoValue}>{interests.join(", ")}</td>
                    </tr>
                  )}
                  {dressSize && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Dress Size</td>
                      <td style={infoValue}>{dressSize}</td>
                    </tr>
                  )}
                  {dressColor && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Preferred Color</td>
                      <td style={infoValue}>{dressColor}</td>
                    </tr>
                  )}
                  {specialRequirements && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Special Requirements</td>
                      <td style={infoValue}>{specialRequirements}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button
                href={`${siteUrl}/studio/structure/booking;${bookingId}`}
                style={button}
              >
                View in Studio
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>{siteConfig.title}</Text>

            <Section style={socialContainer}>
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.url || "#"} style={socialLink}>
                  {social.name}
                </Link>
              ))}
            </Section>

            <Text style={footerText}>
              This is an automated notification from your booking system.
              <br />© {new Date().getFullYear()} {siteConfig.title}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminBookingNotificationEmail;
