"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserByPhone = exports.searchUserByUniqueId = exports.normalizePhoneNumber = exports.getPublicProfile = exports.updateProfile = exports.getProfile = exports.createOrUpdateUser = exports.generateUniqueId = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = require("../models/User");
const crypto_1 = __importDefault(require("crypto"));
const generateUniqueId = () => {
    // Generate a 8-character unique ID
    return crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
};
exports.generateUniqueId = generateUniqueId;
const createOrUpdateUser = async (userData) => {
    // Check if user exists by phone or email
    let user = await User_1.UserModel.findOne({
        $or: [
            ...(userData.phone ? [{ phone: userData.phone }] : []),
            ...(userData.email ? [{ email: userData.email }] : [])
        ]
    });
    if (user) {
        // Update existing user
        if (userData.name)
            user.name = userData.name;
        if (userData.profilePicUrl)
            user.profilePicUrl = userData.profilePicUrl;
        if (userData.about !== undefined)
            user.about = userData.about;
        // Generate unique ID if not present
        if (!user.uniqueId) {
            let uniqueId;
            do {
                uniqueId = (0, exports.generateUniqueId)();
            } while (await User_1.UserModel.findOne({ uniqueId }));
            user.uniqueId = uniqueId;
        }
        await user.save();
    }
    else {
        // Create new user with unique ID
        let uniqueId;
        do {
            uniqueId = (0, exports.generateUniqueId)();
        } while (await User_1.UserModel.findOne({ uniqueId }));
        user = new User_1.UserModel({
            ...userData,
            uniqueId,
            about: userData.about || "Hey there! I am using Alike."
        });
        await user.save();
    }
    return user;
};
exports.createOrUpdateUser = createOrUpdateUser;
const getProfile = async (userId) => {
    const user = await User_1.UserModel.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    return user;
};
exports.getProfile = getProfile;
const updateProfile = async (userId, payload) => {
    const user = await User_1.UserModel.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    if (payload.name)
        user.name = payload.name;
    if (payload.about !== undefined)
        user.about = payload.about;
    if (payload.profilePicUrl)
        user.profilePicUrl = payload.profilePicUrl;
    if (payload.phone !== undefined) {
        const trimmedPhone = payload.phone.trim();
        if (!trimmedPhone) {
            user.phone = undefined;
        }
        else {
            const normalizedPhone = (0, exports.normalizePhoneNumber)(trimmedPhone);
            const existingUser = await User_1.UserModel.findOne({ phone: normalizedPhone, _id: { $ne: userId } });
            if (existingUser) {
                throw (0, http_errors_1.default)(409, "Phone number already in use");
            }
            user.phone = normalizedPhone;
        }
    }
    await user.save();
    return user;
};
exports.updateProfile = updateProfile;
const getPublicProfile = async (userId) => {
    const user = await User_1.UserModel.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
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
exports.getPublicProfile = getPublicProfile;
const normalizePhoneNumber = (phone) => {
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
exports.normalizePhoneNumber = normalizePhoneNumber;
const searchUserByUniqueId = async (uniqueId) => {
    // Normalize unique ID (uppercase, no spaces, remove non-alphanumeric)
    const normalizedId = uniqueId
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
    const user = await User_1.UserModel.findOne({ uniqueId: normalizedId });
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
exports.searchUserByUniqueId = searchUserByUniqueId;
const searchUserByPhone = async (phone) => {
    const normalizedPhone = (0, exports.normalizePhoneNumber)(phone);
    const user = await User_1.UserModel.findOne({ phone: normalizedPhone });
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
exports.searchUserByPhone = searchUserByPhone;
//# sourceMappingURL=user.service.js.map