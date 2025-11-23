import createHttpError from "http-errors";
import { ContactModel } from "../models/Contact";
import { UserModel } from "../models/User";
import { BlockedUserModel } from "../models/BlockedUser";
export const syncContacts = async (ownerUserId, contacts) => {
    const phones = contacts.map((c) => c.phone?.trim()).filter(Boolean);
    const emails = contacts.map((c) => c.email?.toLowerCase().trim()).filter(Boolean);
    const query = [];
    if (phones.length)
        query.push({ phone: { $in: phones } });
    if (emails.length)
        query.push({ email: { $in: emails } });
    const matches = query.length ? await UserModel.find({ $or: query }) : [];
    await Promise.all(matches.map((user) => ContactModel.updateOne({ ownerUserId, contactUserId: user.id }, { ownerUserId, contactUserId: user.id }, { upsert: true })));
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
export const getContacts = async (ownerUserId) => {
    const contacts = await ContactModel.find({ ownerUserId }).populate("contactUserId");
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
export const blockUser = async (userId, blockedUserId) => {
    if (userId === blockedUserId) {
        throw createHttpError(400, "Cannot block yourself");
    }
    await BlockedUserModel.updateOne({ userId, blockedUserId }, { userId, blockedUserId }, { upsert: true });
};
export const unblockUser = async (userId, blockedUserId) => {
    await BlockedUserModel.deleteOne({ userId, blockedUserId });
};
export const getBlockedUsers = async (userId) => {
    const records = await BlockedUserModel.find({ userId }).populate("blockedUserId");
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
