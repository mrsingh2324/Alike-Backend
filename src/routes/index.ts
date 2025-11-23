import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import contactRoutes from "./contact.routes";
import chatRoutes from "./chat.routes";
import messageRoutes from "./message.routes";
import notificationRoutes from "./notification.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/contacts", contactRoutes);
router.use("/chats", chatRoutes);
router.use("/chats/:chatId/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/upload", uploadRoutes);

export default router;
