"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/me", authMiddleware_1.authMiddleware, user_controller_1.getMeHandler);
router.patch("/me", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        about: zod_1.z.string().max(256).optional(),
        profilePicUrl: zod_1.z.string().url().optional(),
        phone: zod_1.z.string().min(6).max(20).optional()
    })
})), user_controller_1.updateMeHandler);
router.get("/search", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    query: zod_1.z.object({
        phone: zod_1.z.string().min(10).optional(),
        uniqueId: zod_1.z.string().min(4).optional()
    }).refine((data) => data.phone || data.uniqueId, { message: "Either phone or uniqueId must be provided" })
})), (req, res, next) => {
    const { phone, uniqueId } = req.query;
    if (phone) {
        return (0, user_controller_1.searchUserByPhoneHandler)(req, res, next);
    }
    else if (uniqueId) {
        return (0, user_controller_1.searchUserByUniqueIdHandler)(req, res, next);
    }
});
router.get("/:userId", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1)
    })
})), user_controller_1.getUserByIdHandler);
exports.default = router;
//# sourceMappingURL=user.routes.js.map