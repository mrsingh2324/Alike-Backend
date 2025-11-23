import { Schema, model } from "mongoose";
import { PlatformType } from "../types/shared";
const DeviceTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: Object.values(PlatformType), required: true }
}, { timestamps: true });
export const DeviceTokenModel = model("DeviceToken", DeviceTokenSchema);
//# sourceMappingURL=DeviceToken.js.map