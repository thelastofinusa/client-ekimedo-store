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
  logoSvg,
} from "@/styles/email.styles";

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
              <svg
                width="80"
                height="auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 315"
              >
                <path
                  style={logoSvg}
                  d="M234.87,312.28H.08c-.11-2.74-.14-6.2.2-10.13.2-2.24.5-4.63.99-7.12,1.01-5.37,2.78-11.23,5.8-17.11,5.19-10.04,12.49-17.13,21.23-22.56,33.27-20.72,87.51-17.58,125.91-62.03,7.36-8.53,26.14-30.91,22.46-58.23-.39-2.92-4.35-30-25.93-39.27-15.92-6.84-34.88-1.19-46.95,8.07-27.71,21.25-15.4,58.7-41.9,71.63-7.57,3.71-18.45,5.47-28.97,2.17-1.85-.57-3.55-1.27-5.13-2.06-3.83-2.01-11.68-6.78-17.9-16.14-5.85-8.81-7.12-17.3-7.93-22.92-.59-4.01-.7-7.41-.69-9.85V3.78h53.4s-.04,0-.04.01h1.55c-.1,0-.24-.01-.42-.01h178.62c.1,17.01.18,34.03.28,51.04-10.55-14.91-25.96-30.52-47.07-34-3.94-.66-6.94-.71-8.32-.71-28.67.06-57.35.1-86,.14-1.2,0-3.47.14-6.47.32-10.26.64-19.08,1.78-22.07,2.29-9.53,1.63-23.4,7.76-33,18.15-14.36,15.54-14.44,35.48-14.5,49.34-.01,3.45.29,53.49,24.82,61.56,5.18,1.7,9.67.96,10.69.77,21.25-4,20.04-38.87,41.12-59.56,24-23.55,75.91-27.76,101.42-2.69,17.25,16.97,19.19,41.22,19.83,52.53.32,5.45,1.79,38.74-17.83,64.73-43.29,57.36-149.73,26.92-166.46,71.91-.01.07-.04.14-.07.21-3.01,8.25,3.29,16.97,12.07,16.9,34.46-.22,68.91-.62,103.38-1.16,11.08-.17,22.14-.36,33.19-.57h.08s.07.01.11.01c.38,0,1.17-.01,2.18-.06,1.55-.07,3.58-.24,5.94-.66,21.75-3.83,37-22.36,47.15-39.82,0,19.27.01,38.55.01,57.83Z"
                />
                <path
                  style={logoSvg}
                  d="M497.73,312.28h-234.8c-.11-2.74-.14-6.2.2-10.13.2-2.24.5-4.63.99-7.12,1.01-5.37,2.78-11.23,5.8-17.11,5.19-10.04,12.49-17.13,21.23-22.56,33.27-20.72,87.51-17.58,125.91-62.03,7.36-8.53,26.14-30.91,22.46-58.23-.39-2.92-4.35-30-25.93-39.27-15.92-6.84-34.88-1.19-46.95,8.07-27.71,21.25-15.4,58.7-41.9,71.63-7.57,3.71-18.45,5.47-28.97,2.17-1.85-.57-3.55-1.27-5.13-2.06-3.83-2.01-11.68-6.78-17.9-16.14-5.85-8.81-7.12-17.3-7.93-22.92-.59-4.01-.7-7.41-.69-9.85V3.78h53.4s-.04,0-.04.01h1.55c-.1,0-.24-.01-.42-.01h178.62c.1,17.01.18,34.03.28,51.04-10.55-14.91-25.96-30.52-47.07-34-3.94-.66-6.94-.71-8.32-.71-28.67.06-57.35.1-86,.14-1.2,0-3.47.14-6.47.32-10.26.64-19.08,1.78-22.07,2.29-9.53,1.63-23.4,7.76-33,18.15-14.36,15.54-14.44,35.48-14.5,49.34-.01,3.45.29,53.49,24.82,61.56,5.18,1.7,9.67.96,10.69.77,21.25-4,20.04-38.87,41.12-59.56,24-23.55,75.91-27.76,101.42-2.69,17.25,16.97,19.19,41.22,19.83,52.53.32,5.45,1.79,38.74-17.83,64.73-43.29,57.36-149.73,26.92-166.46,71.91-.01.07-.04.14-.07.21-3.01,8.25,3.29,16.97,12.07,16.9,34.46-.22,68.91-.62,103.38-1.16,11.08-.17,22.14-.36,33.19-.57h.08s.07.01.11.01c.38,0,1.17-.01,2.18-.06,1.55-.07,3.58-.24,5.94-.66,21.75-3.83,37-22.36,47.15-39.82,0,19.27.01,38.55.01,57.83Z"
                />
              </svg>
            </Section>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>New order received</Heading>

            <Text style={paragraph}>
              Hello <strong>{siteConfig.author.nickname}</strong>,
            </Text>
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
