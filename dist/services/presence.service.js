import { UserModel } from "../models/User";
import { ChatParticipantModel } from "../models/ChatParticipant";
export const setUserOnline = async (userId) => {
    await UserModel.findByIdAndUpdate(userId, { isOnline: true });
};
export const setUserOffline = async (userId) => {
    await UserModel.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
};
export const getPresenceAudience = async (userId) => {
    const memberships = await ChatParticipantModel.find({ userId }).select("chatId");
    const chatIds = memberships.map((member) => member.chatId);
    if (!chatIds.length)
        return [];
    const peers = await ChatParticipantModel.find({
        chatId: { $in: chatIds },
        userId: { $ne: userId }
    }).select("userId");
    return Array.from(new Set(peers.map((peer) => peer.userId.toString())));
};
//# sourceMappingURL=presence.service.js.map