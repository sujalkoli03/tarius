import nodemailer from "nodemailer";
import { getSmtpConfig, getInquiryConfig } from "../config/email.config.js";
import type { ContactFormData, InquiryType } from "../types/contact.types.js";

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formValue(value: unknown, placeholder = "—"): string {
  if (value === undefined || value === null || value === "") {
    return placeholder;
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}

function buildEmailBody(fields: ContactFormData, inquiryType: InquiryType, label: string): string {
  const rows: Array<[string, string]> = [
    ["Inquiry Type", label],
    ["Name", formValue(fields.name)],
    ["Email", formValue(fields.email)],
    ["Phone", formValue(fields.phone)],
    ["Preferred Contact", formValue(fields.preferredContact)],
  ];

  switch (inquiryType) {
    case "gifting":
      rows.push(
        ["Spirulina Selected", formValue(fields.giftingProducts?.spirulina)],
        ["Spirulina Quantity", formValue(fields.spirulinaQty)],
        ["Moringa Selected", formValue(fields.giftingProducts?.moringa)],
        ["Moringa Quantity", formValue(fields.moringaQty)],
        ["Delivery Date", formValue(fields.deliveryDate)],
        ["Delivery Time", formValue(fields.deliveryTime)],
        ["Delivery Location", formValue(fields.deliveryLocation)]
      );
      break;

    case "collab":
    case "press":
      rows.push(
        ["Social Handle / Page", formValue(fields.socialHandle)],
        ["Products to Showcase", formValue(fields.collabProducts)],
        ["Event Date", formValue(fields.eventDate)],
        ["Event Time", formValue(fields.eventTime)],
        ["Reason for Partnership", formValue(fields.collaborationReason)]
      );
      break;

    case "careers":
      rows.push(
        ["Position Applying For", formValue(fields.position)],
        ["Expected Compensation", formValue(fields.expectedSalary)],
        ["Qualifications / Experience", formValue(fields.qualifications)],
        ["Tentative Joining Date", formValue(fields.tentativeJoiningDate)]
      );
      break;

    case "feedback":
      rows.push(
        ["Product(s) Reviewed", formValue(fields.feedbackProducts?.join(", "))],
        ["Purchased From", formValue(fields.purchasePlatform)],
        ["Purchase Date", formValue(fields.purchaseDate)]
      );
      break;

    default:
      break;
  }

  rows.push(["Message", formValue(fields.message)]);

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #eeece4;font-size:13px;color:#6f7757;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;vertical-align:top;width:200px;">${k}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #eeece4;font-size:14px;color:#1f211c;vertical-align:top;">${v}</td>
        </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="margin:0;padding:0;background:#f7f5ef;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ef;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #eeece4;">            
            <tr>
              <td style="padding:40px 40px 24px;border-bottom:3px solid #c8b99a;">
                <div style="font-family:Georgia,serif;font-size:30px;font-weight:600;letter-spacing:0.14em;color:#1f211c;">TARIUS</div>
                <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#6f7757;margin-top:6px;">Premium Spirulina &amp; Moringa</div>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 40px 0;">
                <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#c8b99a;margin-bottom:10px;">New Customer Inquiry</div>
                <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:500;color:#1f211c;margin:0 0 4px;">${label}</h1>
                <div style="font-family:Arial,sans-serif;font-size:12px;color:#6f7757;margin-bottom:24px;">Submitted ${formatDate(new Date())}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 40px 0;">
                <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6f7757;border-bottom:1px solid #eeece4;padding-bottom:8px;margin-bottom:4px;">Customer Details &amp; Inquiry Information</div>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 40px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:1px solid #eeece4;border-right:1px solid #eeece4;border-top:1px solid #eeece4;">
                  ${tableRows}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 40px 12px;">
                <div style="background:#f7f5ef;border-left:3px solid #c8b99a;padding:14px 18px;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#3b3d36;">
                  Reply directly to this email to respond to the customer.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 40px 36px;">
                <div style="border-top:1px solid #eeece4;padding-top:18px;">
                  <div style="font-family:Georgia,serif;font-size:16px;letter-spacing:0.12em;color:#1f211c;margin-bottom:6px;">TARIUS</div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.7;color:#6f7757;">Organic. Powerful. Natural.</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export async function sendContactEmail(fields: ContactFormData): Promise<void> {
  const config = getSmtpConfig();
  const inquiry = getInquiryConfig(fields.inquiryType);

  const recipient = inquiry.recipient || config.defaultContactEmail;
  const subject = `[TARIUS] ${inquiry.subject} — ${fields.name}`;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  const attachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }> = [];

  const attachFile = (file?: Express.Multer.File) => {
    if (file && file.buffer && file.buffer.length > 0) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      });
    }
  };

  attachFile(fields.resumeFile);
  attachFile(fields.invoiceFile);
  attachFile(fields.productPhoto);
  attachFile(fields.batchPhoto);

  await transporter.sendMail({
    from: `TARIUS Concierge <${config.from}>`,
    to: recipient,
    replyTo: fields.email,
    subject,
    html: buildEmailBody(fields, fields.inquiryType, inquiry.label),
    ...(attachments.length > 0 ? { attachments } : {}),
  });
}