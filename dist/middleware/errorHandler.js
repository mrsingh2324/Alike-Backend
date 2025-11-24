"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const logger_1 = require("../config/logger");
const errorHandler = (err, _req, res, _next) => {
    const error = http_errors_1.default.isHttpError(err)
        ? err
        : (0, http_errors_1.default)(500, err?.message || "Internal Server Error");
    if (error.status >= 500) {
        logger_1.logger.error({ err }, "Unhandled server error");
    }
    return res.status(error.status).json({
        success: false,
        message: error.message
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map