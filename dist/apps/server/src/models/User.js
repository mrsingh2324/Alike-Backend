import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    uniqueId: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    profilePicUrl: { type: String, default: "" },
    about: { type: String, default: "Hey there! I am using Alike." },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null }
}, { timestamps: true });
export const UserModel = model("User", UserSchema);
