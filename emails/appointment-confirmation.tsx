/* eslint-disable @next/next/no-img-element */
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
  Hr,
  Button,
  Row,
  Column,
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
  link,
  detailsCard,
  infoGrid,
  infoRow,
  infoLabel,
  infoValue,
  policyBox,
  policyTitle,
  policyText,
  accentBox,
  accentTitle,
  accentListItem,
  buttonContainer,
  button,
  footer,
  footerBrand,
  footerText,
  socialContainer,
  socialLink,
  signatureSection,
  signatureText,
} from "./styles";

interface SocialLink {
  name: string | null;
  url: string | null;
}

interface AppointmentConfirmationProps {
  customerName: string;
  serviceTitle: string;
  serviceSlug?: "try-on" | "prom";
  dateTime: string | Date;
  location: "in-person" | "virtual";
  calendarUrl: string;
  siteUrl?: string;
  socialLinks?: SocialLink[];
  eventDate?: string | Date | null;
  budgetType?: string | null;
  customBudget?: string | null;
  paymentMethod?: string | null;
}

export const AppointmentConfirmationEmail = ({
  customerName,
  serviceTitle,
  serviceSlug,
  dateTime,
  location,
  calendarUrl,
  siteUrl,
  socialLinks = [],
  eventDate,
  budgetType,
  customBudget,
  paymentMethod,
}: AppointmentConfirmationProps) => {
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
      <Preview>Appointment Confirmed: {serviceTitle}</Preview>
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
            <Heading style={heading}>We look forward to meeting you</Heading>

            <Text style={paragraph}>
              Dear {customerName}, we are delighted to confirm your upcoming
              consultation for <strong>{serviceTitle}</strong>.
            </Text>

            {/* Details Table */}
            <Section style={detailsCard}>
              <table style={infoGrid}>
                <tbody>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Service</td>
                    <td style={infoValue}>{serviceTitle}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>When</td>
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
                    <td style={infoLabel}>Where</td>
                    <td style={infoValue}>
                      {location === "in-person" ? (
                        <>
                          Showroom (In-Person)
                          <br />
                          <Link
                            href="https://maps.app.goo.gl/bpVmXDswvhJ9Y72K7"
                            style={{ ...link, fontSize: "12px" }}
                          >
                            1211 Marblewood Ave, Capitol Heights, MD 20743 →
                          </Link>
                        </>
                      ) : (
                        "Virtual Consultation (Zoom/Meet)"
                      )}
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
                  {paymentMethodLabel && (
                    <tr style={infoRow}>
                      <td style={infoLabel}>Payment</td>
                      <td style={infoValue}>{paymentMethodLabel}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {location === "in-person" && serviceSlug === "try-on" ? (
              <Section style={accentBox}>
                <Text style={accentTitle}>
                  Preparing for your try-on consultation
                </Text>
                <Text style={accentListItem}>• Wear nude or brown panties</Text>
                <Text style={accentListItem}>
                  • Avoid using deodorant or body cologne
                </Text>
                <Text style={accentListItem}>
                  • You may try on a maximum of 3 dresses within your 1-hour
                  session
                </Text>
              </Section>
            ) : (
              location === "in-person" && (
                <Section style={accentBox}>
                  <Text style={accentTitle}>
                    Preparing for your measurement session
                  </Text>
                  <Text style={accentListItem}>
                    • Wear a fitted outfit for accurate measurements
                  </Text>
                  <Text style={accentListItem}>
                    • Bring at least three style inspirations to discuss with
                    the head designer
                  </Text>
                </Section>
              )
            )}

            {/* Policy Section */}
            <Section style={policyBox}>
              <Text style={policyTitle}>Arrival & Cancellation Policy</Text>
              <Text style={policyText}>
                Please arrive promptly for your consultation. A late fee of $20
                applies after 10 minutes, and appointments are automatically
                canceled after 15 minutes of delay.
              </Text>
              {location === "in-person" && (
                <Text style={policyText}>
                  Use the walk-way, the visitors parking lot by the
                  building&apos;s side, or call or text{" "}
                  <Link
                    href="tel:+12029074865"
                    style={{ ...link, fontWeight: "600" }}
                  >
                    202-907-4865
                  </Link>{" "}
                  when you get there. Parking is free.
                </Text>
              )}
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button href={calendarUrl} style={button}>
                Add to Calendar
              </Button>
            </Section>

            <Section style={signatureSection}>
              <Text style={{ ...paragraph, marginBottom: "10px" }}>
                Best regards,
              </Text>
              <Text style={signatureText}>{siteConfig.author.fullName}</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Link href={siteUrl} style={footerBrand}>
              {siteConfig.title}
            </Link>

            <Section style={socialContainer}>
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.url || "#"} style={socialLink}>
                  {social.name}
                </Link>
              ))}
            </Section>

            <Text style={footerText}>
              Need to reschedule? Send an email to{" "}
              <Link href="mailto:info@ekimedo.com">info@ekimedo.com</Link>.
              <br />© {new Date().getFullYear()} {siteConfig.title}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AppointmentConfirmationEmail;
