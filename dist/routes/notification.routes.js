"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
router.post("/register-token", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(10),
        platform: zod_1.z.enum(["web", "android", "ios"])
    })
})), notification_controller_1.registerTokenHandler);
router.post("/unregister-token", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(10)
    })
})), notification_controller_1.unregisterTokenHandler);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map