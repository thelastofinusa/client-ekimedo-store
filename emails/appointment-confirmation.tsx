import { siteConfig } from "@/site.config";
import {
  Body,
  Container,
  Head,
  Heading,
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

interface AppointmentConfirmationProps {
  customerName: string;
  serviceTitle: string;
  dateTime: string | Date;
  location: string;
  calendarUrl: string;
  siteUrl?: string;
  socialLinks?: SocialLink[];
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export const AppointmentConfirmationEmail = ({
  customerName,
  serviceTitle,
  dateTime,
  location,
  calendarUrl,
  siteUrl = baseUrl,
  socialLinks = [],
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

  return (
    <Html>
      <Head />
      <Preview>Appointment Confirmed: {serviceTitle}</Preview>
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

          {/* Heading */}
          <Heading style={heading}>Appointment Confirmed</Heading>

          <Section style={contentSection}>
            <Text style={paragraph}>Dear {customerName},</Text>
            <Text style={paragraph}>
              You have successfully booked an appointment with{" "}
              {siteConfig.title}!
            </Text>

            <Section style={detailsBox}>
              <Row style={row}>
                <Column style={labelColumn}>What</Column>
                <Column style={valueColumn}>{serviceTitle}</Column>
              </Row>
              <Row style={row}>
                <Column style={labelColumn}>When</Column>
                <Column style={valueColumn}>
                  {dateStr} at {timeStr}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={labelColumn}>Where</Column>
                <Column style={valueColumn}>{location}</Column>
              </Row>
            </Section>

            <Text style={policyText}>
              <strong>Important:</strong> Please be on time. A late fee of $20
              applies after 10 mins. Canceled after 15 mins.
            </Text>

            <Text style={paragraph}>
              Looking forward to meeting you.
              <br />
              Eki Ajibade
            </Text>
          </Section>

          {/* Action */}
          <Section style={btnContainer}>
            <Link href={calendarUrl} style={button}>
              Add to Calendar
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Manage your appointment by replying to this email or contacting us
              directly.
            </Text>
            <Link href={siteUrl} style={footerLink}>
              {siteConfig.title}
            </Link>

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

export default AppointmentConfirmationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  color: "#000000",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "40px",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  textAlign: "center" as const,
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 40px 0",
  letterSpacing: "-0.5px",
};

const contentSection = {
  marginBottom: "40px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
  color: "#333333",
};

const detailsBox = {
  border: "1px solid #e6e6e6",
  padding: "20px",
  marginBottom: "30px",
};

const row = {
  marginBottom: "10px",
};

const labelColumn = {
  width: "80px",
  fontWeight: "700",
  fontSize: "14px",
  color: "#000000",
  verticalAlign: "top",
};

const valueColumn = {
  fontSize: "14px",
  color: "#333333",
};

const policyText = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#333333",
  borderRadius: "4px",
  marginBottom: "20px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginBottom: "60px",
};

const button = {
  display: "inline-block",
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "15px 40px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  border: "1px solid #000000",
};

const footer = {
  backgroundColor: "#f4f4f4",
  padding: "40px 20px",
  textAlign: "center" as const,
  borderRadius: "12px",
};

const footerText = {
  fontSize: "14px",
  margin: "0 0 20px 0",
  color: "#000",
};

const footerLink = {
  color: "#000",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "18px",
  letterSpacing: "1px",
  display: "block",
  marginBottom: "20px",
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
