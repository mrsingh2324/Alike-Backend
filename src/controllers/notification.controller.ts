import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { registerDeviceToken, unregisterDeviceToken } from "../services/notification.service";

export const registerTokenHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token, platform } = req.body;
  await registerDeviceToken(req.userId!, token, platform);
  res.json({ success: true });
});

export const unregisterTokenHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  await unregisterDeviceToken(token);
  res.json({ success: true });
});
