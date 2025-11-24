"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockedUsersHandler = exports.unblockUserHandler = exports.blockUserHandler = exports.getContactsHandler = exports.syncContactsHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const contact_service_1 = require("../services/contact.service");
exports.syncContactsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contacts = await (0, contact_service_1.syncContacts)(req.userId, req.body.contacts ?? []);
    res.json({ success: true, data: contacts });
});
exports.getContactsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contacts = await (0, contact_service_1.getContacts)(req.userId);
    res.json({ success: true, data: contacts });
});
exports.blockUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, contact_service_1.blockUser)(req.userId, req.body.userId);
    res.json({ success: true });
});
exports.unblockUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, contact_service_1.unblockUser)(req.userId, req.body.userId);
    res.json({ success: true });
});
exports.getBlockedUsersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const blocked = await (0, contact_service_1.getBlockedUsers)(req.userId);
    res.json({ success: true, data: blocked });
});
//# sourceMappingURL=contact.controller.js.map