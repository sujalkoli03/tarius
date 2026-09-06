import type { InquiryType } from "../types/contact.types.js";

const getEnv = (key: string, fallback?: string): string | undefined => {
  return process.env[key] || fallback;
};

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  defaultContactEmail: string;
}

function emailConfig(): EmailConfig {
  return {
    host: getEnv("SMTP_HOST", "") || "",
    port: Number(getEnv("SMTP_PORT", "587")),
    user: getEnv("SMTP_USER", "") || "",
    password: getEnv("SMTP_PASSWORD", "") || "",
    from: getEnv("SMTP_FROM", "concierge@tarius.com") || "concierge@tarius.com",
    defaultContactEmail:
      getEnv("DEFAULT_CONTACT_EMAIL", "concierge@tarius.com") || "concierge@tarius.com",
  };
}

interface InquiryConfig {
  label: string;
  subject: string;
  recipient: string | undefined;
}

export function getInquiryConfig(inquiryType: InquiryType): InquiryConfig {
  const configs: Record<InquiryType, InquiryConfig> = {
    product: {
      label: "Product Inquiry",
      subject: "Product Inquiry",
      recipient: getEnv("PRODUCT_INQUIRY_EMAIL"),
    },
    buy: {
      label: "Where to Buy",
      subject: "Where to Buy Inquiry",
      recipient: getEnv("SALES_EMAIL"),
    },
    bulk: {
      label: "Bulk / Wholesale Inquiry",
      subject: "Wholesale Inquiry",
      recipient: getEnv("SALES_EMAIL"),
    },
    retail: {
      label: "Retail / Stockist Partnership",
      subject: "Retail / Stockist Partnership",
      recipient: getEnv("PARTNERSHIPS_EMAIL"),
    },
    quality: {
      label: "Quality Complaint",
      subject: "Quality Complaint",
      recipient: getEnv("QUALITY_EMAIL"),
    },
    cert: {
      label: "Certification / Documentation Request",
      subject: "Certification / Documentation Request",
      recipient: getEnv("COMPLIANCE_EMAIL"),
    },
    gifting: {
      label: "Corporate / Custom Gifting",
      subject: "Corporate / Custom Gifting",
      recipient: getEnv("SALES_EMAIL"),
    },
    collab: {
      label: "Collaboration / Influencer Partnership",
      subject: "Collaboration / Influencer Partnership",
      recipient: getEnv("PARTNERSHIPS_EMAIL"),
    },
    press: {
      label: "Press & Media Inquiry",
      subject: "Press & Media Inquiry",
      recipient: getEnv("PRESS_EMAIL"),
    },
    careers: {
      label: "Career Application",
      subject: "Career Application",
      recipient: getEnv("CAREERS_EMAIL"),
    },
    feedback: {
      label: "General Feedback",
      subject: "General Feedback",
      recipient: getEnv("DEFAULT_CONTACT_EMAIL"),
    },
    other: {
      label: "Other Inquiry",
      subject: "General Inquiry",
      recipient: getEnv("DEFAULT_CONTACT_EMAIL"),
    },
  };

  return configs[inquiryType];
}

export function getSmtpConfig(): EmailConfig {
  return emailConfig();
}
