import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createOrGetSingleChat,
  createGroupChat,
  listChats,
  getChatDetails,
  addMembers,
  removeMembers,
  makeAdmin,
  updateGroupDetails
} from "../services/chat.service";

export const createSingleChatHandler = asyncHandler(async (req: Request, res: Response) => {
  const chat = await createOrGetSingleChat(req.userId!, req.body.targetUserId);
  res.json({ success: true, data: chat });
});

export const createGroupChatHandler = asyncHandler(async (req: Request, res: Response) => {
  const chat = await createGroupChat(req.userId!, {
    name: req.body.name,
    memberIds: req.body.memberIds ?? [],
    avatarUrl: req.body.avatarUrl
  });
  res.json({ success: true, data: chat });
});

export const listChatsHandler = asyncHandler(async (req: Request, res: Response) => {
  const chats = await listChats(req.userId!);
  res.json({ success: true, data: chats });
});

export const getChatHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  const chat = await getChatDetails(chatId, req.userId!);
  res.json({ success: true, data: chat });
});

export const addMembersHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  await addMembers(chatId, req.userId!, req.body.memberIds ?? []);
  res.json({ success: true });
});

export const removeMembersHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  await removeMembers(chatId, req.userId!, req.body.memberIds ?? []);
  res.json({ success: true });
});

export const makeAdminHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  await makeAdmin(chatId, req.userId!, req.body.memberId);
  res.json({ success: true });
});

export const updateGroupHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  await updateGroupDetails(chatId, req.userId!, {
    name: req.body.name,
    avatarUrl: req.body.avatarUrl
  });
  res.json({ success: true });
});
