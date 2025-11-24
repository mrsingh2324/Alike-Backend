"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReadHandler = exports.markDeliveredHandler = exports.sendMessageHandler = exports.listMessagesHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const message_service_1 = require("../services/message.service");
exports.listMessagesHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    const messages = await (0, message_service_1.getMessages)(chatId, req.userId, {
        before: req.query.before,
        limit: req.query.limit ? Number(req.query.limit) : undefined
    });
    res.json({ success: true, data: messages });
});
exports.sendMessageHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    const message = await (0, message_service_1.sendMessage)(chatId, req.userId, req.body.text);
    res.json({ success: true, data: message });
});
exports.markDeliveredHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    await (0, message_service_1.markMessagesDelivered)(chatId, req.userId);
    res.json({ success: true });
});
exports.markReadHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { chatId } = req.params;
    await (0, message_service_1.markMessagesRead)(chatId, req.userId);
    res.json({ success: true });
});
//# sourceMappingURL=message.controller.js.map