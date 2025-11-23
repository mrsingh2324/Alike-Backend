import { Schema, model } from "mongoose";
// import { MessageStatus } from "@alike/shared";
// Local MessageStatus definition
const MessageStatus = {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read'
};
const MessageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: false },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'file'] },
    caption: { type: String },
    status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.SENT },
    editedAt: { type: Date },
    isDeletedForSender: { type: Boolean, default: false },
    isDeletedForAll: { type: Boolean, default: false }
}, { timestamps: true });
export const MessageModel = model("Message", MessageSchema);
//# sourceMappingURL=Message.js.map