"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserHandler = exports.verifyPhoneOtpHandler = exports.verifyEmailOtpHandler = exports.requestPhoneOtpHandler = exports.requestEmailOtpHandler = void 0;
// import { OTPChannel } from "@alike/shared";
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_service_1 = require("../services/auth.service");
// Local OTPChannel definition
const OTPChannel = {
    PHONE: 'phone',
    EMAIL: 'email'
};
exports.requestEmailOtpHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const data = await (0, auth_service_1.requestEmailOtp)(email);
    res.json({ success: true, data });
});
exports.requestPhoneOtpHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { phone } = req.body;
    const data = await (0, auth_service_1.requestPhoneOtp)(phone);
    res.json({ success: true, data });
});
exports.verifyEmailOtpHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, otp, name, phone, profilePicUrl } = req.body;
    console.log(`\n📨 VERIFY EMAIL OTP REQUEST:`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 OTP: ${otp}`);
    console.log(`👤 Name: ${name}`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`🖼️ Profile Pic: ${profilePicUrl}`);
    const data = await (0, auth_service_1.verifyOtp)({
        channel: OTPChannel.EMAIL,
        target: email,
        otp,
        name,
        email,
        phone,
        profilePicUrl
    });
    res.json({ success: true, data });
});
exports.verifyPhoneOtpHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { phone, otp, name, email, profilePicUrl } = req.body;
    const data = await (0, auth_service_1.verifyOtp)({
        channel: OTPChannel.PHONE,
        target: phone,
        otp,
        name,
        email,
        phone,
        profilePicUrl
    });
    res.json({ success: true, data });
});
exports.getCurrentUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, auth_service_1.getAuthenticatedUser)(req.userId);
    res.json({ success: true, data: user });
});
//# sourceMappingURL=auth.controller.js.map