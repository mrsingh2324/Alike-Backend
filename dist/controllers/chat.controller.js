import { asyncHandler } from "../utils/asyncHandler";
import { createOrGetSingleChat, createGroupChat, listChats, getChatDetails, addMembers, removeMembers, makeAdmin, updateGroupDetails } from "../services/chat.service";
export const createSingleChatHandler = asyncHandler(async (req, res) => {
    const chat = await createOrGetSingleChat(req.userId, req.body.targetUserId);
    res.json({ success: true, data: chat });
});
export const createGroupChatHandler = asyncHandler(async (req, res) => {
    const chat = await createGroupChat(req.userId, {
        name: req.body.name,
        memberIds: req.body.memberIds ?? [],
        avatarUrl: req.body.avatarUrl
    });
    res.json({ success: true, data: chat });
});
export const listChatsHandler = asyncHandler(async (req, res) => {
    const chats = await listChats(req.userId);
    res.json({ success: true, data: chats });
});
export const getChatHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await getChatDetails(chatId, req.userId);
    res.json({ success: true, data: chat });
});
export const addMembersHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    await addMembers(chatId, req.userId, req.body.memberIds ?? []);
    res.json({ success: true });
});
export const removeMembersHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    await removeMembers(chatId, req.userId, req.body.memberIds ?? []);
    res.json({ success: true });
});
export const makeAdminHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    await makeAdmin(chatId, req.userId, req.body.memberId);
    res.json({ success: true });
});
export const updateGroupHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    await updateGroupDetails(chatId, req.userId, {
        name: req.body.name,
        avatarUrl: req.body.avatarUrl
    });
    res.json({ success: true });
});
//# sourceMappingURL=chat.controller.js.map