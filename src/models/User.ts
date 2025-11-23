import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export interface IUser {
  uniqueId: string;
  phone?: string;
  email?: string;
  name: string;
  profilePicUrl?: string;
  about?: string;
  isOnline: boolean;
  lastSeen?: Date | null;
}

export type IUserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
  {
    uniqueId: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    profilePicUrl: { type: String, default: "" },
    about: { type: String, default: "Hey there! I am using Alike." },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null }
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
