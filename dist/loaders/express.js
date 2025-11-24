"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressApp = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("../routes"));
const errorHandler_1 = require("../middleware/errorHandler");
const env_1 = require("../config/env");
const createExpressApp = () => {
    const app = (0, express_1.default)();
    const allowedOrigins = env_1.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean);
    app.use((0, cors_1.default)({
        origin: allowedOrigins && allowedOrigins.length ? allowedOrigins : undefined,
        credentials: true
    }));
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false
    });
    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });
    app.use("/api/auth", authLimiter);
    app.use("/api", routes_1.default);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createExpressApp = createExpressApp;
//# sourceMappingURL=express.js.map