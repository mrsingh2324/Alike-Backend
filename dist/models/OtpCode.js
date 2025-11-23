import { Schema, model } from "mongoose";
// import { OTPChannel } from "@alike/shared";
// Local OTPChannel definition
const OTPChannel = {
    PHONE: 'phone',
    EMAIL: 'email'
};
const OtpCodeSchema = new Schema({
    channel: { type: String, enum: Object.values(OTPChannel), required: true },
    target: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 }
}, { timestamps: true });
OtpCodeSchema.index({ channel: 1, target: 1 }, { unique: true });
export const OtpCodeModel = model("OtpCode", OtpCodeSchema);
//# sourceMappingURL=OtpCode.js.map