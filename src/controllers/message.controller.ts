import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getMessages, sendMessage, markMessagesDelivered, markMessagesRead } from "../services/message.service";

export const listMessagesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  const messages = await getMessages(chatId, req.userId!, {
    before: req.query.before as string | undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined
  });
  res.json({ success: true, data: messages });
});

export const sendMessageHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  const message = await sendMessage(chatId, req.userId!, req.body.text);
  res.json({ success: true, data: message });
});

export const markDeliveredHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  await markMessagesDelivered(chatId, req.userId!);
  res.json({ success: true });
});

export const markReadHandler = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  await markMessagesRead(chatId, req.userId!);
  res.json({ success: true });
});
