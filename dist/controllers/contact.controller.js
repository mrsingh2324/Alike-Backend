import { asyncHandler } from "../utils/asyncHandler";
import { syncContacts, getContacts, blockUser, unblockUser, getBlockedUsers } from "../services/contact.service";
export const syncContactsHandler = asyncHandler(async (req, res) => {
    const contacts = await syncContacts(req.userId, req.body.contacts ?? []);
    res.json({ success: true, data: contacts });
});
export const getContactsHandler = asyncHandler(async (req, res) => {
    const contacts = await getContacts(req.userId);
    res.json({ success: true, data: contacts });
});
export const blockUserHandler = asyncHandler(async (req, res) => {
    await blockUser(req.userId, req.body.userId);
    res.json({ success: true });
});
export const unblockUserHandler = asyncHandler(async (req, res) => {
    await unblockUser(req.userId, req.body.userId);
    res.json({ success: true });
});
export const getBlockedUsersHandler = asyncHandler(async (req, res) => {
    const blocked = await getBlockedUsers(req.userId);
    res.json({ success: true, data: blocked });
});
