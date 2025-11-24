"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockedUsers = exports.unblockUser = exports.blockUser = exports.getContacts = exports.syncContacts = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Contact_1 = require("../models/Contact");
const User_1 = require("../models/User");
const BlockedUser_1 = require("../models/BlockedUser");
const syncContacts = async (ownerUserId, contacts) => {
    const phones = contacts.map((c) => c.phone?.trim()).filter(Boolean);
    const emails = contacts.map((c) => c.email?.toLowerCase().trim()).filter(Boolean);
    const query = [];
    if (phones.length)
        query.push({ phone: { $in: phones } });
    if (emails.length)
        query.push({ email: { $in: emails } });
    const matches = query.length ? await User_1.UserModel.find({ $or: query }) : [];
    await Promise.all(matches.map((user) => Contact_1.ContactModel.updateOne({ ownerUserId, contactUserId: user.id }, { ownerUserId, contactUserId: user.id }, { upsert: true })));
    return matches.map((user) => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
        about: user.about,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        isRegistered: true
    }));
};
exports.syncContacts = syncContacts;
const getContacts = async (ownerUserId) => {
    const contacts = await Contact_1.ContactModel.find({ ownerUserId }).populate("contactUserId");
    return contacts
        .map((contact) => contact.contactUserId)
        .filter((user) => Boolean(user))
        .map((user) => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
        about: user.about,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen
    }));
};
exports.getContacts = getContacts;
const blockUser = async (userId, blockedUserId) => {
    if (userId === blockedUserId) {
        throw (0, http_errors_1.default)(400, "Cannot block yourself");
    }
    await BlockedUser_1.BlockedUserModel.updateOne({ userId, blockedUserId }, { userId, blockedUserId }, { upsert: true });
};
exports.blockUser = blockUser;
const unblockUser = async (userId, blockedUserId) => {
    await BlockedUser_1.BlockedUserModel.deleteOne({ userId, blockedUserId });
};
exports.unblockUser = unblockUser;
const getBlockedUsers = async (userId) => {
    const records = await BlockedUser_1.BlockedUserModel.find({ userId }).populate("blockedUserId");
    return records
        .map((record) => {
        const user = record.blockedUserId;
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            about: user.about,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            blockedAt: record.createdAt
        };
    })
        .filter(Boolean);
};
exports.getBlockedUsers = getBlockedUsers;
//# sourceMappingURL=contact.service.js.map