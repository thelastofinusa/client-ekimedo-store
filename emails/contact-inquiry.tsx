import { siteConfig } from "@/site.config";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface SocialLink {
  name: string | null;
  url: string | null;
}

interface ContactInquiryProps {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  socialLinks: SocialLink[];
  siteUrl?: string;
}

export const ContactInquiryEmail = ({
  fullName,
  email,
  phone,
  inquiryType,
  message,
  socialLinks,
  siteUrl,
}: ContactInquiryProps) => (
  <Html>
    <Head />
    <Preview>
      Inquiry: {inquiryType} – {fullName}
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

        {/* Heading */}
        <Heading style={heading}>New Contact Inquiry</Heading>
        <Text style={subheading}>Received via website form</Text>

        {/* Details Table */}
        <Section style={section}>
          <Heading as="h2" style={sectionHeading}>
            Sender Information
          </Heading>
          <Row style={row}>
            <Column style={labelColumn}>Name</Column>
            <Column style={valueColumn}>{fullName}</Column>
          </Row>
          <Row style={row}>
            <Column style={labelColumn}>Email</Column>
            <Column style={valueColumn}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Column>
          </Row>
          <Row style={row}>
            <Column style={labelColumn}>Phone</Column>
            <Column style={valueColumn}>{phone}</Column>
          </Row>
          <Row style={rowWithoutBorder}>
            <Column style={labelColumn}>Inquiry Type</Column>
            <Column style={valueColumnBold}>{inquiryType}</Column>
          </Row>
        </Section>

        {/* Message Content */}
        <Section style={section}>
          <Heading as="h2" style={sectionHeading}>
            Message
          </Heading>
          <Text style={messageText}>{message}</Text>
        </Section>

        {/* Action */}
        <Section style={actionContainer}>
          <Button href={`mailto:${email}`} style={button}>
            Reply to Inquiry
          </Button>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerTitle}>{siteConfig.title}</Text>
          <Text style={footerSub}>
            Internal Notification • Contact Form Submission
          </Text>
          {socialLinks && socialLinks.length > 0 && (
            <Section style={socialLinksContainer}>
              {socialLinks.map((social, index) =>
                social.name && social.url ? (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    style={socialLink}
                  >
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

export default ContactInquiryEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  color: "#000000",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
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
  margin: "0 0 10px 0",
  letterSpacing: "-0.5px",
  color: "#000000",
};

const subheading = {
  textAlign: "center" as const,
  margin: "0 0 40px 0",
  fontSize: "14px",
  color: "#666666",
};

const section = {
  marginBottom: "40px",
};

const sectionHeading = {
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  borderBottom: "1px solid #eeeeee",
  paddingBottom: "10px",
  marginBottom: "20px",
  color: "#000000",
};

const row = {
  borderBottom: "1px solid #eeeeee",
};

const rowWithoutBorder = {
  borderBottom: "none",
};

const labelColumn = {
  padding: "12px 0",
  color: "#666666",
  width: "30%",
  fontSize: "14px",
};

const valueColumn = {
  padding: "12px 0",
  textAlign: "right" as const,
  fontSize: "14px",
  color: "#000000",
};

const valueColumnBold = {
  ...valueColumn,
  fontWeight: "700",
};

const link = {
  color: "#000000",
  textDecoration: "underline",
};

const messageText = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#333333",
  whiteSpace: "pre-wrap" as const,
};

const actionContainer = {
  marginBottom: "60px",
  textAlign: "center" as const,
};

const button = {
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
  borderTop: "1px solid #eeeeee",
  paddingTop: "20px",
  textAlign: "center" as const,
};

const footerTitle = {
  margin: "0 0 10px 0",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const footerSub = {
  margin: "0",
  color: "#999999",
  fontSize: "11px",
  letterSpacing: "0.5px",
};

const socialLinksContainer = {
  marginTop: "20px",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const socialLink = {
  color: "#000",
  textDecoration: "none",
  margin: "0 10px",
};
