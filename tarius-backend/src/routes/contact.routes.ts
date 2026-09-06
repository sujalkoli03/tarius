import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { contactHandler } from "../controllers/contact.controller.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 4,
  },
});

const uploadFields = upload.fields([
  { name: "resumeFile", maxCount: 1 },
  { name: "invoiceFile", maxCount: 1 },
  { name: "productPhoto", maxCount: 1 },
  { name: "batchPhoto", maxCount: 1 },
]);

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions. Please try again later.",
  },
});

function handleUploadErrors(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        message: "File too large. Maximum allowed size is 5MB per file.",
      });
      return;
    }
    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        success: false,
        message: "Too many files uploaded. A maximum of 4 files is allowed.",
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: "Invalid file upload. Please check the selected file(s) and try again.",
    });
    return;
  }

  next(err);
}

const router = Router();

router.post(
  "/",
  contactRateLimiter,
  uploadFields,
  contactHandler,
  handleUploadErrors
);

export default router;