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
  signatureSection,
  signatureText,
  policyText,
  policyBox,
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

interface OrderConfirmationProps {
  orderNumber: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  siteUrl?: string;
  socialLinks?: SocialLink[];
  orderId?: string;
}

export const OrderConfirmationEmail = ({
  orderNumber,
  totalAmount,
  items,
  siteUrl,
  socialLinks = [],
  orderId,
}: OrderConfirmationProps) => {
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
        Order Confirmed: {orderNumber} - ${totalAmount.toFixed(2)}
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
            <Heading style={heading}>Thank you for your order</Heading>

            <Text style={paragraph}>
              Hello, we&apos;ve received your order{" "}
              <strong>{orderNumber}</strong> and we&apos;re getting it ready for
              you.
            </Text>

            {/* Order Summary */}
            <Section style={detailsCard}>
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#111",
                  marginBottom: "20px",
                }}
              >
                Items Ordered
              </Text>
              {items.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Row>
                    <Column style={{ width: "64px" }}>
                      <Img
                        src={item.imageUrl || `${siteUrl}/placeholder.svg`}
                        alt={item.name}
                        width="64"
                        height="64"
                        style={itemImage}
                      />
                    </Column>
                    <Column style={{ paddingLeft: "20px" }}>
                      <Text style={itemName}>{item.name}</Text>
                      <Text style={itemMeta}>Quantity: {item.quantity}</Text>
                    </Column>
                    <Column align="right">
                      <Text style={itemName}>
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

            {/* Policy Section */}
            <Section style={policyBox}>
              <Text style={policyText}>
                When your order ships, you will receive another email from us.
                Or click{" "}
                <Link href={`${siteUrl}/orders/${orderId}`} style={link}>
                  this link
                </Link>{" "}
                to see the progress of your order.
              </Text>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button href={`${siteUrl}/shop`} style={button}>
                Continue Shopping
              </Button>
            </Section>

            <Section style={signatureSection}>
              <Text style={{ ...paragraph, marginBottom: "10px" }}>
                Best regards,
              </Text>
              <Text style={signatureText}>{siteConfig.author.fullName}</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Link href={siteUrl} style={footerBrand}>
              {siteConfig.title}
            </Link>

            <Section style={socialContainer}>
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.url || "#"} style={socialLink}>
                  {social.name}
                </Link>
              ))}
            </Section>

            <Text style={footerText}>
              Please email us at{" "}
              <Link href="mailto:info@ekimedo.com">info@ekimedo.com</Link> if
              you have any questions.
              <br />© {new Date().getFullYear()} {siteConfig.title}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;
