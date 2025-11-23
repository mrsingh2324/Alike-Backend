import { asyncHandler } from "../utils/asyncHandler";
import { getMessages, sendMessage, markMessagesDelivered, markMessagesRead } from "../services/message.service";
export const listMessagesHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await getMessages(chatId, req.userId, {
        before: req.query.before,
        limit: req.query.limit ? Number(req.query.limit) : undefined
    });
    res.json({ success: true, data: messages });
});
export const sendMessageHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const message = await sendMessage(chatId, req.userId, req.body.text);
    res.json({ success: true, data: message });
});
export const markDeliveredHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    await markMessagesDelivered(chatId, req.userId);
    res.json({ success: true });
});
export const markReadHandler = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    await markMessagesRead(chatId, req.userId);
    res.json({ success: true });
});
//# sourceMappingURL=message.controller.js.map