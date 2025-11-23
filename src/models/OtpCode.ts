import { Schema, model, type Model } from "mongoose";
// import { OTPChannel } from "@alike/shared";

// Local OTPChannel definition
const OTPChannel = {
  PHONE: 'phone',
  EMAIL: 'email'
} as const;

type OTPChannel = typeof OTPChannel[keyof typeof OTPChannel];

export interface IOtpCode {
  channel: OTPChannel;
  target: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
}

const OtpCodeSchema = new Schema<IOtpCode>(
  {
    channel: { type: String, enum: Object.values(OTPChannel), required: true },
    target: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

OtpCodeSchema.index({ channel: 1, target: 1 }, { unique: true });

export const OtpCodeModel: Model<IOtpCode> = model<IOtpCode>("OtpCode", OtpCodeSchema);
