import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  syncContactsHandler,
  getContactsHandler,
  blockUserHandler,
  unblockUserHandler,
  getBlockedUsersHandler
} from "../controllers/contact.controller";

const router = Router();

router.post(
  "/sync",
  authMiddleware,
  validateRequest(
    z.object({
      body: z.object({
        contacts: z
          .array(
            z.object({
              phone: z.string().optional(),
              email: z.string().email().optional(),
              name: z.string().optional()
            })
          )
          .default([])
      })
    })
  ),
  syncContactsHandler
);

router.get("/", authMiddleware, getContactsHandler);

router.post(
  "/block",
  authMiddleware,
  validateRequest(
    z.object({
      body: z.object({
        userId: z.string().min(1)
      })
    })
  ),
  blockUserHandler
);

router.post(
  "/unblock",
  authMiddleware,
  validateRequest(
    z.object({
      body: z.object({
        userId: z.string().min(1)
      })
    })
  ),
  unblockUserHandler
);

router.get("/blocked", authMiddleware, getBlockedUsersHandler);

export default router;
