"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresenceAudience = exports.setUserOffline = exports.setUserOnline = void 0;
const User_1 = require("../models/User");
const ChatParticipant_1 = require("../models/ChatParticipant");
const setUserOnline = async (userId) => {
    await User_1.UserModel.findByIdAndUpdate(userId, { isOnline: true });
};
exports.setUserOnline = setUserOnline;
const setUserOffline = async (userId) => {
    await User_1.UserModel.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
};
exports.setUserOffline = setUserOffline;
const getPresenceAudience = async (userId) => {
    const memberships = await ChatParticipant_1.ChatParticipantModel.find({ userId }).select("chatId");
    const chatIds = memberships.map((member) => member.chatId);
    if (!chatIds.length)
        return [];
    const peers = await ChatParticipant_1.ChatParticipantModel.find({
        chatId: { $in: chatIds },
        userId: { $ne: userId }
    }).select("userId");
    return Array.from(new Set(peers.map((peer) => peer.userId.toString())));
};
exports.getPresenceAudience = getPresenceAudience;
//# sourceMappingURL=presence.service.js.map