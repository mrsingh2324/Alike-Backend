"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const authMiddleware = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next((0, http_errors_1.default)(401, "Authorization header missing"));
    }
    try {
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next((0, http_errors_1.default)(401, "Token missing"));
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const user = await User_1.UserModel.findById(payload.sub);
        if (!user) {
            return next((0, http_errors_1.default)(401, "User not found"));
        }
        req.userId = user.id;
        req.authUser = user;
        return next();
    }
    catch (error) {
        return next((0, http_errors_1.default)(401, error.message));
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map