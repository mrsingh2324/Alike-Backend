"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const http_errors_1 = __importDefault(require("http-errors"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
let transporter = null;
const getTransporter = () => {
    if (transporter) {
        return transporter;
    }
    if (!env_1.env.EMAIL_USER || !env_1.env.EMAIL_PASS) {
        const message = "Email credentials missing for Nodemailer";
        logger_1.logger.error(message);
        throw (0, http_errors_1.default)(500, "Email service not configured");
    }
    transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: env_1.env.EMAIL_USER,
            pass: env_1.env.EMAIL_PASS
        }
    });
    return transporter;
};
const sendOtpEmail = async (toEmail, otp) => {
    try {
        const mailTransporter = getTransporter();
        const mailOptions = {
            from: `Alike Chat <${env_1.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Your Alike Chat Verification Code",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Alike Chat - Email Verification</h2>
          <p>Hi ${toEmail.split("@")[0] || "User"},</p>
          <p>Your verification code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2f855a; letter-spacing: 5px;">${otp}</span>
          </div>
          <p>This code will expire in ${env_1.env.OTP_EXPIRY_MINUTES} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Best regards,<br>The Alike Chat Team</p>
        </div>
      `
        };
        await mailTransporter.sendMail(mailOptions);
        logger_1.logger.info({ toEmail }, "OTP email sent successfully via Nodemailer");
    }
    catch (error) {
        logger_1.logger.error({ error, toEmail }, "Failed to send OTP email via Nodemailer");
        throw (0, http_errors_1.default)(502, "Failed to deliver verification email");
    }
};
exports.sendOtpEmail = sendOtpEmail;
//# sourceMappingURL=emailService.js.map