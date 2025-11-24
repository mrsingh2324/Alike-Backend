"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = exports.verifyOtp = exports.requestPhoneOtp = exports.requestEmailOtp = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const dayjs_1 = __importDefault(require("dayjs"));
// import { send } from "@emailjs/nodejs";
// import { OTPChannel } from "@alike/shared";
const User_1 = require("../models/User");
const OtpCode_1 = require("../models/OtpCode");
const env_1 = require("../config/env");
const twilio_1 = require("../config/twilio");
const otp_1 = require("../utils/otp");
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("./user.service");
const emailService_1 = require("./emailService");
const logger_1 = require("../config/logger");
const OTPChannel = {
    PHONE: "phone",
    EMAIL: "email"
};
const OTP_LENGTH = 6;
const upsertOtp = async (channel, target, code) => {
    const codeHash = await (0, otp_1.hashOtp)(code);
    const expiresAt = (0, dayjs_1.default)().add(env_1.env.OTP_EXPIRY_MINUTES, "minute").toDate();
    if (env_1.env.NODE_ENV !== "production") {
        logger_1.logger.info({ channel, target, code, expiresAt }, "OTP generated (development mode)");
    }
    await OtpCode_1.OtpCodeModel.findOneAndUpdate({ channel, target }, { codeHash, expiresAt, attempts: 0 }, { upsert: true, new: true });
    return expiresAt;
};
const sendEmailOtp = async (email, code) => {
    await (0, emailService_1.sendOtpEmail)(email, code);
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
    const client = (0, twilio_1.getTwilioClient)();
    if (!client || !env_1.env.TWILIO_PHONE_NUMBER) {
        logger_1.logger.warn("Twilio credentials missing; skipping SMS OTP send");
        return;
    }
    await client.messages.create({
        body: `Your Alike verification code is ${code}`,
        from: env_1.env.TWILIO_PHONE_NUMBER,
        to: phone
    });
};
const requestEmailOtp = async (email) => {
    const otp = (0, otp_1.generateNumericOtp)(OTP_LENGTH);
    const expiresAt = await upsertOtp(OTPChannel.EMAIL, email.toLowerCase(), otp);
    await sendEmailOtp(email, otp);
    return { expiresAt };
};
exports.requestEmailOtp = requestEmailOtp;
const requestPhoneOtp = async (phone) => {
    const otp = (0, otp_1.generateNumericOtp)(OTP_LENGTH);
    const expiresAt = await upsertOtp(OTPChannel.PHONE, phone, otp);
    await sendPhoneOtp(phone, otp);
    return { expiresAt };
};
exports.requestPhoneOtp = requestPhoneOtp;
const getOrCreateUser = async ({ email, phone, name, profilePicUrl }) => {
    if (!name) {
        throw (0, http_errors_1.default)(400, "Name is required for first-time signup");
    }
    const user = await (0, user_service_1.createOrUpdateUser)({
        email: email?.toLowerCase(),
        phone,
        name,
        profilePicUrl,
        about: "Hey there! I am using Alike."
    });
    return user;
};
const consumeOtp = async ({ channel, target, otp }) => {
    const record = await OtpCode_1.OtpCodeModel.findOne({ channel, target });
    if (!record) {
        throw (0, http_errors_1.default)(400, "OTP not found. Request a new code.");
    }
    if ((0, dayjs_1.default)(record.expiresAt).isBefore((0, dayjs_1.default)())) {
        await record.deleteOne();
        throw (0, http_errors_1.default)(400, "OTP has expired. Request a new code.");
    }
    const isValid = await (0, otp_1.verifyOtpHash)(otp, record.codeHash);
    if (!isValid) {
        record.attempts += 1;
        await record.save();
        throw (0, http_errors_1.default)(400, "Incorrect OTP");
    }
    await record.deleteOne();
};
const verifyOtp = async (params) => {
    const { channel, target, otp, name, email, phone, profilePicUrl } = params;
    await consumeOtp({ channel, target, otp });
    const user = await getOrCreateUser({ email, phone, name, profilePicUrl });
    const accessToken = (0, jwt_1.signAccessToken)(user.id);
    return {
        accessToken,
        user
    };
};
exports.verifyOtp = verifyOtp;
const getAuthenticatedUser = async (userId) => {
    const user = await User_1.UserModel.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    if (!user.uniqueId) {
        let uniqueId;
        let attempts = 0;
        const maxAttempts = 10;
        do {
            uniqueId = (0, user_service_1.generateUniqueId)();
            const existingUser = await User_1.UserModel.findOne({ uniqueId });
            if (!existingUser) {
                user.uniqueId = uniqueId;
                await user.save();
                break;
            }
            attempts++;
        } while (attempts < maxAttempts);
        if (attempts >= maxAttempts) {
            throw (0, http_errors_1.default)(500, "Failed to generate unique ID");
        }
    }
    return user;
};
exports.getAuthenticatedUser = getAuthenticatedUser;
//# sourceMappingURL=auth.service.js.map