import { Schema, model } from "mongoose";
const ContactSchema = new Schema({
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactUserId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
ContactSchema.index({ ownerUserId: 1, contactUserId: 1 }, { unique: true });
export const ContactModel = model("Contact", ContactSchema);
//# sourceMappingURL=Contact.js.map