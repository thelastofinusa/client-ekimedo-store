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
  Row,
  Column,
  Hr,
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
  signatureSection,
  signatureText,
  policyText,
  policyTitle,
  policyBox,
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

interface OrderConfirmationProps {
  orderNumber: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  siteUrl?: string;
  socialLinks?: SocialLink[];
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerEmail,
  totalAmount,
  items,
  siteUrl,
  socialLinks = [],
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
                        src={
                          item.imageUrl || `${siteUrl}/placeholder-product.jpg`
                        }
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
                <Link href={`${siteUrl}/orders`} style={link}>
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
