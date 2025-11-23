import { Schema, model } from "mongoose";
const BlockedUserSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blockedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });
BlockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });
export const BlockedUserModel = model("BlockedUser", BlockedUserSchema);
