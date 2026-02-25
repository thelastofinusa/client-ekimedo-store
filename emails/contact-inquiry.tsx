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
  link,
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
} from "./styles";

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
  socialLinks?: SocialLink[];
  siteUrl?: string;
}

export const ContactInquiryEmail = ({
  fullName,
  email,
  phone,
  inquiryType,
  message,
  socialLinks = [],
  siteUrl,
}: ContactInquiryProps) => {
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
        New Inquiry: {inquiryType} from {fullName}
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
            <Heading style={heading}>New contact form message</Heading>

            <Text style={paragraph}>Hello Eki,</Text>
            <Text style={paragraph}>
              A new message has been submitted through the contact form on your
              website.
            </Text>

            {/* Inquiry Details */}
            <Section style={detailsCard}>
              <table style={infoGrid}>
                <tbody>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Full Name</td>
                    <td style={infoValue}>{fullName}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Email</td>
                    <td style={infoValue}>
                      <Link href={`mailto:${email}`} style={link}>
                        {email}
                      </Link>
                    </td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Phone</td>
                    <td style={infoValue}>
                      {phone ? (
                        <Link href={`tel:${phone}`} style={link}>
                          {phone}
                        </Link>
                      ) : (
                        "Not provided"
                      )}
                    </td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Type</td>
                    <td style={infoValue}>{inquiryType}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Policy Section */}
            <Section style={policyBox}>
              <Text style={policyTitle}>Message</Text>
              <Text style={policyText}>{message}</Text>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button href={`mailto:${email}`} style={button}>
                Reply to Customer
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

export default ContactInquiryEmail;
