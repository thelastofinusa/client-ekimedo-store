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
  policyBox,
  policyTitle,
  policyText,
  link,
} from "./styles";

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
  socialLinks?: SocialLink[];
  siteUrl?: string;
}

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
  socialLinks = [],
  siteUrl,
}: CustomOrderInquiryProps) => {
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
        Custom Order Inquiry: {fullName} - {eventTypeLabel}
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
            <Heading style={heading}>New inquiry awaits</Heading>

            <Text style={paragraph}>Hello Eki,</Text>
            <Text style={paragraph}>
              A customer has reached out with a new custom order inquiry. Here
              are the details of their vision.
            </Text>

            {/* Inquiry Details */}
            <Section style={detailsCard}>
              <table style={infoGrid}>
                <tbody>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Customer</td>
                    <td style={infoValue}>{fullName}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Contact</td>
                    <td style={infoValue}>
                      <Link href={`mailto:${email}`} style={link}>
                        {email}
                      </Link>
                      {phone && (
                        <>
                          <br />
                          <Link href={`tel:${phone}`} style={link}>
                            {phone}
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Event</td>
                    <td style={infoValue}>
                      {eventTypeLabel} on {formattedDate}
                    </td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Budget</td>
                    <td style={infoValue}>{budgetLabel}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Images</td>
                    <td style={infoValue}>
                      {imageCount} {imageCount === 1 ? "image" : "images"}{" "}
                      uploaded
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Policy Section */}
            <Section style={policyBox}>
              <Text style={policyTitle}>Design Vision</Text>
              <Text style={policyText}>{dreamDress}</Text>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button
                href={`${siteUrl}/studio/structure/customOrder;${inquiryId}`}
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
              This is an automated notification from your website system.
              <br />© {new Date().getFullYear()} {siteConfig.title}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CustomOrderInquiryEmail;
