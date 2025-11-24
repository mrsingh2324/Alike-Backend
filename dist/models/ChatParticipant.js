"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatParticipantModel = void 0;
const mongoose_1 = require("mongoose");
const ChatParticipantSchema = new mongoose_1.Schema({
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    unreadCount: { type: Number, default: 0 },
    lastReadAt: { type: Date },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });
ChatParticipantSchema.index({ chatId: 1, userId: 1 }, { unique: true });
exports.ChatParticipantModel = (0, mongoose_1.model)("ChatParticipant", ChatParticipantSchema);
//# sourceMappingURL=ChatParticipant.js.map