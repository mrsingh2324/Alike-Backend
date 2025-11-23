import { Schema, model, type Model, type Types } from "mongoose";

export interface IBlockedUser {
  userId: Types.ObjectId;
  blockedUserId: Types.ObjectId;
  createdAt?: Date;
}

const BlockedUserSchema = new Schema<IBlockedUser>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blockedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BlockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

export const BlockedUserModel: Model<IBlockedUser> = model<IBlockedUser>("BlockedUser", BlockedUserSchema);
