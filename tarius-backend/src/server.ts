import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

// Security
app.use(helmet());

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://tarius-git-dev-integration-sujal-s-projects5.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TARIUS backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Contact routes
app.use("/api/contact", contactRoutes);

// JSON 404 fallback for unknown API routes
app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

// Global JSON error handler (prevents raw HTML error pages from leaking)
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 TARIUS backend running on http://localhost:${PORT}`
  );
});