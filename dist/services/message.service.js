import createHttpError from "http-errors";
import { MessageModel } from "../models/Message";
import { ChatModel } from "../models/Chat";
import { BlockedUserModel } from "../models/BlockedUser";
import { ensureChatMembership, incrementUnreadForParticipants, resetUnreadCount } from "./chat.service";
import { MessageStatus } from "../types/shared";
export const getMessages = async (chatId, userId, options) => {
    await ensureChatMembership(chatId, userId);
    const limit = Math.min(options.limit ?? 30, 100);
    const filters = { chatId };
    if (options.before) {
        filters._id = { $lt: options.before };
    }
    const messages = await MessageModel.find(filters)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return messages.reverse();
};
const ensureNotBlockedForMessage = async (chatId, senderId) => {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
        throw createHttpError(404, "Chat not found");
    }
    if (chat.type === "single") {
        const receiverId = chat.members.find((member) => member.toString() !== senderId)?.toString();
        if (!receiverId)
            return;
        const blocked = await BlockedUserModel.findOne({ userId: receiverId, blockedUserId: senderId });
        if (blocked) {
            throw createHttpError(403, "Recipient has blocked you");
        }
    }
};
export const sendMessage = async (chatId, senderId, text) => {
    if (!text.trim()) {
        throw createHttpError(400, "Message text is required");
    }
    await ensureChatMembership(chatId, senderId);
    await ensureNotBlockedForMessage(chatId, senderId);
    const message = await MessageModel.create({
        chatId,
        senderId,
        text,
        status: MessageStatus.SENT
    });
    await ChatModel.findByIdAndUpdate(chatId, { lastMessage: message.id });
    await incrementUnreadForParticipants(chatId, senderId);
    return message;
};
export const markMessagesDelivered = async (chatId, userId) => {
    await ensureChatMembership(chatId, userId);
    await MessageModel.updateMany({ chatId, senderId: { $ne: userId }, status: MessageStatus.SENT }, { status: MessageStatus.DELIVERED });
};
export const markMessagesRead = async (chatId, userId) => {
    await ensureChatMembership(chatId, userId);
    await MessageModel.updateMany({ chatId, senderId: { $ne: userId }, status: { $ne: MessageStatus.READ } }, { status: MessageStatus.READ });
    await resetUnreadCount(chatId, userId);
};
//# sourceMappingURL=message.service.js.map