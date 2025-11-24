"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroupHandler = exports.makeAdminHandler = exports.removeMembersHandler = exports.addMembersHandler = exports.getChatHandler = exports.listChatsHandler = exports.createGroupChatHandler = exports.createSingleChatHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const chat_service_1 = require("../services/chat.service");
exports.createSingleChatHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const chat = await (0, chat_service_1.createOrGetSingleChat)(req.userId, req.body.targetUserId);
    res.json({ success: true, data: chat });
});
exports.createGroupChatHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const chat = await (0, chat_service_1.createGroupChat)(req.userId, {
        name: req.body.name,
        memberIds: req.body.memberIds ?? [],
        avatarUrl: req.body.avatarUrl
    });
    res.json({ success: true, data: chat });
});
exports.listChatsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const chats = await (0, chat_service_1.listChats)(req.userId);
    res.json({ success: true, data: chats });
});
exports.getChatHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    const chat = await (0, chat_service_1.getChatDetails)(chatId, req.userId);
    res.json({ success: true, data: chat });
});
exports.addMembersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    await (0, chat_service_1.addMembers)(chatId, req.userId, req.body.memberIds ?? []);
    res.json({ success: true });
});
exports.removeMembersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    await (0, chat_service_1.removeMembers)(chatId, req.userId, req.body.memberIds ?? []);
    res.json({ success: true });
});
exports.makeAdminHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    await (0, chat_service_1.makeAdmin)(chatId, req.userId, req.body.memberId);
    res.json({ success: true });
});
exports.updateGroupHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    await (0, chat_service_1.updateGroupDetails)(chatId, req.userId, {
        name: req.body.name,
        avatarUrl: req.body.avatarUrl
    });
    res.json({ success: true });
});
//# sourceMappingURL=chat.controller.js.map