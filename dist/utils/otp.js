import bcrypt from "bcryptjs";
export const generateNumericOtp = (length = 6) => {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
export const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};
export const verifyOtpHash = (otp, hash) => {
    return bcrypt.compare(otp, hash);
};
//# sourceMappingURL=otp.js.map