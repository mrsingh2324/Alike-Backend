"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const chat_service_1 = require("../services/chat.service");
const message_service_1 = require("../services/message.service");
const presence_service_1 = require("../services/presence.service");
const notification_service_1 = require("../services/notification.service");
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const userSockets = new Map();
const activeChatMap = new Map();
const addSocket = (userId, socketId) => {
    const sockets = userSockets.get(userId) ?? new Set();
    sockets.add(socketId);
    userSockets.set(userId, sockets);
};
const removeSocket = (userId, socketId) => {
    const sockets = userSockets.get(userId);
    if (!sockets)
        return;
    sockets.delete(socketId);
    if (!sockets.size) {
        userSockets.delete(userId);
    }
};
const broadcastPresence = async (io, userId, isOnline) => {
    const audience = await (0, presence_service_1.getPresenceAudience)(userId);
    if (!audience.length)
        return;
    const payload = { userId, isOnline, lastSeen: new Date().toISOString() };
    audience.forEach((targetId) => {
        io.to(`user:${targetId}`).emit("user-presence", payload);
    });
};
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: env_1.env.ALLOWED_ORIGINS?.split(",").filter(Boolean) || true,
            credentials: true
        }
    });
    io.use((socket, next) => {
        const tokenHeader = socket.handshake.headers.authorization?.startsWith("Bearer ")
            ? socket.handshake.headers.authorization.split(" ")[1]
            : undefined;
        const token = socket.handshake.auth?.token ?? tokenHeader;
        if (!token) {
            return next((0, http_errors_1.default)(401, "Authentication token missing"));
        }
        try {
            const payload = (0, jwt_1.verifyAccessToken)(token);
            socket.data.userId = payload.sub;
            next();
        }
        catch (error) {
            next((0, http_errors_1.default)(401, error.message));
        }
    });
    io.on("connection", async (socket) => {
        const userId = socket.data.userId;
        if (!userId) {
            socket.disconnect();
            return;
        }
        addSocket(userId, socket.id);
        socket.join(`user:${userId}`);
        await (0, presence_service_1.setUserOnline)(userId);
        await broadcastPresence(io, userId, true);
        socket.on("join-chat", async ({ chatId }) => {
            try {
                await (0, chat_service_1.ensureChatMembership)(chatId, userId);
                socket.join(`chat:${chatId}`);
                activeChatMap.set(userId, chatId);
                await (0, message_service_1.markMessagesDelivered)(chatId, userId);
            }
            catch (error) {
                logger_1.logger.error({ error }, "join-chat failed");
            }
        });
        socket.on("leave-chat", ({ chatId }) => {
            socket.leave(`chat:${chatId}`);
            if (activeChatMap.get(userId) === chatId) {
                activeChatMap.delete(userId);
            }
        });
        socket.on("send-message", async (payload, callback) => {
            try {
                const message = await (0, message_service_1.sendMessage)(payload.chatId, userId, payload.text);
                const populatedMessage = await message.populate("senderId", "name profilePicUrl");
                io.to(`chat:${payload.chatId}`).emit("new-message", populatedMessage);
                const chat = await Chat_1.ChatModel.findById(payload.chatId).lean();
                if (chat) {
                    const recipientIds = chat.members
                        .map((member) => member.toString())
                        .filter((member) => member !== userId && activeChatMap.get(member) !== payload.chatId);
                    if (recipientIds.length) {
                        const sender = await User_1.UserModel.findById(userId).lean();
                        if (sender) {
                            await (0, notification_service_1.sendMessageNotification)(recipientIds, message, chat.type === "group" ? chat.groupName ?? sender.name : sender.name);
                        }
                    }
                }
                callback?.({ success: true, data: populatedMessage });
            }
            catch (error) {
                logger_1.logger.error({ error }, "send-message failed");
                callback?.({ success: false, error: error.message });
            }
        });
        socket.on("message-delivered", async ({ chatId }) => {
            try {
                await (0, message_service_1.markMessagesDelivered)(chatId, userId);
            }
            catch (error) {
                logger_1.logger.error({ error }, "message-delivered handler failed");
            }
        });
        socket.on("message-read", async ({ chatId }) => {
            try {
                await (0, message_service_1.markMessagesRead)(chatId, userId);
            }
            catch (error) {
                logger_1.logger.error({ error }, "message-read handler failed");
            }
        });
        socket.on("disconnect", async () => {
            removeSocket(userId, socket.id);
            activeChatMap.delete(userId);
            if (!userSockets.has(userId)) {
                await (0, presence_service_1.setUserOffline)(userId);
                await broadcastPresence(io, userId, false);
            }
        });
    });
    return io;
};
exports.initSocketServer = initSocketServer;
//# sourceMappingURL=index.js.map