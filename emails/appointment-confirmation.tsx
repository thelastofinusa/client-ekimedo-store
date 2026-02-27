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
  logoSvg,
} from "@/styles/email.styles";

interface SocialLink {
  name: string | null;
  url: string | null;
}

export interface AppointmentConfirmationProps {
  customerName: string;
  serviceTitle: string;
  serviceSlug?: string;
  dateTime: string | Date;
  location: "in-person" | "virtual";
  calendarUrl: string;
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
  rushOrder,
  interests,
  dressSize,
  dressColor,
  specialRequirements,
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
              <svg
                width="80"
                height="auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 315"
              >
                <path
                  fill="currentColor"
                  d="M234.87,312.28H.08c-.11-2.74-.14-6.2.2-10.13.2-2.24.5-4.63.99-7.12,1.01-5.37,2.78-11.23,5.8-17.11,5.19-10.04,12.49-17.13,21.23-22.56,33.27-20.72,87.51-17.58,125.91-62.03,7.36-8.53,26.14-30.91,22.46-58.23-.39-2.92-4.35-30-25.93-39.27-15.92-6.84-34.88-1.19-46.95,8.07-27.71,21.25-15.4,58.7-41.9,71.63-7.57,3.71-18.45,5.47-28.97,2.17-1.85-.57-3.55-1.27-5.13-2.06-3.83-2.01-11.68-6.78-17.9-16.14-5.85-8.81-7.12-17.3-7.93-22.92-.59-4.01-.7-7.41-.69-9.85V3.78h53.4s-.04,0-.04.01h1.55c-.1,0-.24-.01-.42-.01h178.62c.1,17.01.18,34.03.28,51.04-10.55-14.91-25.96-30.52-47.07-34-3.94-.66-6.94-.71-8.32-.71-28.67.06-57.35.1-86,.14-1.2,0-3.47.14-6.47.32-10.26.64-19.08,1.78-22.07,2.29-9.53,1.63-23.4,7.76-33,18.15-14.36,15.54-14.44,35.48-14.5,49.34-.01,3.45.29,53.49,24.82,61.56,5.18,1.7,9.67.96,10.69.77,21.25-4,20.04-38.87,41.12-59.56,24-23.55,75.91-27.76,101.42-2.69,17.25,16.97,19.19,41.22,19.83,52.53.32,5.45,1.79,38.74-17.83,64.73-43.29,57.36-149.73,26.92-166.46,71.91-.01.07-.04.14-.07.21-3.01,8.25,3.29,16.97,12.07,16.9,34.46-.22,68.91-.62,103.38-1.16,11.08-.17,22.14-.36,33.19-.57h.08s.07.01.11.01c.38,0,1.17-.01,2.18-.06,1.55-.07,3.58-.24,5.94-.66,21.75-3.83,37-22.36,47.15-39.82,0,19.27.01,38.55.01,57.83Z"
                />
                <path
                  fill="currentColor"
                  d="M497.73,312.28h-234.8c-.11-2.74-.14-6.2.2-10.13.2-2.24.5-4.63.99-7.12,1.01-5.37,2.78-11.23,5.8-17.11,5.19-10.04,12.49-17.13,21.23-22.56,33.27-20.72,87.51-17.58,125.91-62.03,7.36-8.53,26.14-30.91,22.46-58.23-.39-2.92-4.35-30-25.93-39.27-15.92-6.84-34.88-1.19-46.95,8.07-27.71,21.25-15.4,58.7-41.9,71.63-7.57,3.71-18.45,5.47-28.97,2.17-1.85-.57-3.55-1.27-5.13-2.06-3.83-2.01-11.68-6.78-17.9-16.14-5.85-8.81-7.12-17.3-7.93-22.92-.59-4.01-.7-7.41-.69-9.85V3.78h53.4s-.04,0-.04.01h1.55c-.1,0-.24-.01-.42-.01h178.62c.1,17.01.18,34.03.28,51.04-10.55-14.91-25.96-30.52-47.07-34-3.94-.66-6.94-.71-8.32-.71-28.67.06-57.35.1-86,.14-1.2,0-3.47.14-6.47.32-10.26.64-19.08,1.78-22.07,2.29-9.53,1.63-23.4,7.76-33,18.15-14.36,15.54-14.44,35.48-14.5,49.34-.01,3.45.29,53.49,24.82,61.56,5.18,1.7,9.67.96,10.69.77,21.25-4,20.04-38.87,41.12-59.56,24-23.55,75.91-27.76,101.42-2.69,17.25,16.97,19.19,41.22,19.83,52.53.32,5.45,1.79,38.74-17.83,64.73-43.29,57.36-149.73,26.92-166.46,71.91-.01.07-.04.14-.07.21-3.01,8.25,3.29,16.97,12.07,16.9,34.46-.22,68.91-.62,103.38-1.16,11.08-.17,22.14-.36,33.19-.57h.08s.07.01.11.01c.38,0,1.17-.01,2.18-.06,1.55-.07,3.58-.24,5.94-.66,21.75-3.83,37-22.36,47.15-39.82,0,19.27.01,38.55.01,57.83Z"
                />
              </svg>
            </Section>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>
              {serviceSlug === "bridal"
                ? "Your Bridal Journey Begins"
                : serviceSlug === "prom"
                  ? "Your Prom Design Session"
                  : serviceSlug === "try-on"
                    ? serviceTitle
                    : "Your Consultation is Confirmed"}
            </Heading>

            <Text style={paragraph}>
              Dear <strong>{customerName}</strong>, we are delighted to confirm
              your upcoming consultation for <strong>{serviceTitle}</strong>.
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
                      <td style={infoLabel}>Size</td>
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
                      <td style={infoLabel}>Notes</td>
                      <td style={infoValue}>{specialRequirements}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* Dynamic Instructions based on Service and Location */}
            {location === "in-person" && (
              <>
                {serviceSlug === "try-on" && (
                  <Section style={accentBox}>
                    <Text style={accentTitle}>
                      Preparing for your try-on consultation
                    </Text>
                    <Text style={accentListItem}>
                      • Wear nude or brown panties for a seamless look.
                    </Text>
                    <Text style={accentListItem}>
                      • Avoid using deodorant or body cologne to keep the gowns
                      pristine.
                    </Text>
                    <Text style={accentListItem}>
                      • You may try on a maximum of 3 dresses within your 1-hour
                      session.
                    </Text>
                  </Section>
                )}

                {serviceSlug === "prom" && (
                  <Section style={accentBox}>
                    <Text style={accentTitle}>
                      Preparing for your Prom Consultation
                    </Text>
                    <Text style={accentListItem}>
                      • Wear a fitted outfit for accurate body measurements.
                    </Text>
                    <Text style={accentListItem}>
                      • Bring at least three style inspirations to discuss with
                      the head designer.
                    </Text>
                    <Text style={accentListItem}>
                      • Think about the color palette that best suits your skin
                      tone and theme.
                    </Text>
                  </Section>
                )}
              </>
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
