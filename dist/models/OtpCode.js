"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpCodeModel = void 0;
const mongoose_1 = require("mongoose");
// import { OTPChannel } from "@alike/shared";
// Local OTPChannel definition
const OTPChannel = {
    PHONE: 'phone',
    EMAIL: 'email'
};
const OtpCodeSchema = new mongoose_1.Schema({
    channel: { type: String, enum: Object.values(OTPChannel), required: true },
    target: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 }
}, { timestamps: true });
OtpCodeSchema.index({ channel: 1, target: 1 }, { unique: true });
exports.OtpCodeModel = (0, mongoose_1.model)("OtpCode", OtpCodeSchema);
//# sourceMappingURL=OtpCode.js.map