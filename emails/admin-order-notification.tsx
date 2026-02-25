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
  Row,
  Column,
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
  itemRow,
  itemImage,
  itemName,
  itemMeta,
  totalSection,
  totalLabel,
  totalValue,
  link,
} from "./styles";

interface SocialLink {
  name: string | null;
  url: string | null;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

interface AdminOrderNotificationProps {
  orderNumber: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  orderId: string;
  siteUrl?: string;
  socialLinks?: SocialLink[];
}

export const AdminOrderNotificationEmail = ({
  orderNumber,
  customerEmail,
  totalAmount,
  items,
  shippingAddress,
  orderId,
  siteUrl,
  socialLinks = [],
}: AdminOrderNotificationProps) => {
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
        New Order: {orderNumber} - ${totalAmount.toFixed(2)}
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
            <Heading style={heading}>New order received</Heading>

            <Text style={paragraph}>Hello Eki,</Text>
            <Text style={paragraph}>
              An order for <strong>{orderNumber}</strong> has been placed. The
              summary details are provided below.
            </Text>

            {/* Order Details */}
            <Section style={detailsCard}>
              <table style={infoGrid}>
                <tbody>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Order #</td>
                    <td style={infoValue}>{orderNumber}</td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Customer</td>
                    <td style={infoValue}>
                      <Link href={`mailto:${customerEmail}`} style={link}>
                        {customerEmail}
                      </Link>
                    </td>
                  </tr>
                  <tr style={infoRow}>
                    <td style={infoLabel}>Shipping</td>
                    <td style={infoValue}>
                      {shippingAddress.name}
                      <br />
                      <span
                        style={{
                          fontWeight: "400",
                          color: "#666",
                          fontSize: "13px",
                        }}
                      >
                        {shippingAddress.line1}
                        {shippingAddress.line2
                          ? `, ${shippingAddress.line2}`
                          : ""}
                        <br />
                        {shippingAddress.city}, {shippingAddress.postcode}
                        <br />
                        {shippingAddress.country}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#111",
                  marginTop: "32px",
                  marginBottom: "16px",
                }}
              >
                Items Ordered
              </Text>
              {items.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Row>
                    <Column style={{ width: "48px" }}>
                      <Img
                        src={
                          item.imageUrl || `${siteUrl}/placeholder-product.jpg`
                        }
                        alt={item.name}
                        width="48"
                        height="48"
                        style={itemImage}
                      />
                    </Column>
                    <Column style={{ paddingLeft: "16px" }}>
                      <Text style={{ ...itemName, fontSize: "14px" }}>
                        {item.name}
                      </Text>
                      <Text style={itemMeta}>Quantity: {item.quantity}</Text>
                    </Column>
                    <Column align="right">
                      <Text style={{ ...itemName, fontSize: "14px" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              ))}

              <Section style={totalSection}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={totalLabel}>Total Amount</td>
                      <td align="right" style={totalValue}>
                        ${totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button
                href={`${siteUrl}/studio/structure/order;${orderId}`}
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
              This is an automated notification from your store system.
              <br />© {new Date().getFullYear()} {siteConfig.title}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminOrderNotificationEmail;
