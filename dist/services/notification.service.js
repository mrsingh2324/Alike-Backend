"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageNotification = exports.unregisterDeviceToken = exports.registerDeviceToken = void 0;
const DeviceToken_1 = require("../models/DeviceToken");
const firebase_1 = require("../config/firebase");
const logger_1 = require("../config/logger");
const registerDeviceToken = async (userId, token, platform) => {
    await DeviceToken_1.DeviceTokenModel.updateOne({ token }, { userId, token, platform }, { upsert: true });
};
exports.registerDeviceToken = registerDeviceToken;
const unregisterDeviceToken = async (token) => {
    await DeviceToken_1.DeviceTokenModel.deleteOne({ token });
};
exports.unregisterDeviceToken = unregisterDeviceToken;
const sendMessageNotification = async (recipientIds, message, senderName) => {
    const app = (0, firebase_1.getFirebaseApp)();
    if (!app) {
        logger_1.logger.warn("FCM not configured; skipping push notification");
        return;
    }
    const tokens = await DeviceToken_1.DeviceTokenModel.find({ userId: { $in: recipientIds } }, { token: 1 }).lean();
    if (!tokens.length)
        return;
    const messaging = app.messaging();
    const payload = {
        notification: {
            title: senderName,
            body: message.text.length > 120 ? `${message.text.slice(0, 117)}...` : message.text
        },
        data: {
            chatId: message.chatId.toString(),
            messageId: (message._id || message.id).toString()
        }
    };
    const chunks = Array.from({ length: Math.ceil(tokens.length / 500) }, (_v, i) => tokens.slice(i * 500, i * 500 + 500));
    await Promise.all(chunks.map((chunk) => messaging
        .sendMulticast({ ...payload, tokens: chunk.map((c) => c.token) })
        .catch((error) => logger_1.logger.error({ error }, "FCM send failed"))));
};
exports.sendMessageNotification = sendMessageNotification;
//# sourceMappingURL=notification.service.js.map