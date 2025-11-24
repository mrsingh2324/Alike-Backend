"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenModel = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("../types/shared");
const DeviceTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: Object.values(shared_1.PlatformType), required: true }
}, { timestamps: true });
exports.DeviceTokenModel = (0, mongoose_1.model)("DeviceToken", DeviceTokenSchema);
//# sourceMappingURL=DeviceToken.js.map