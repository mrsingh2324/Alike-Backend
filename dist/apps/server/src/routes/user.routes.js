import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { getMeHandler, getUserByIdHandler, updateMeHandler, searchUserByPhoneHandler, searchUserByUniqueIdHandler } from "../controllers/user.controller";
const router = Router();
router.get("/me", authMiddleware, getMeHandler);
router.patch("/me", authMiddleware, validateRequest(z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        about: z.string().max(256).optional(),
        profilePicUrl: z.string().url().optional(),
        phone: z.string().min(6).max(20).optional()
    })
})), updateMeHandler);
router.get("/search", authMiddleware, validateRequest(z.object({
    query: z.object({
        phone: z.string().min(10).optional(),
        uniqueId: z.string().min(4).optional()
    }).refine((data) => data.phone || data.uniqueId, { message: "Either phone or uniqueId must be provided" })
})), (req, res, next) => {
    const { phone, uniqueId } = req.query;
    if (phone) {
        return searchUserByPhoneHandler(req, res, next);
    }
    else if (uniqueId) {
        return searchUserByUniqueIdHandler(req, res, next);
    }
});
router.get("/:userId", authMiddleware, validateRequest(z.object({
    params: z.object({
        userId: z.string().min(1)
    })
})), getUserByIdHandler);
export default router;
