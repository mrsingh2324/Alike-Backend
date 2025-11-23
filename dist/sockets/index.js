import { Server } from "socket.io";
import createHttpError from "http-errors";
import { verifyAccessToken } from "../utils/jwt";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ensureChatMembership } from "../services/chat.service";
import { sendMessage, markMessagesDelivered, markMessagesRead } from "../services/message.service";
import { setUserOnline, setUserOffline, getPresenceAudience } from "../services/presence.service";
import { sendMessageNotification } from "../services/notification.service";
import { ChatModel } from "../models/Chat";
import { UserModel } from "../models/User";
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
    const audience = await getPresenceAudience(userId);
    if (!audience.length)
        return;
    const payload = { userId, isOnline, lastSeen: new Date().toISOString() };
    audience.forEach((targetId) => {
        io.to(`user:${targetId}`).emit("user-presence", payload);
    });
};
export const initSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: env.ALLOWED_ORIGINS?.split(",").filter(Boolean) || true,
            credentials: true
        }
    });
    io.use((socket, next) => {
        const tokenHeader = socket.handshake.headers.authorization?.startsWith("Bearer ")
            ? socket.handshake.headers.authorization.split(" ")[1]
            : undefined;
        const token = socket.handshake.auth?.token ?? tokenHeader;
        if (!token) {
            return next(createHttpError(401, "Authentication token missing"));
        }
        try {
            const payload = verifyAccessToken(token);
            socket.data.userId = payload.sub;
            next();
        }
        catch (error) {
            next(createHttpError(401, error.message));
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
        await setUserOnline(userId);
        await broadcastPresence(io, userId, true);
        socket.on("join-chat", async ({ chatId }) => {
            try {
                await ensureChatMembership(chatId, userId);
                socket.join(`chat:${chatId}`);
                activeChatMap.set(userId, chatId);
                await markMessagesDelivered(chatId, userId);
            }
            catch (error) {
                logger.error({ error }, "join-chat failed");
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
                const message = await sendMessage(payload.chatId, userId, payload.text);
                const populatedMessage = await message.populate("senderId", "name profilePicUrl");
                io.to(`chat:${payload.chatId}`).emit("new-message", populatedMessage);
                const chat = await ChatModel.findById(payload.chatId).lean();
                if (chat) {
                    const recipientIds = chat.members
                        .map((member) => member.toString())
                        .filter((member) => member !== userId && activeChatMap.get(member) !== payload.chatId);
                    if (recipientIds.length) {
                        const sender = await UserModel.findById(userId).lean();
                        if (sender) {
                            await sendMessageNotification(recipientIds, message, chat.type === "group" ? chat.groupName ?? sender.name : sender.name);
                        }
                    }
                }
                callback?.({ success: true, data: populatedMessage });
            }
            catch (error) {
                logger.error({ error }, "send-message failed");
                callback?.({ success: false, error: error.message });
            }
        });
        socket.on("message-delivered", async ({ chatId }) => {
            try {
                await markMessagesDelivered(chatId, userId);
            }
            catch (error) {
                logger.error({ error }, "message-delivered handler failed");
            }
        });
        socket.on("message-read", async ({ chatId }) => {
            try {
                await markMessagesRead(chatId, userId);
            }
            catch (error) {
                logger.error({ error }, "message-read handler failed");
            }
        });
        socket.on("disconnect", async () => {
            removeSocket(userId, socket.id);
            activeChatMap.delete(userId);
            if (!userSockets.has(userId)) {
                await setUserOffline(userId);
                await broadcastPresence(io, userId, false);
            }
        });
    });
    return io;
};
//# sourceMappingURL=index.js.map