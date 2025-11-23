import { Router } from "express";
import { z } from "zod";
import {
  requestEmailOtpHandler,
  requestPhoneOtpHandler,
  verifyEmailOtpHandler,
  verifyPhoneOtpHandler,
  getCurrentUserHandler
} from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/request-otp-email",
  validateRequest(
    z.object({
      body: z.object({
        email: z.string().email()
      })
    })
  ),
  requestEmailOtpHandler
);

router.post(
  "/request-otp-phone",
  validateRequest(
    z.object({
      body: z.object({
        phone: z.string().min(6)
      })
    })
  ),
  requestPhoneOtpHandler
);

router.post(
  "/verify-otp-email",
  validateRequest(
    z.object({
      body: z.object({
        email: z.string().email(),
        otp: z.string().min(4),
        name: z.string().min(2),
        phone: z.string().optional(),
        profilePicUrl: z.string().url().optional()
      })
    })
  ),
  verifyEmailOtpHandler
);

router.post(
  "/verify-otp-phone",
  validateRequest(
    z.object({
      body: z.object({
        phone: z.string().min(6),
        otp: z.string().min(4),
        name: z.string().min(2),
        email: z.string().email().optional(),
        profilePicUrl: z.string().url().optional()
      })
    })
  ),
  verifyPhoneOtpHandler
);

router.get("/me", authMiddleware, getCurrentUserHandler);

export default router;
