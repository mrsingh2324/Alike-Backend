"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserByPhoneHandler = exports.searchUserByUniqueIdHandler = exports.getUserByIdHandler = exports.updateMeHandler = exports.getMeHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const user_service_1 = require("../services/user.service");
exports.getMeHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, user_service_1.getProfile)(req.userId);
    res.json({ success: true, data: user });
});
exports.updateMeHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updated = await (0, user_service_1.updateProfile)(req.userId, req.body);
    res.json({ success: true, data: updated });
});
exports.getUserByIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const user = await (0, user_service_1.getPublicProfile)(userId);
    res.json({ success: true, data: user });
});
exports.searchUserByUniqueIdHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { uniqueId } = req.query;
    const user = await (0, user_service_1.searchUserByUniqueId)(uniqueId);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
});
exports.searchUserByPhoneHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { phone } = req.query;
    const user = await (0, user_service_1.searchUserByPhone)(phone);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
});
//# sourceMappingURL=user.controller.js.map