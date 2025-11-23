import createHttpError from "http-errors";
import dayjs from "dayjs";
// import { send } from "@emailjs/nodejs";
// import { OTPChannel } from "../packages/shared/src";
import { UserModel } from "../models/User";
import { OtpCodeModel } from "../models/OtpCode";
import { env } from "../config/env";
import { getTwilioClient } from "../config/twilio";
import { hashOtp, generateNumericOtp, verifyOtpHash } from "../utils/otp";
import { signAccessToken } from "../utils/jwt";
import { createOrUpdateUser, generateUniqueId } from "./user.service";
import { sendOtpEmail } from "./emailService";
import { logger } from "../config/logger";
const OTPChannel = {
    PHONE: "phone",
    EMAIL: "email"
};
const OTP_LENGTH = 6;
const upsertOtp = async (channel, target, code) => {
    const codeHash = await hashOtp(code);
    const expiresAt = dayjs().add(env.OTP_EXPIRY_MINUTES, "minute").toDate();
    if (env.NODE_ENV !== "production") {
        logger.info({ channel, target, code, expiresAt }, "OTP generated (development mode)");
    }
    await OtpCodeModel.findOneAndUpdate({ channel, target }, { codeHash, expiresAt, attempts: 0 }, { upsert: true, new: true });
    return expiresAt;
};
const sendEmailOtp = async (email, code) => {
    await sendOtpEmail(email, code);
    /*
    if (!env.EMAILJS_SERVICE_ID || !env.EMAILJS_TEMPLATE_ID || !env.EMAILJS_PUBLIC_KEY || !env.EMAILJS_PRIVATE_KEY) {
      const message = "EmailJS credentials missing; cannot send OTP email";
      logger.error(message);
      if (env.NODE_ENV === "production") {
        throw createHttpError(500, "Email service not configured");
      }
      return logger.warn("Skipping email send because service is not configured (development mode)");
    }
  
    try {
      logger.info(`Sending Email OTP to ${email}`);
  
      const templateParams = {
        to_email: email,
        name: email.split("@")[0] || "User",
        otp_code: code,
        expiry_minutes: String(env.OTP_EXPIRY_MINUTES),
        company_name: "Alike Chat"
      } as const;
  
      await send(
        env.EMAILJS_SERVICE_ID,
        env.EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: env.EMAILJS_PUBLIC_KEY,
          privateKey: env.EMAILJS_PRIVATE_KEY
        }
      );
  
      logger.info(`Email OTP sent successfully to ${email}`);
    } catch (error) {
      logger.error({ error }, "Failed to send EmailJS OTP");
      if (env.NODE_ENV === "production") {
        throw createHttpError(502, "Failed to deliver verification email");
      }
      logger.warn("Continuing without email delivery (development mode)");
    }
    */
};
const sendPhoneOtp = async (phone, code) => {
    const client = getTwilioClient();
    if (!client || !env.TWILIO_PHONE_NUMBER) {
        logger.warn("Twilio credentials missing; skipping SMS OTP send");
        return;
    }
    await client.messages.create({
        body: `Your Alike verification code is ${code}`,
        from: env.TWILIO_PHONE_NUMBER,
        to: phone
    });
};
export const requestEmailOtp = async (email) => {
    const otp = generateNumericOtp(OTP_LENGTH);
    const expiresAt = await upsertOtp(OTPChannel.EMAIL, email.toLowerCase(), otp);
    await sendEmailOtp(email, otp);
    return { expiresAt };
};
export const requestPhoneOtp = async (phone) => {
    const otp = generateNumericOtp(OTP_LENGTH);
    const expiresAt = await upsertOtp(OTPChannel.PHONE, phone, otp);
    await sendPhoneOtp(phone, otp);
    return { expiresAt };
};
const getOrCreateUser = async ({ email, phone, name, profilePicUrl }) => {
    if (!name) {
        throw createHttpError(400, "Name is required for first-time signup");
    }
    const user = await createOrUpdateUser({
        email: email?.toLowerCase(),
        phone,
        name,
        profilePicUrl,
        about: "Hey there! I am using Alike."
    });
    return user;
};
const consumeOtp = async ({ channel, target, otp }) => {
    const record = await OtpCodeModel.findOne({ channel, target });
    if (!record) {
        throw createHttpError(400, "OTP not found. Request a new code.");
    }
    if (dayjs(record.expiresAt).isBefore(dayjs())) {
        await record.deleteOne();
        throw createHttpError(400, "OTP has expired. Request a new code.");
    }
    const isValid = await verifyOtpHash(otp, record.codeHash);
    if (!isValid) {
        record.attempts += 1;
        await record.save();
        throw createHttpError(400, "Incorrect OTP");
    }
    await record.deleteOne();
};
export const verifyOtp = async (params) => {
    const { channel, target, otp, name, email, phone, profilePicUrl } = params;
    await consumeOtp({ channel, target, otp });
    const user = await getOrCreateUser({ email, phone, name, profilePicUrl });
    const accessToken = signAccessToken(user.id);
    return {
        accessToken,
        user
    };
};
export const getAuthenticatedUser = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    if (!user.uniqueId) {
        let uniqueId;
        let attempts = 0;
        const maxAttempts = 10;
        do {
            uniqueId = generateUniqueId();
            const existingUser = await UserModel.findOne({ uniqueId });
            if (!existingUser) {
                user.uniqueId = uniqueId;
                await user.save();
                break;
            }
            attempts++;
        } while (attempts < maxAttempts);
        if (attempts >= maxAttempts) {
            throw createHttpError(500, "Failed to generate unique ID");
        }
    }
    return user;
};
