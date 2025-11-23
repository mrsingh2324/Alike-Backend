import nodemailer from "nodemailer";
import createHttpError from "http-errors";
import { env } from "../config/env";
import { logger } from "../config/logger";
let transporter = null;
const getTransporter = () => {
    if (transporter) {
        return transporter;
    }
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
        const message = "Email credentials missing for Nodemailer";
        logger.error(message);
        throw createHttpError(500, "Email service not configured");
    }
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS
        }
    });
    return transporter;
};
export const sendOtpEmail = async (toEmail, otp) => {
    try {
        const mailTransporter = getTransporter();
        const mailOptions = {
            from: `Alike Chat <${env.EMAIL_USER}>`,
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
          <p>This code will expire in ${env.OTP_EXPIRY_MINUTES} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Best regards,<br>The Alike Chat Team</p>
        </div>
      `
        };
        await mailTransporter.sendMail(mailOptions);
        logger.info({ toEmail }, "OTP email sent successfully via Nodemailer");
    }
    catch (error) {
        logger.error({ error, toEmail }, "Failed to send OTP email via Nodemailer");
        throw createHttpError(502, "Failed to deliver verification email");
    }
};
