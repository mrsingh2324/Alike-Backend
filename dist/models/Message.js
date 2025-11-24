"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
// import { MessageStatus } from "@alike/shared";
// Local MessageStatus definition
const MessageStatus = {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read'
};
const MessageSchema = new mongoose_1.Schema({
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: false },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'file'] },
    caption: { type: String },
    status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.SENT },
    editedAt: { type: Date },
    isDeletedForSender: { type: Boolean, default: false },
    isDeletedForAll: { type: Boolean, default: false }
}, { timestamps: true });
exports.MessageModel = (0, mongoose_1.model)("Message", MessageSchema);
//# sourceMappingURL=Message.js.map