import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { listMessagesHandler, sendMessageHandler, markDeliveredHandler, markReadHandler } from "../controllers/message.controller";
const router = Router({ mergeParams: true });
router.get("/", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) }),
    query: z.object({
        before: z.string().optional(),
        limit: z.coerce.number().optional()
    })
})), listMessagesHandler);
router.post("/", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) }),
    body: z.object({ text: z.string().min(1) })
})), sendMessageHandler);
router.post("/delivered", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) })
})), markDeliveredHandler);
router.post("/read", authMiddleware, validateRequest(z.object({
    params: z.object({ chatId: z.string().min(1) })
})), markReadHandler);
export default router;
//# sourceMappingURL=message.routes.js.map