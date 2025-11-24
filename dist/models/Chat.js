"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
// import { ChatType } from "@alike/shared";
// Local ChatType definition
const ChatType = {
    SINGLE: 'single',
    GROUP: 'group'
};
const ChatSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(ChatType), required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    groupName: { type: String },
    groupAvatarUrl: { type: String },
    membersHash: { type: String, index: true },
    lastMessage: { type: mongoose_1.Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });
exports.ChatModel = (0, mongoose_1.model)("Chat", ChatSchema);
//# sourceMappingURL=Chat.js.map