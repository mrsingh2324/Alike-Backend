import createHttpError from "http-errors";
import { UserModel } from "../models/User";
import crypto from 'crypto';
// import type { UpdateProfilePayload } from "@alike/shared";

// Local type definitions
interface UpdateProfilePayload {
  name?: string;
  profilePicUrl?: string;
  about?: string;
  phone?: string;
}

export const generateUniqueId = (): string => {
  // Generate a 8-character unique ID
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const createOrUpdateUser = async (userData: {
  phone?: string;
  email?: string;
  name: string;
  profilePicUrl?: string;
  about?: string;
}) => {
  // Check if user exists by phone or email
  let user = await UserModel.findOne({
    $or: [
      ...(userData.phone ? [{ phone: userData.phone }] : []),
      ...(userData.email ? [{ email: userData.email }] : [])
    ]
  });

  if (user) {
    // Update existing user
    if (userData.name) user.name = userData.name;
    if (userData.profilePicUrl) user.profilePicUrl = userData.profilePicUrl;
    if (userData.about !== undefined) user.about = userData.about;
    
    // Generate unique ID if not present
    if (!user.uniqueId) {
      let uniqueId: string;
      do {
        uniqueId = generateUniqueId();
      } while (await UserModel.findOne({ uniqueId }));
      user.uniqueId = uniqueId;
    }
    
    await user.save();
  } else {
    // Create new user with unique ID
    let uniqueId: string;
    do {
      uniqueId = generateUniqueId();
    } while (await UserModel.findOne({ uniqueId }));
    
    user = new UserModel({
      ...userData,
      uniqueId,
      about: userData.about || "Hey there! I am using Alike."
    });
    await user.save();
  }

  return user;
};

export const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  return user;
};

export const updateProfile = async (userId: string, payload: UpdateProfilePayload) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  if (payload.name) user.name = payload.name;
  if (payload.about !== undefined) user.about = payload.about;
  if (payload.profilePicUrl) user.profilePicUrl = payload.profilePicUrl;
  if (payload.phone !== undefined) {
    const trimmedPhone = payload.phone.trim();
    if (!trimmedPhone) {
      user.phone = undefined;
    } else {
      const normalizedPhone = normalizePhoneNumber(trimmedPhone);
      const existingUser = await UserModel.findOne({ phone: normalizedPhone, _id: { $ne: userId } });
      if (existingUser) {
        throw createHttpError(409, "Phone number already in use");
      }
      user.phone = normalizedPhone;
    }
  }

  await user.save();
  return user;
};

export const getPublicProfile = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return {
    id: user.id,
    uniqueId: user.uniqueId,
    name: user.name,
    profilePicUrl: user.profilePicUrl,
    about: user.about,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen,
    phone: user.phone,
    email: user.email
  };
};

export const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  let normalized = phone.replace(/\D/g, '');
  
  // If starts with 0 and has 10 digits, assume local format (remove leading 0)
  if (normalized.startsWith('0') && normalized.length === 10) {
    normalized = normalized.substring(1);
  }
  
  // If no country code and has 10 digits, add default country code (e.g., +91 for India)
  if (normalized.length === 10) {
    normalized = '91' + normalized;
  }
  
  // Add + prefix if not present
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }
  
  return normalized;
};

export const searchUserByUniqueId = async (uniqueId: string) => {
  // Normalize unique ID (uppercase, no spaces, remove non-alphanumeric)
  const normalizedId = uniqueId
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
  const user = await UserModel.findOne({ uniqueId: normalizedId });
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    uniqueId: user.uniqueId,
    name: user.name,
    profilePicUrl: user.profilePicUrl,
    about: user.about,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen,
    phone: user.phone,
    email: user.email
  };
};

export const searchUserByPhone = async (phone: string) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const user = await UserModel.findOne({ phone: normalizedPhone });
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    uniqueId: user.uniqueId,
    name: user.name,
    profilePicUrl: user.profilePicUrl,
    about: user.about,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen,
    phone: user.phone,
    email: user.email
  };
};
