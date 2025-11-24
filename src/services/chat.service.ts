import createHttpError from "http-errors";
import { Types } from "mongoose";
import { ChatModel } from "../models/Chat";
import { ChatParticipantModel } from "../models/ChatParticipant";
import { UserModel } from "../models/User";
import { BlockedUserModel } from "../models/BlockedUser";
import { MessageModel } from "../models/Message";
enum ChatType {
  SINGLE = 'single',
  DIRECT = 'direct',
  GROUP = 'group',
}

const ensureNotBlocked = async (userId: string, otherUserId: string) => {
  const [blockedByOther, blockedByUser] = await Promise.all([
    BlockedUserModel.findOne({ userId: otherUserId, blockedUserId: userId }),
    BlockedUserModel.findOne({ userId, blockedUserId: otherUserId })
  ]);

  if (blockedByUser) {
    throw createHttpError(403, "You have blocked this user");
  }

  if (blockedByOther) {
    throw createHttpError(403, "You are blocked by this user");
  }
};

export const ensureChatMembership = async (chatId: string, userId: string) => {
  const participant = await ChatParticipantModel.findOne({ chatId, userId });
  if (!participant) {
    throw createHttpError(403, "You are not a participant of this chat");
  }
  return participant;
};

export const createOrGetSingleChat = async (userId: string, targetUserId: string) => {
  if (userId === targetUserId) {
    throw createHttpError(400, "Cannot chat with yourself");
  }

  await ensureNotBlocked(userId, targetUserId);

  const membersHash = [userId, targetUserId].sort().join(":");
  let chat = await ChatModel.findOne({ type: ChatType.SINGLE, membersHash })
    .populate("members")
    .populate("lastMessage");

  if (!chat) {
    chat = await ChatModel.create({
      type: ChatType.SINGLE,
      createdBy: userId,
      members: [userId, targetUserId],
      membersHash
    });

    await ChatParticipantModel.insertMany([
      { chatId: chat.id, userId, role: "member" },
      { chatId: chat.id, userId: targetUserId, role: "member" }
    ]);

    chat = await chat.populate("members");
  }

  return chat;
};

export const createGroupChat = async (
  creatorId: string,
  payload: { name: string; memberIds: string[]; avatarUrl?: string }
) => {
  const memberIds = Array.from(new Set([creatorId, ...payload.memberIds]));
  const users = await UserModel.find({ _id: { $in: memberIds } });
  if (users.length !== memberIds.length) {
    throw createHttpError(400, "One or more members do not exist");
  }

  const chat = await ChatModel.create({
    type: ChatType.GROUP,
    createdBy: creatorId,
    members: memberIds,
    groupName: payload.name,
    groupAvatarUrl: payload.avatarUrl ?? null
  });

  await ChatParticipantModel.insertMany(
    memberIds.map((memberId) => ({
      chatId: chat.id,
      userId: memberId,
      role: memberId === creatorId ? "admin" : "member"
    }))
  );

  return chat;
};

export const listChats = async (userId: string) => {
  const participants = await ChatParticipantModel.find({ userId })
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
    const chat: any = participant.chatId as any;
    const lastMessage: any = chat?.lastMessage ?? null;

    return {
      id: chat.id,
      type: chat.type,
      createdBy: chat.createdBy,
      groupName: chat.groupName,
      groupAvatarUrl: chat.groupAvatarUrl,
      members: (chat.members as any[]).map((member: any) => ({
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

export const getChatDetails = async (chatId: string, userId: string) => {
  await ensureChatMembership(chatId, userId);

  const chat = await ChatModel.findById(chatId)
    .populate("members", "name profilePicUrl about isOnline lastSeen")
    .populate("lastMessage");

  if (!chat) {
    throw createHttpError(404, "Chat not found");
  }

  return chat;
};

export const addMembers = async (chatId: string, adminId: string, memberIds: string[]) => {
  const adminParticipant = await ensureChatMembership(chatId, adminId);
  if (adminParticipant.role !== "admin") {
    throw createHttpError(403, "Only admins can add members");
  }

  const chat = await ChatModel.findById(chatId);
  if (!chat || chat.type !== ChatType.GROUP) {
    throw createHttpError(400, "Not a group chat");
  }

  const existing = await ChatParticipantModel.find({ chatId, userId: { $in: memberIds } });
  const existingIds = new Set(existing.map((p) => p.userId.toString()));
  const newMembers = memberIds.filter((id) => !existingIds.has(id));
  if (!newMembers.length) return;

  await ChatParticipantModel.insertMany(
    newMembers.map((userId) => ({ chatId, userId, role: "member" }))
  );

  chat.members = Array.from(new Set([...chat.members.map((m) => m.toString()), ...newMembers])).map(
    (id) => new Types.ObjectId(id)
  );
  await chat.save();
};

export const removeMembers = async (chatId: string, adminId: string, memberIds: string[]) => {
  const adminParticipant = await ensureChatMembership(chatId, adminId);
  if (adminParticipant.role !== "admin") {
    throw createHttpError(403, "Only admins can remove members");
  }

  await ChatParticipantModel.deleteMany({ chatId, userId: { $in: memberIds, $ne: adminId } });
  await ChatModel.findByIdAndUpdate(chatId, {
    $pull: { members: { $in: memberIds.map((id) => new Types.ObjectId(id)) } }
  });
};

export const updateGroupDetails = async (
  chatId: string,
  adminId: string,
  payload: { name?: string; avatarUrl?: string }
) => {
  const adminParticipant = await ensureChatMembership(chatId, adminId);
  if (adminParticipant.role !== "admin") {
    throw createHttpError(403, "Only admins can update group details");
  }

  const chat = await ChatModel.findById(chatId);
  if (!chat || chat.type !== ChatType.GROUP) {
    throw createHttpError(400, "Not a group chat");
  }

  if (payload.name) chat.groupName = payload.name;
  if (payload.avatarUrl !== undefined) chat.groupAvatarUrl = payload.avatarUrl;

  await chat.save();
};

export const makeAdmin = async (chatId: string, adminId: string, memberId: string) => {
  const adminParticipant = await ensureChatMembership(chatId, adminId);
  if (adminParticipant.role !== "admin") {
    throw createHttpError(403, "Only admins can assign admin role");
  }

  await ChatParticipantModel.updateOne({ chatId, userId: memberId }, { role: "admin" });
};

export const incrementUnreadForParticipants = async (chatId: string, senderId: string) => {
  await ChatParticipantModel.updateMany(
    { chatId, userId: { $ne: senderId } },
    { $inc: { unreadCount: 1 } }
  );
};

export const resetUnreadCount = async (chatId: string, userId: string) => {
  await ChatParticipantModel.updateOne(
    { chatId, userId },
    { unreadCount: 0, lastReadAt: new Date() }
  );
};
