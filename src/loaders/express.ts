import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import routes from "../routes";
import { errorHandler } from "../middleware/errorHandler";
import { env } from "../config/env";

export const createExpressApp = () => {
  const app = express();

  const allowedOrigins = env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins && allowedOrigins.length ? allowedOrigins : undefined,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authLimiter);
  app.use("/api", routes);

  app.use(errorHandler);

  return app;
};
