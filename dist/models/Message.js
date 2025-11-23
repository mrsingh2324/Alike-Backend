import { Schema, model } from "mongoose";
// import { MessageStatus } from "../packages/shared/src";
// Local MessageStatus definition
const MessageStatus = {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read'
};
const MessageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.SENT },
    editedAt: { type: Date },
    isDeletedForSender: { type: Boolean, default: false },
    isDeletedForAll: { type: Boolean, default: false }
}, { timestamps: true });
export const MessageModel = model("Message", MessageSchema);
