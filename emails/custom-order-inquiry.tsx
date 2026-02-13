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

interface CustomOrderInquiryProps {
  fullName: string;
  email: string;
  phone: string;
  eventTypeLabel: string;
  formattedDate: string;
  budgetLabel: string;
  dreamDress: string;
  imageCount: number;
  inquiryId: string;
  socialLinks: SocialLink[];
  siteUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export const CustomOrderInquiryEmail = ({
  fullName,
  email,
  phone,
  eventTypeLabel,
  formattedDate,
  budgetLabel,
  dreamDress,
  imageCount,
  inquiryId,
  socialLinks,
  siteUrl = baseUrl,
}: CustomOrderInquiryProps) => (
  <Html>
    <Head />
    <Preview>New Custom Order Inquiry: {fullName}</Preview>
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
        <Heading style={heading}>New Custom Order Inquiry</Heading>
        <Text style={subheading}>Received via website form</Text>

        {/* Customer Details */}
        <Section style={section}>
          <Heading as="h2" style={sectionHeading}>
            Customer Information
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
          <Row style={rowWithoutBorder}>
            <Column style={labelColumn}>Phone</Column>
            <Column style={valueColumn}>{phone}</Column>
          </Row>
        </Section>

        {/* Event Details */}
        <Section style={section}>
          <Heading as="h2" style={sectionHeading}>
            Event Details
          </Heading>
          <Row style={row}>
            <Column style={labelColumn}>Event Type</Column>
            <Column style={valueColumnBold}>{eventTypeLabel}</Column>
          </Row>
          <Row style={row}>
            <Column style={labelColumn}>Event Date</Column>
            <Column style={valueColumn}>{formattedDate}</Column>
          </Row>
          <Row style={rowWithoutBorder}>
            <Column style={labelColumn}>Estimated Budget</Column>
            <Column style={valueColumnBold}>{budgetLabel}</Column>
          </Row>
        </Section>

        {/* Vision / Description */}
        <Section style={section}>
          <Heading as="h2" style={sectionHeading}>
            Dream Dress Vision
          </Heading>
          <Text style={messageText}>{dreamDress}</Text>
        </Section>

        {/* Inspiration Photos Note */}
        {imageCount > 0 && (
          <Section style={section}>
            <Heading as="h2" style={sectionHeading}>
              Inspiration Photos
            </Heading>
            <Text style={labelColumn}>
              {imageCount} photo(s) attached and uploaded to CMS.
            </Text>
          </Section>
        )}

        {/* Action */}
        <Section style={actionContainer}>
          <Button href={`mailto:${email}`} style={button}>
            Reply to Customer
          </Button>
          <Button
            href={`${siteUrl}/admin/structure/inquiry;${inquiryId}`}
            style={{ ...buttonSecondary, marginLeft: "10px" }}
          >
            Open in Studio
          </Button>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerTitle}>{siteConfig.title} ADMIN</Text>
          <Text style={footerSub}>
            Automated notification from your website.
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

export default CustomOrderInquiryEmail;

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

const buttonSecondary = {
  backgroundColor: "#ffffff",
  color: "#000000",
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
