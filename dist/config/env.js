"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(5000),
    MONGO_URI: zod_1.z.string().default("mongodb://127.0.0.1:27017/alike"),
    JWT_SECRET: zod_1.z.string().min(32).default("development-only-secret-please-change-123456"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    OTP_EXPIRY_MINUTES: zod_1.z.coerce.number().default(10),
    TWILIO_ACCOUNT_SID: zod_1.z.string().optional(),
    TWILIO_AUTH_TOKEN: zod_1.z.string().optional(),
    TWILIO_PHONE_NUMBER: zod_1.z.string().optional(),
    EMAILJS_SERVICE_ID: zod_1.z.string().optional(),
    EMAILJS_TEMPLATE_ID: zod_1.z.string().optional(),
    EMAILJS_PUBLIC_KEY: zod_1.z.string().optional(),
    EMAILJS_PRIVATE_KEY: zod_1.z.string().optional(),
    EMAIL_USER: zod_1.z.string().optional(),
    EMAIL_PASS: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    FCM_PROJECT_ID: zod_1.z.string().optional(),
    FCM_CLIENT_EMAIL: zod_1.z.string().optional(),
    FCM_PRIVATE_KEY: zod_1.z.string().optional(),
    CLIENT_WEB_BASE_URL: zod_1.z.string().url().optional(),
    CLIENT_MOBILE_BASE_URL: zod_1.z.string().url().optional(),
    ALLOWED_ORIGINS: zod_1.z.string().optional()
});
exports.env = envSchema.parse(process.env);
exports.isProduction = exports.env.NODE_ENV === "production";
//# sourceMappingURL=env.js.map