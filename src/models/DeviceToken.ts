import { Schema, model, type Model, type Types } from "mongoose";
import { PlatformType } from "@alike/shared";

export interface IDeviceToken {
  userId: Types.ObjectId;
  token: string;
  platform: PlatformType;
}

const DeviceTokenSchema = new Schema<IDeviceToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: Object.values(PlatformType), required: true }
  },
  { timestamps: true }
);

export const DeviceTokenModel: Model<IDeviceToken> = model<IDeviceToken>("DeviceToken", DeviceTokenSchema);
