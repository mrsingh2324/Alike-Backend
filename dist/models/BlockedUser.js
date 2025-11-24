"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedUserModel = void 0;
const mongoose_1 = require("mongoose");
const BlockedUserSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    blockedUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });
BlockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });
exports.BlockedUserModel = (0, mongoose_1.model)("BlockedUser", BlockedUserSchema);
//# sourceMappingURL=BlockedUser.js.map