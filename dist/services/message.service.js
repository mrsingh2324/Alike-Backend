"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessagesRead = exports.markMessagesDelivered = exports.sendMessage = exports.getMessages = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Message_1 = require("../models/Message");
const Chat_1 = require("../models/Chat");
const BlockedUser_1 = require("../models/BlockedUser");
const chat_service_1 = require("./chat.service");
const shared_1 = require("../types/shared");
const getMessages = async (chatId, userId, options) => {
    await (0, chat_service_1.ensureChatMembership)(chatId, userId);
    const limit = Math.min(options.limit ?? 30, 100);
    const filters = { chatId };
    if (options.before) {
        filters._id = { $lt: options.before };
    }
    const messages = await Message_1.MessageModel.find(filters)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return messages.reverse();
};
exports.getMessages = getMessages;
const ensureNotBlockedForMessage = async (chatId, senderId) => {
    const chat = await Chat_1.ChatModel.findById(chatId);
    if (!chat) {
        throw (0, http_errors_1.default)(404, "Chat not found");
    }
    if (chat.type === "single") {
        const receiverId = chat.members.find((member) => member.toString() !== senderId)?.toString();
        if (!receiverId)
            return;
        const blocked = await BlockedUser_1.BlockedUserModel.findOne({ userId: receiverId, blockedUserId: senderId });
        if (blocked) {
            throw (0, http_errors_1.default)(403, "Recipient has blocked you");
        }
    }
};
const sendMessage = async (chatId, senderId, text) => {
    if (!text.trim()) {
        throw (0, http_errors_1.default)(400, "Message text is required");
    }
    await (0, chat_service_1.ensureChatMembership)(chatId, senderId);
    await ensureNotBlockedForMessage(chatId, senderId);
    const message = await Message_1.MessageModel.create({
        chatId,
        senderId,
        text,
        status: shared_1.MessageStatus.SENT
    });
    await Chat_1.ChatModel.findByIdAndUpdate(chatId, { lastMessage: message.id });
    await (0, chat_service_1.incrementUnreadForParticipants)(chatId, senderId);
    return message;
};
exports.sendMessage = sendMessage;
const markMessagesDelivered = async (chatId, userId) => {
    await (0, chat_service_1.ensureChatMembership)(chatId, userId);
    await Message_1.MessageModel.updateMany({ chatId, senderId: { $ne: userId }, status: shared_1.MessageStatus.SENT }, { status: shared_1.MessageStatus.DELIVERED });
};
exports.markMessagesDelivered = markMessagesDelivered;
const markMessagesRead = async (chatId, userId) => {
    await (0, chat_service_1.ensureChatMembership)(chatId, userId);
    await Message_1.MessageModel.updateMany({ chatId, senderId: { $ne: userId }, status: { $ne: shared_1.MessageStatus.READ } }, { status: shared_1.MessageStatus.READ });
    await (0, chat_service_1.resetUnreadCount)(chatId, userId);
};
exports.markMessagesRead = markMessagesRead;
//# sourceMappingURL=message.service.js.map