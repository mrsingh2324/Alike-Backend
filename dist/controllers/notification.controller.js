"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterTokenHandler = exports.registerTokenHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const notification_service_1 = require("../services/notification.service");
exports.registerTokenHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token, platform } = req.body;
    await (0, notification_service_1.registerDeviceToken)(req.userId, token, platform);
    res.json({ success: true });
});
exports.unregisterTokenHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    await (0, notification_service_1.unregisterDeviceToken)(token);
    res.json({ success: true });
});
//# sourceMappingURL=notification.controller.js.map