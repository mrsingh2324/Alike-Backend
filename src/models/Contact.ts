import { Schema, model, type Model, type Types } from "mongoose";

export interface IContact {
  ownerUserId: Types.ObjectId;
  contactUserId: Types.ObjectId;
}

const ContactSchema = new Schema<IContact>(
  {
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactUserId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

ContactSchema.index({ ownerUserId: 1, contactUserId: 1 }, { unique: true });

export const ContactModel: Model<IContact> = model<IContact>("Contact", ContactSchema);
