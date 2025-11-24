"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpHash = exports.hashOtp = exports.generateNumericOtp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateNumericOtp = (length = 6) => {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
exports.generateNumericOtp = generateNumericOtp;
const hashOtp = async (otp) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(otp, salt);
};
exports.hashOtp = hashOtp;
const verifyOtpHash = (otp, hash) => {
    return bcryptjs_1.default.compare(otp, hash);
};
exports.verifyOtpHash = verifyOtpHash;
//# sourceMappingURL=otp.js.map