"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/request-otp-email", (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email()
    })
})), auth_controller_1.requestEmailOtpHandler);
router.post("/request-otp-phone", (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string().min(6)
    })
})), auth_controller_1.requestPhoneOtpHandler);
router.post("/verify-otp-email", (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        otp: zod_1.z.string().min(4),
        name: zod_1.z.string().min(2),
        phone: zod_1.z.string().optional(),
        profilePicUrl: zod_1.z.string().url().optional()
    })
})), auth_controller_1.verifyEmailOtpHandler);
router.post("/verify-otp-phone", (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string().min(6),
        otp: zod_1.z.string().min(4),
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email().optional(),
        profilePicUrl: zod_1.z.string().url().optional()
    })
})), auth_controller_1.verifyPhoneOtpHandler);
router.get("/me", authMiddleware_1.authMiddleware, auth_controller_1.getCurrentUserHandler);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map