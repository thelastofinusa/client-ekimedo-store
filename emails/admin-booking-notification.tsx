import { siteConfig } from "@/site.config";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface SocialLink {
  name: string | null;
  url: string | null;
}

interface AdminBookingNotificationProps {
  customerName: string;
  serviceTitle: string;
  dateTime: string | Date;
  location: string;
  bookingId: string;
  siteUrl?: string;
  socialLinks?: SocialLink[];
  eventDate?: string | Date | null;
  budgetType?: string | null;
  customBudget?: string | null;
  paymentMethod?: string | null;
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
      <Head />
      <Preview>
        New Consultation: {serviceTitle} - {customerName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Img
              src={`${siteUrl}/logo/logo-vertical-charcoal.svg`}
              alt={siteConfig.title}
              width="120"
              height="auto"
              style={logo}
            />
          </Section>

          <Text style={paragraph}>Hi {siteConfig.title},</Text>
          <Text style={paragraph}>
            You have one confirmed <strong>{serviceTitle}</strong> appointment
            at <strong>{location}</strong> on <strong>{dateStr}</strong> at{" "}
            <strong>{timeStr}</strong>. The appointment is added to your
            schedule.
          </Text>

          <Section style={detailsBox}>
            <Row style={row}>
              <Column style={labelColumn}>Customer</Column>
              <Column style={valueColumn}>{customerName}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}>Service</Column>
              <Column style={valueColumn}>{serviceTitle}</Column>
            </Row>
            {eventDateStr && (
              <Row style={row}>
                <Column style={labelColumn}>Event Date</Column>
                <Column style={valueColumn}>{eventDateStr}</Column>
              </Row>
            )}
            {budgetLabel && (
              <Row style={row}>
                <Column style={labelColumn}>Budget</Column>
                <Column style={valueColumn}>{budgetLabel}</Column>
              </Row>
            )}
            {paymentMethodLabel && (
              <Row style={row}>
                <Column style={labelColumn}>Payment</Column>
                <Column style={valueColumn}>{paymentMethodLabel}</Column>
              </Row>
            )}
          </Section>

          <Text style={paragraph}>
            Thank you,
            <br />
            {siteConfig.title}
          </Text>

          {/* Action */}
          <Section style={btnContainer}>
            <Link
              href={`${siteUrl}/admin/structure/booking;${bookingId}`}
              style={button}
            >
              View in Studio
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Automated notification from your website.
            </Text>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <Section style={socialContainer}>
                {socialLinks.map((social, index) =>
                  social.name && social.url ? (
                    <Link key={index} href={social.url} style={socialLink}>
                      {social.name}
                    </Link>
                  ) : null,
                )}
              </Section>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminBookingNotificationEmail;

const main = {
  backgroundColor: "#f9f9f9",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  color: "#000000",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
  backgroundColor: "#ffffff",
};

const logoContainer = {
  textAlign: "left" as const,
  marginBottom: "30px",
};

const logo = {
  width: "120px",
  height: "auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
  color: "#000000",
};

const detailsBox = {
  border: "1px solid #eeeeee",
  padding: "20px",
  marginBottom: "30px",
  backgroundColor: "#fcfcfc",
};

const row = {
  marginBottom: "10px",
};

const labelColumn = {
  width: "100px",
  fontWeight: "700",
  fontSize: "14px",
  color: "#000000",
  verticalAlign: "top",
};

const valueColumn = {
  fontSize: "14px",
  color: "#333333",
};

const btnContainer = {
  textAlign: "center" as const,
  marginBottom: "40px",
  marginTop: "20px",
};

const button = {
  display: "inline-block",
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "15px 30px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const footer = {
  borderTop: "1px solid #eeeeee",
  paddingTop: "20px",
  textAlign: "center" as const,
  marginTop: "40px",
};

const footerText = {
  margin: "0",
  color: "#999999",
  fontSize: "11px",
  letterSpacing: "0.5px",
};

const socialContainer = {
  marginTop: "20px",
};

const socialLink = {
  color: "#000",
  textDecoration: "none",
  margin: "0 10px",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};
