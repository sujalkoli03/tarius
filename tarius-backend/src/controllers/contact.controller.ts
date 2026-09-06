import type { Request, Response } from "express";
import { sendContactEmail } from "../services/email.service.js";
import type { ContactFormData, InquiryType } from "../types/contact.types.js";

const INQUIRY_TYPES: InquiryType[] = [
  "product",
  "buy",
  "bulk",
  "retail",
  "quality",
  "cert",
  "gifting",
  "collab",
  "press",
  "careers",
  "feedback",
  "other",
];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function parseBoolean(value?: string): boolean | undefined {
  if (value === undefined) return undefined;
  return value === "true" || value === "on" || value === "1" || value === "yes";
}

function parseFeedbackProducts(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value.split(",").map((p) => p.trim()).filter(Boolean);
}

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateFiles(files: Express.Multer.File[]): string | null {
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return `File type "${file.originalname}" is not supported. Only JPG, PNG, WEBP, and PDF are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.originalname}" exceeds the 5MB size limit.`;
    }
  }
  return null;
}

export async function contactHandler(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, string>;

  const honeypot = (body.website || "").trim();
  if (honeypot) {
    res.status(200).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
    });
    return;
  }

  const inquiryType = body.inquiryType;
  if (!INQUIRY_TYPES.includes(inquiryType as InquiryType)) {
    res.status(400).json({
      success: false,
      message: "Invalid inquiry type.",
    });
    return;
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name) {
    res.status(400).json({
      success: false,
      message: "Name is required.",
    });
    return;
  }

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required.",
    });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({
      success: false,
      message: "A valid email address is required.",
    });
    return;
  }

  const uploadedFiles = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const fileList: Express.Multer.File[] = [];
  if (uploadedFiles) {
    for (const fieldFiles of Object.values(uploadedFiles)) {
      for (const file of fieldFiles) {
        fileList.push(file);
      }
    }
  }

  const fileError = validateFiles(fileList);
  if (fileError) {
    res.status(400).json({
      success: false,
      message: fileError,
    });
    return;
  }

  if (inquiryType === "quality" && fileList.length === 0) {
    res.status(400).json({
      success: false,
      message: "A quality complaint requires at least one supporting file (invoice, product photo, or batch photo).",
    });
    return;
  }

  if (inquiryType === "feedback") {
    const feedbackProducts = parseFeedbackProducts(body.feedbackProducts) || [];
    if (feedbackProducts.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please select at least one product you are providing feedback on.",
      });
      return;
    }
  }

  const uploads: { [fieldname: string]: Express.Multer.File } = {};
  for (const file of fileList) {
    if (!uploads[file.fieldname]) {
      uploads[file.fieldname] = file;
    }
  }

  const formData: ContactFormData = {
    inquiryType: inquiryType as InquiryType,
    name,
    email,
    phone: body.phone || undefined,
    preferredContact: body.preferredContact || undefined,
    message: message.length > 0 ? message : undefined,

    giftingProducts:
      body.giftingProductsSpirulina !== undefined || body.giftingProductsMoringa !== undefined
        ? {
            spirulina: parseBoolean(body.giftingProductsSpirulina) ?? false,
            moringa: parseBoolean(body.giftingProductsMoringa) ?? false,
          }
        : undefined,
    spirulinaQty: body.spirulinaQty || undefined,
    moringaQty: body.moringaQty || undefined,
    deliveryDate: body.deliveryDate || undefined,
    deliveryTime: body.deliveryTime || undefined,
    deliveryLocation: body.deliveryLocation || undefined,

    socialHandle: body.socialHandle || undefined,
    collaborationReason: body.collaborationReason || undefined,
    collabProducts: body.collabProducts || undefined,
    eventDate: body.eventDate || undefined,
    eventTime: body.eventTime || undefined,

    position: body.position || undefined,
    expectedSalary: body.expectedSalary || undefined,
    qualifications: body.qualifications || undefined,
    tentativeJoiningDate: body.tentativeJoiningDate || undefined,

    feedbackProducts: parseFeedbackProducts(body.feedbackProducts),
    purchasePlatform: body.purchasePlatform || undefined,
    purchaseDate: body.purchaseDate || undefined,

    resumeFile: uploads.resumeFile,
    invoiceFile: uploads.invoiceFile,
    productPhoto: uploads.productPhoto,
    batchPhoto: uploads.batchPhoto,
  };

  try {
    await sendContactEmail(formData);
    res.status(200).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
    });
  } catch (error) {
    console.error("Contact email failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to submit your inquiry at the moment. Please try again later.",
    });
  }
}