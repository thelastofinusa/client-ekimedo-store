/**
 * Shared Email Design System - Luxury Editorial Version
 * Focus: High-end boutique aesthetic, generous whitespace, refined typography.
 */

export const main = {
  fontFamily:
    "'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "0",
};

export const container = {
  maxWidth: "600px",
  borderRadius: "0", // Clean, sharp edges for a modern look
};

export const header = {
  padding: "60px 10px 40px",
  textAlign: "left" as const,
};

export const logo = {
  margin: "0",
};

export const content = {
  padding: "0 10px 60px",
};

export const heading = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "24px",
  letterSpacing: "-0.01em",
  lineHeight: "1.15",
  fontWeight: "400",
  color: "#111111",
  margin: "0 0 32px 0",
};

export const paragraph = {
  fontSize: "15px",
  lineHeight: "1.8",
  color: "#333333",
  margin: "0 0 24px 0",
};

export const link = {
  color: "#0066cc",
  textDecoration: "none",
  borderBottom: "1px solid #0066cc",
  fontWeight: "500",
};

export const buttonContainer = {
  margin: "40px 0",
  width: "100%",
};

export const button = {
  backgroundColor: "#141414",
  color: "#ffffff",
  fontSize: "11px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "20px 0",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.25em",
  borderRadius: "0",
};

export const detailsCard = {
  margin: "48px 0",
  padding: "20px",
  border: "1px solid #f0f0f0", // Subtle box instead of just lines
  backgroundColor: "#fafafa",
};

export const infoGrid = {
  display: "table",
  width: "100%",
  borderCollapse: "separate" as const,
  borderSpacing: "0 20px",
};

export const infoRow = {
  display: "table-row",
};

export const infoLabel = {
  display: "table-cell",
  fontSize: "10px",
  color: "#999999",
  textTransform: "uppercase" as const,
  letterSpacing: "0.10em",
  fontWeight: "700",
  width: "130px",
  verticalAlign: "top",
};

export const infoValue = {
  display: "table-cell",
  fontSize: "14px",
  color: "#111111",
  fontWeight: "500",
  verticalAlign: "top",
  lineHeight: "1.5",
};

export const policyBox = {
  margin: "40px 0",
  padding: "20px",
  backgroundColor: "#fcfcfc",
  borderLeft: "2px solid #000000",
};

export const policyTitle = {
  fontSize: "12px",
  fontWeight: "700",
  margin: "0 0 8px 0",
  color: "#111111",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

export const policyText = {
  fontSize: "13px",
  lineHeight: "1.7",
  color: "#666666",
  margin: "4px 0 0 0",
};

export const accentBox = {
  margin: "48px 0",
  padding: "32px",
  backgroundColor: "#ffffff",
  border: "1px solid #111111",
  textAlign: "center" as const,
};

export const accentTitle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "18px",
  fontStyle: "italic",
  color: "#111111",
  margin: "0 0 20px 0",
  lineHeight: "1.4",
};

export const accentList = {
  margin: "0",
  padding: "0",
  listStyleType: "none",
};

export const accentListItem = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#444444",
  margin: "0 0 12px 0",
  letterSpacing: "0.02em",
};

export const signatureSection = {
  marginTop: "20px",
};

export const signatureText = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "20px",
  fontStyle: "italic",
  color: "#111111",
  margin: "0",
};

export const footer = {
  backgroundColor: "#ffffff",
  padding: "50px 10px",
  textAlign: "center" as const,
  borderTop: "1px solid #f0f0f0",
};

export const footerBrand = {
  color: "#111111",
  fontSize: "20px",
  fontWeight: "300",
  letterSpacing: "0.4em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  display: "block",
  marginBottom: "40px",
};

export const footerText = {
  color: "#999999",
  fontSize: "11px",
  lineHeight: "2",
  margin: "0",
  letterSpacing: "0.03em",
  maxWidth: "400px",
  marginLeft: "auto",
  marginRight: "auto",
};

export const socialContainer = {
  marginBottom: "40px",
  textAlign: "center" as const,
};

export const socialLink = {
  color: "#111111",
  fontSize: "10px",
  textDecoration: "none",
  margin: "10px 15px",
  display: "inline-block",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  borderBottom: "1px solid transparent",
};

export const hr = {
  borderColor: "#f0f0f0",
  margin: "40px 0",
};

// Order Confirmation Specific
export const itemRow = {
  padding: "24px 0",
  borderBottom: "1px solid #eeeeee",
};

export const itemImage = {
  borderRadius: "0",
  border: "1px solid #f0f0f0",
};

export const itemName = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#111111",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export const itemMeta = {
  fontSize: "12px",
  color: "#888888",
  margin: "0",
};

export const totalSection = {
  marginTop: "40px",
  padding: "30px",
  backgroundColor: "#fafafa",
};

export const totalRow = {
  marginBottom: "12px",
};

export const totalLabel = {
  fontSize: "12px",
  color: "#999999",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

export const totalValue = {
  fontSize: "20px",
  fontWeight: "400",
  fontFamily: "'Playfair Display', serif",
  color: "#111111",
};
