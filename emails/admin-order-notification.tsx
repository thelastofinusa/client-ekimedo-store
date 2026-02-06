import { siteConfig } from "@/site.config";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
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

interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string | number;
  imageUrl?: string;
}

interface AdminOrderNotificationProps {
  orderNumber: string;
  customerEmail: string;
  totalAmount: string | number;
  items: OrderItem[];
  shippingAddress?: Address;
  orderId: string;
  siteUrl?: string;
  socialLinks?: SocialLink[];
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export const AdminOrderNotificationEmail = ({
  orderNumber,
  customerEmail,
  totalAmount,
  items,
  shippingAddress,
  orderId,
  siteUrl = baseUrl,
  socialLinks = [],
}: AdminOrderNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Order: {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>{siteConfig.title}</Heading>
            <Text style={receiptLabel}>Order Receipt</Text>
          </Section>

          {/* Intro */}
          <Section style={section}>
            <Text style={paragraph}>
              A new order has been confirmed and is currently being processed.
            </Text>
          </Section>

          {/* Order Summary */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Order Summary
            </Heading>

            <Row style={summaryRow}>
              <Column style={labelColumn}>Order Number</Column>
              <Column style={valueColumnRight}>{orderNumber}</Column>
            </Row>
            <Row style={summaryRow}>
              <Column style={labelColumn}>Items</Column>
              <Column style={valueColumnRight}>
                {items.reduce((acc, item) => acc + item.quantity, 0)} item(s)
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column style={labelColumn}>Status</Column>
              <Column style={valueColumnRight}>PAID</Column>
            </Row>
            <Row style={totalRow}>
              <Column style={totalLabel}>Total Amount</Column>
              <Column style={totalValue}>
                ${Number(totalAmount).toFixed(2)}
              </Column>
            </Row>
          </Section>

          {/* Shipping & Contact */}
          <Section style={section}>
            <Row>
              <Column style={halfColumn}>
                <Heading as="h3" style={smallHeading}>
                  Customer
                </Heading>
                <Text style={addressText}>{customerEmail}</Text>
              </Column>
              <Column style={halfColumn}>
                <Heading as="h3" style={smallHeading}>
                  Shipping To
                </Heading>
                {shippingAddress ? (
                  <Text style={addressText}>
                    {shippingAddress.name}
                    <br />
                    {shippingAddress.line1}
                    <br />
                    {shippingAddress.line2 && (
                      <>
                        {shippingAddress.line2}
                        <br />
                      </>
                    )}
                    {shippingAddress.city}
                    <br />
                    {shippingAddress.postcode}
                    <br />
                    {shippingAddress.country}
                  </Text>
                ) : (
                  <Text style={addressText}>No address provided</Text>
                )}
              </Column>
            </Row>
          </Section>

          {/* Action */}
          <Section style={btnContainer}>
            <Link
              href={`${siteUrl}/studio/structure/order;${orderId}`}
              style={button}
            >
              View Order Details
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} {siteConfig.title} MANAGEMENT
              SYSTEM. ALL RIGHTS RESERVED.
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

export default AdminOrderNotificationEmail;

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

const header = {
  borderBottom: "2px solid #000000",
  paddingBottom: "20px",
  marginBottom: "40px",
};

const brandName = {
  margin: "0",
  fontSize: "24px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
};

const receiptLabel = {
  margin: "5px 0 0 0",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  color: "#666666",
};

const section = {
  marginBottom: "40px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0",
  color: "#333333",
};

const sectionTitle = {
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  borderBottom: "1px solid #eeeeee",
  paddingBottom: "10px",
  marginBottom: "20px",
};

const summaryRow = {
  marginBottom: "10px",
};

const labelColumn = {
  color: "#666666",
  fontSize: "14px",
  padding: "10px 0",
};

const valueColumnRight = {
  textAlign: "right" as const,
  fontWeight: "700",
  fontSize: "14px",
  padding: "10px 0",
};

const totalRow = {
  borderTop: "1px solid #000000",
  marginTop: "10px",
};

const totalLabel = {
  padding: "20px 0 10px 0",
  fontSize: "16px",
  fontWeight: "700",
  borderTop: "1px solid #000000",
};

const totalValue = {
  padding: "20px 0 10px 0",
  textAlign: "right" as const,
  fontSize: "16px",
  fontWeight: "700",
  borderTop: "1px solid #000000",
};

const halfColumn = {
  width: "50%",
  verticalAlign: "top" as const,
  paddingRight: "10px",
};

const smallHeading = {
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  color: "#666666",
  marginBottom: "10px",
};

const addressText = {
  fontSize: "13px",
  margin: "0",
  lineHeight: "1.4",
  color: "#333333",
};

const btnContainer = {
  marginBottom: "60px",
  textAlign: "center" as const,
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
  borderTop: "1px solid #eeeeee",
  paddingTop: "20px",
  textAlign: "center" as const,
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
