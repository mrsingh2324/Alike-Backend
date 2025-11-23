import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getProfile, updateProfile, getPublicProfile, searchUserByPhone, searchUserByUniqueId } from "../services/user.service";

export const getMeHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await getProfile(req.userId!);
  res.json({ success: true, data: user });
});

export const updateMeHandler = asyncHandler(async (req: Request, res: Response) => {
  const updated = await updateProfile(req.userId!, req.body);
  res.json({ success: true, data: updated });
});

export const getUserByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const user = await getPublicProfile(userId);
  res.json({ success: true, data: user });
});

export const searchUserByUniqueIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { uniqueId } = req.query as { uniqueId: string };
  const user = await searchUserByUniqueId(uniqueId);
  
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  
  res.json({ success: true, data: user });
});

export const searchUserByPhoneHandler = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.query as { phone: string };
  const user = await searchUserByPhone(phone);
  
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  
  res.json({ success: true, data: user });
});
