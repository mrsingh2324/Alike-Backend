// import { OTPChannel } from "../packages/shared/src";
import { asyncHandler } from "../utils/asyncHandler";
import { requestEmailOtp, requestPhoneOtp, verifyOtp, getAuthenticatedUser } from "../services/auth.service";
// Local OTPChannel definition
const OTPChannel = {
    PHONE: 'phone',
    EMAIL: 'email'
};
export const requestEmailOtpHandler = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const data = await requestEmailOtp(email);
    res.json({ success: true, data });
});
export const requestPhoneOtpHandler = asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const data = await requestPhoneOtp(phone);
    res.json({ success: true, data });
});
export const verifyEmailOtpHandler = asyncHandler(async (req, res) => {
    const { email, otp, name, phone, profilePicUrl } = req.body;
    console.log(`\n📨 VERIFY EMAIL OTP REQUEST:`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 OTP: ${otp}`);
    console.log(`👤 Name: ${name}`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`🖼️ Profile Pic: ${profilePicUrl}`);
    const data = await verifyOtp({
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
export const verifyPhoneOtpHandler = asyncHandler(async (req, res) => {
    const { phone, otp, name, email, profilePicUrl } = req.body;
    const data = await verifyOtp({
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
export const getCurrentUserHandler = asyncHandler(async (req, res) => {
    const user = await getAuthenticatedUser(req.userId);
    res.json({ success: true, data: user });
});
