"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.post("/single", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        targetUserId: zod_1.z.string().min(1)
    })
})), chat_controller_1.createSingleChatHandler);
router.post("/group", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        memberIds: zod_1.z.array(zod_1.z.string()).default([]),
        avatarUrl: zod_1.z.string().url().optional()
    })
})), chat_controller_1.createGroupChatHandler);
router.get("/", authMiddleware_1.authMiddleware, chat_controller_1.listChatsHandler);
router.get("/:chatId", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({
        chatId: zod_1.z.string().min(1)
    })
})), chat_controller_1.getChatHandler);
router.post("/:chatId/members/add", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        memberIds: zod_1.z.array(zod_1.z.string()).min(1)
    })
})), chat_controller_1.addMembersHandler);
router.post("/:chatId/members/remove", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        memberIds: zod_1.z.array(zod_1.z.string()).min(1)
    })
})), chat_controller_1.removeMembersHandler);
router.post("/:chatId/members/make-admin", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        memberId: zod_1.z.string().min(1)
    })
})), chat_controller_1.makeAdminHandler);
router.post("/:chatId/update", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        avatarUrl: zod_1.z.string().url().optional()
    })
})), chat_controller_1.updateGroupHandler);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map