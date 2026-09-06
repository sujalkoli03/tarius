export type InquiryType =
  | "product"
  | "buy"
  | "bulk"
  | "retail"
  | "quality"
  | "cert"
  | "gifting"
  | "collab"
  | "press"
  | "careers"
  | "feedback"
  | "other";

export interface ContactFormData {
  inquiryType: InquiryType;
  name: string;
  email: string;
  phone?: string;
  preferredContact?: string;
  message?: string;

  // Gifting
  giftingProducts?: {
    spirulina: boolean;
    moringa: boolean;
  };
  spirulinaQty?: string;
  moringaQty?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryLocation?: string;

  // Collaboration / Press
  socialHandle?: string;
  collaborationReason?: string;
  collabProducts?: string;
  eventDate?: string;
  eventTime?: string;

  // Careers
  position?: string;
  expectedSalary?: string;
  qualifications?: string;
  tentativeJoiningDate?: string;

  // General Feedback
  feedbackProducts?: string[];
  purchasePlatform?: string;
  purchaseDate?: string;

  // Files
  resumeFile?: Express.Multer.File;
  invoiceFile?: Express.Multer.File;
  productPhoto?: Express.Multer.File;
  batchPhoto?: Express.Multer.File;
}

export interface ContactRequestBody {
  inquiryType: InquiryType;
  name: string;
  email: string;
  phone?: string;
  preferredContact?: string;
  message?: string;
  giftingProducts?: string;
  spirulinaQty?: string;
  moringaQty?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryLocation?: string;
  socialHandle?: string;
  collaborationReason?: string;
  collabProducts?: string;
  eventDate?: string;
  eventTime?: string;
  position?: string;
  expectedSalary?: string;
  qualifications?: string;
  tentativeJoiningDate?: string;
  feedbackProducts?: string;
  purchasePlatform?: string;
  purchaseDate?: string;
}
