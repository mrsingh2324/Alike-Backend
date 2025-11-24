"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const message_controller_1 = require("../controllers/message.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) }),
    query: zod_1.z.object({
        before: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().optional()
    })
})), message_controller_1.listMessagesHandler);
router.post("/", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) }),
    body: zod_1.z.object({ text: zod_1.z.string().min(1) })
})), message_controller_1.sendMessageHandler);
router.post("/delivered", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) })
})), message_controller_1.markDeliveredHandler);
router.post("/read", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({ chatId: zod_1.z.string().min(1) })
})), message_controller_1.markReadHandler);
exports.default = router;
//# sourceMappingURL=message.routes.js.map