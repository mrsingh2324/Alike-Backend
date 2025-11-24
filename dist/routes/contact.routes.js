"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const contact_controller_1 = require("../controllers/contact.controller");
const router = (0, express_1.Router)();
router.post("/sync", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        contacts: zod_1.z
            .array(zod_1.z.object({
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            name: zod_1.z.string().optional()
        }))
            .default([])
    })
})), contact_controller_1.syncContactsHandler);
router.get("/", authMiddleware_1.authMiddleware, contact_controller_1.getContactsHandler);
router.post("/block", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1)
    })
})), contact_controller_1.blockUserHandler);
router.post("/unblock", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1)
    })
})), contact_controller_1.unblockUserHandler);
router.get("/blocked", authMiddleware_1.authMiddleware, contact_controller_1.getBlockedUsersHandler);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map