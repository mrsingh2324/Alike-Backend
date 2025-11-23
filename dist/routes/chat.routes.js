import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { createSingleChatHandler, createGroupChatHandler, listChatsHandler, getChatHandler, addMembersHandler, removeMembersHandler, makeAdminHandler, updateGroupHandler } from "../controllers/chat.controller";
const router = Router();
router.post("/single", authMiddleware, validateRequest(z.object({
    body: z.object({
        targetUserId: z.string().min(1)
    })
})), createSingleChatHandler);
router.post("/group", authMiddleware, validateRequest(z.object({
    body: z.object({
        name: z.string().min(1),
        memberIds: z.array(z.string()).default([]),
        avatarUrl: z.string().url().optional()
    })
})), createGroupChatHandler);
router.get("/", authMiddleware, listChatsHandler);
router.get("/:chatId", authMiddleware, validateRequest(z.object({
    params: z.object({
        chatId: z.string().min(1)
    })
})), getChatHandler);
router.post("/:chatId/members/add", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) }),
    body: z.object({
        memberIds: z.array(z.string()).min(1)
    })
})), addMembersHandler);
router.post("/:chatId/members/remove", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) }),
    body: z.object({
        memberIds: z.array(z.string()).min(1)
    })
})), removeMembersHandler);
router.post("/:chatId/members/make-admin", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) }),
    body: z.object({
        memberId: z.string().min(1)
    })
})), makeAdminHandler);
router.post("/:chatId/update", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) }),
    body: z.object({
        name: z.string().optional(),
        avatarUrl: z.string().url().optional()
    })
})), updateGroupHandler);
export default router;
//# sourceMappingURL=chat.routes.js.map