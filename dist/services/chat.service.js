"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUnreadCount = exports.incrementUnreadForParticipants = exports.makeAdmin = exports.updateGroupDetails = exports.removeMembers = exports.addMembers = exports.getChatDetails = exports.listChats = exports.createGroupChat = exports.createOrGetSingleChat = exports.ensureChatMembership = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const Chat_1 = require("../models/Chat");
const ChatParticipant_1 = require("../models/ChatParticipant");
const User_1 = require("../models/User");
const BlockedUser_1 = require("../models/BlockedUser");
var ChatType;
(function (ChatType) {
    ChatType["SINGLE"] = "single";
    ChatType["DIRECT"] = "direct";
    ChatType["GROUP"] = "group";
})(ChatType || (ChatType = {}));
const ensureNotBlocked = async (userId, otherUserId) => {
    const [blockedByOther, blockedByUser] = await Promise.all([
        BlockedUser_1.BlockedUserModel.findOne({ userId: otherUserId, blockedUserId: userId }),
        BlockedUser_1.BlockedUserModel.findOne({ userId, blockedUserId: otherUserId })
    ]);
    if (blockedByUser) {
        throw (0, http_errors_1.default)(403, "You have blocked this user");
    }
    if (blockedByOther) {
        throw (0, http_errors_1.default)(403, "You are blocked by this user");
    }
};
const ensureChatMembership = async (chatId, userId) => {
    const participant = await ChatParticipant_1.ChatParticipantModel.findOne({ chatId, userId });
    if (!participant) {
        throw (0, http_errors_1.default)(403, "You are not a participant of this chat");
    }
    return participant;
};
exports.ensureChatMembership = ensureChatMembership;
const createOrGetSingleChat = async (userId, targetUserId) => {
    if (userId === targetUserId) {
        throw (0, http_errors_1.default)(400, "Cannot chat with yourself");
    }
    await ensureNotBlocked(userId, targetUserId);
    const membersHash = [userId, targetUserId].sort().join(":");
    let chat = await Chat_1.ChatModel.findOne({ type: ChatType.SINGLE, membersHash })
        .populate("members")
        .populate("lastMessage");
    if (!chat) {
        chat = await Chat_1.ChatModel.create({
            type: ChatType.SINGLE,
            createdBy: userId,
            members: [userId, targetUserId],
            membersHash
        });
        await ChatParticipant_1.ChatParticipantModel.insertMany([
            { chatId: chat.id, userId, role: "member" },
            { chatId: chat.id, userId: targetUserId, role: "member" }
        ]);
        chat = await chat.populate("members");
    }
    return chat;
};
exports.createOrGetSingleChat = createOrGetSingleChat;
const createGroupChat = async (creatorId, payload) => {
    const memberIds = Array.from(new Set([creatorId, ...payload.memberIds]));
    const users = await User_1.UserModel.find({ _id: { $in: memberIds } });
    if (users.length !== memberIds.length) {
        throw (0, http_errors_1.default)(400, "One or more members do not exist");
    }
    const chat = await Chat_1.ChatModel.create({
        type: ChatType.GROUP,
        createdBy: creatorId,
        members: memberIds,
        groupName: payload.name,
        groupAvatarUrl: payload.avatarUrl ?? null
    });
    await ChatParticipant_1.ChatParticipantModel.insertMany(memberIds.map((memberId) => ({
        chatId: chat.id,
        userId: memberId,
        role: memberId === creatorId ? "admin" : "member"
    })));
    return chat;
};
exports.createGroupChat = createGroupChat;
const listChats = async (userId) => {
    const participants = await ChatParticipant_1.ChatParticipantModel.find({ userId })
        .sort({ updatedAt: -1 })
        .populate({
        path: "chatId",
        populate: [
            { path: "members", select: "name profilePicUrl isOnline lastSeen about" },
            { path: "lastMessage" }
        ]
    });
    return participants.map((participant) => {
        // populate may yield mixed types; treat as any for safety in mapping
        const chat = participant.chatId;
        const lastMessage = chat?.lastMessage ?? null;
        return {
            id: chat.id,
            type: chat.type,
            createdBy: chat.createdBy,
            groupName: chat.groupName,
            groupAvatarUrl: chat.groupAvatarUrl,
            members: chat.members.map((member) => ({
                id: member.id,
                name: member.name,
                profilePicUrl: member.profilePicUrl,
                about: member.about,
                isOnline: member.isOnline,
                lastSeen: member.lastSeen
            })),
            unreadCount: participant.unreadCount,
            lastMessage: lastMessage
                ? {
                    id: lastMessage.id || lastMessage._id,
                    chatId: chat.id,
                    senderId: lastMessage.senderId,
                    text: lastMessage.text,
                    status: lastMessage.status,
                    createdAt: lastMessage.createdAt,
                    updatedAt: lastMessage.updatedAt
                }
                : null,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        };
    });
};
exports.listChats = listChats;
const getChatDetails = async (chatId, userId) => {
    await (0, exports.ensureChatMembership)(chatId, userId);
    const chat = await Chat_1.ChatModel.findById(chatId)
        .populate("members", "name profilePicUrl about isOnline lastSeen")
        .populate("lastMessage");
    if (!chat) {
        throw (0, http_errors_1.default)(404, "Chat not found");
    }
    return chat;
};
exports.getChatDetails = getChatDetails;
const addMembers = async (chatId, adminId, memberIds) => {
    const adminParticipant = await (0, exports.ensureChatMembership)(chatId, adminId);
    if (adminParticipant.role !== "admin") {
        throw (0, http_errors_1.default)(403, "Only admins can add members");
    }
    const chat = await Chat_1.ChatModel.findById(chatId);
    if (!chat || chat.type !== ChatType.GROUP) {
        throw (0, http_errors_1.default)(400, "Not a group chat");
    }
    const existing = await ChatParticipant_1.ChatParticipantModel.find({ chatId, userId: { $in: memberIds } });
    const existingIds = new Set(existing.map((p) => p.userId.toString()));
    const newMembers = memberIds.filter((id) => !existingIds.has(id));
    if (!newMembers.length)
        return;
    await ChatParticipant_1.ChatParticipantModel.insertMany(newMembers.map((userId) => ({ chatId, userId, role: "member" })));
    chat.members = Array.from(new Set([...chat.members.map((m) => m.toString()), ...newMembers])).map((id) => new mongoose_1.Types.ObjectId(id));
    await chat.save();
};
exports.addMembers = addMembers;
const removeMembers = async (chatId, adminId, memberIds) => {
    const adminParticipant = await (0, exports.ensureChatMembership)(chatId, adminId);
    if (adminParticipant.role !== "admin") {
        throw (0, http_errors_1.default)(403, "Only admins can remove members");
    }
    await ChatParticipant_1.ChatParticipantModel.deleteMany({ chatId, userId: { $in: memberIds, $ne: adminId } });
    await Chat_1.ChatModel.findByIdAndUpdate(chatId, {
        $pull: { members: { $in: memberIds.map((id) => new mongoose_1.Types.ObjectId(id)) } }
    });
};
exports.removeMembers = removeMembers;
const updateGroupDetails = async (chatId, adminId, payload) => {
    const adminParticipant = await (0, exports.ensureChatMembership)(chatId, adminId);
    if (adminParticipant.role !== "admin") {
        throw (0, http_errors_1.default)(403, "Only admins can update group details");
    }
    const chat = await Chat_1.ChatModel.findById(chatId);
    if (!chat || chat.type !== ChatType.GROUP) {
        throw (0, http_errors_1.default)(400, "Not a group chat");
    }
    if (payload.name)
        chat.groupName = payload.name;
    if (payload.avatarUrl !== undefined)
        chat.groupAvatarUrl = payload.avatarUrl;
    await chat.save();
};
exports.updateGroupDetails = updateGroupDetails;
const makeAdmin = async (chatId, adminId, memberId) => {
    const adminParticipant = await (0, exports.ensureChatMembership)(chatId, adminId);
    if (adminParticipant.role !== "admin") {
        throw (0, http_errors_1.default)(403, "Only admins can assign admin role");
    }
    await ChatParticipant_1.ChatParticipantModel.updateOne({ chatId, userId: memberId }, { role: "admin" });
};
exports.makeAdmin = makeAdmin;
const incrementUnreadForParticipants = async (chatId, senderId) => {
    await ChatParticipant_1.ChatParticipantModel.updateMany({ chatId, userId: { $ne: senderId } }, { $inc: { unreadCount: 1 } });
};
exports.incrementUnreadForParticipants = incrementUnreadForParticipants;
const resetUnreadCount = async (chatId, userId) => {
    await ChatParticipant_1.ChatParticipantModel.updateOne({ chatId, userId }, { unreadCount: 0, lastReadAt: new Date() });
};
exports.resetUnreadCount = resetUnreadCount;
//# sourceMappingURL=chat.service.js.map