import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { registerTokenHandler, unregisterTokenHandler } from "../controllers/notification.controller";
const router = Router();
router.post("/register-token", authMiddleware, validateRequest(z.object({
    body: z.object({
        token: z.string().min(10),
        platform: z.enum(["web", "android", "ios"])
    })
})), registerTokenHandler);
router.post("/unregister-token", authMiddleware, validateRequest(z.object({
    body: z.object({
        token: z.string().min(10)
    })
})), unregisterTokenHandler);
export default router;
//# sourceMappingURL=notification.routes.js.map