"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const validateRequest = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
        if (!result.success) {
            const message = result.error.errors[0]?.message ?? "Validation error";
            return next((0, http_errors_1.default)(422, message));
        }
        Object.assign(req, result.data);
        return next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map