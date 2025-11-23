import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(5000),
    MONGO_URI: z.string().default("mongodb://127.0.0.1:27017/alike"),
    JWT_SECRET: z.string().min(32).default("development-only-secret-please-change-123456"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    OTP_EXPIRY_MINUTES: z.coerce.number().default(10),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),
    EMAILJS_SERVICE_ID: z.string().optional(),
    EMAILJS_TEMPLATE_ID: z.string().optional(),
    EMAILJS_PUBLIC_KEY: z.string().optional(),
    EMAILJS_PRIVATE_KEY: z.string().optional(),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASS: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    FCM_PROJECT_ID: z.string().optional(),
    FCM_CLIENT_EMAIL: z.string().optional(),
    FCM_PRIVATE_KEY: z.string().optional(),
    CLIENT_WEB_BASE_URL: z.string().url().optional(),
    CLIENT_MOBILE_BASE_URL: z.string().url().optional(),
    ALLOWED_ORIGINS: z.string().optional()
});
export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === "production";
//# sourceMappingURL=env.js.map