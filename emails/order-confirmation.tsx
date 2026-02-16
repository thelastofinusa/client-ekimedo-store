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

interface OrderItem {
  name: string;
  quantity: number;
  price: string | number;
  imageUrl?: string;
}

interface OrderConfirmationProps {
  orderNumber: string;
  customerEmail: string;
  totalAmount: string | number;
  items: OrderItem[];
  siteUrl?: string;
  socialLinks?: SocialLink[];
}

export const OrderConfirmationEmail = ({
  orderNumber,
  totalAmount,
  items,
  siteUrl,
  socialLinks = [],
}: OrderConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation: {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>{siteConfig.title}</Heading>
            <Text style={receiptLabel}>Order Confirmed</Text>
          </Section>

          {/* Intro */}
          <Section style={section}>
            <Heading as="h2" style={subHeading}>
              Thank You!
            </Heading>
            <Text style={paragraph}>
              Thank you for your purchase! Your order has been received and
              payment has been confirmed. We&apos;re currently preparing your
              items for delivery.
            </Text>
          </Section>

          {/* Order Summary */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Order Confirmation
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
              <Column style={labelColumn}>Payment Status</Column>
              <Column style={valueColumnRight}>✓ Confirmed</Column>
            </Row>
            <Row style={totalRow}>
              <Column style={totalLabel}>Total Amount</Column>
              <Column style={totalValue}>
                ${Number(totalAmount).toFixed(2)}
              </Column>
            </Row>
          </Section>

          {/* Items List */}
          <Section style={section}>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                {item.imageUrl && (
                  <Column style={imageColumn}>
                    <Img
                      src={item.imageUrl}
                      alt={item.name}
                      width="80"
                      height="80"
                      style={itemImage}
                    />
                  </Column>
                )}
                <Column style={itemDetailsColumn}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                </Column>
                <Column style={itemPriceColumn}>
                  ${Number(item.price).toFixed(2)}
                </Column>
              </Row>
            ))}
          </Section>

          {/* Next Steps */}
          <Section style={infoBox}>
            <Heading as="h3" style={infoBoxTitle}>
              What&apos;s next?
            </Heading>
            <Text style={infoBoxText}>
              Our team is now processing your order. You will receive a
              notification email as soon as your items have been dispatched.
            </Text>
          </Section>

          {/* Questions */}
          <Section style={section}>
            <Heading as="h3" style={smallHeading}>
              Questions?
            </Heading>
            <Text style={paragraphSmall}>
              If you have any questions about your order, please don&apos;t
              hesitate to reach out to our customer service team.
            </Text>
          </Section>

          {/* Action */}
          <Section style={btnContainer}>
            <Link href={siteUrl} style={button}>
              Visit Our Website
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>{siteConfig.title}</Text>
            <Text style={footerText}>
              Discover our latest collections and exclusive designs.
              <br />
              &copy; {new Date().getFullYear()} {siteConfig.title}. ALL RIGHTS
              RESERVED.
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

export default OrderConfirmationEmail;

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

const subHeading = {
  fontSize: "20px",
  fontWeight: "700",
  margin: "0 0 10px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0",
  color: "#333333",
};

const paragraphSmall = {
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
  color: "#333333",
};

const sectionTitle = {
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  borderBottom: "1px solid #eeeeee",
  paddingBottom: "10px",
  marginBottom: "20px",
  color: "#000000",
};

const summaryRow = {
  marginBottom: "10px",
};

const labelColumn = {
  color: "#666666",
  fontSize: "14px",
  padding: "5px 0",
};

const valueColumnRight = {
  textAlign: "right" as const,
  fontWeight: "700",
  fontSize: "14px",
  padding: "5px 0",
};

const totalRow = {
  borderTop: "1px solid #000000",
  marginTop: "10px",
};

const totalLabel = {
  padding: "20px 0 10px 0",
  fontSize: "16px",
  fontWeight: "700",
};

const totalValue = {
  padding: "20px 0 10px 0",
  textAlign: "right" as const,
  fontSize: "16px",
  fontWeight: "700",
};

const itemRow = {
  border: "1px solid #e6e6e6",
  padding: "20px",
  marginBottom: "10px",
};

const imageColumn = {
  width: "100px",
};

const itemImage = {
  objectFit: "cover" as const,
  backgroundColor: "#f4f4f4",
};

const itemDetailsColumn = {
  paddingLeft: "20px",
};

const itemName = {
  fontWeight: "700",
  fontSize: "14px",
  marginBottom: "4px",
  marginTop: "0",
  color: "#000",
};

const itemQuantity = {
  color: "#666666",
  fontSize: "13px",
  margin: "0",
};

const itemPriceColumn = {
  textAlign: "right" as const,
  fontWeight: "700",
  fontSize: "14px",
  verticalAlign: "top",
  paddingTop: "5px",
};

const infoBox = {
  border: "1px solid #000000",
  padding: "20px",
  marginBottom: "40px",
};

const infoBoxTitle = {
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  marginTop: "0",
  marginBottom: "10px",
};

const infoBoxText = {
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.5",
  color: "#333333",
};

const smallHeading = {
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  color: "#666666",
  marginBottom: "10px",
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

const footerBrand = {
  margin: "0 0 10px 0",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const footerText = {
  margin: "0",
  color: "#999999",
  fontSize: "11px",
  letterSpacing: "0.5px",
  lineHeight: "1.4",
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
