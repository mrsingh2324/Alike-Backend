import { Schema, model } from "mongoose";
const ChatParticipantSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    unreadCount: { type: Number, default: 0 },
    lastReadAt: { type: Date },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });
ChatParticipantSchema.index({ chatId: 1, userId: 1 }, { unique: true });
export const ChatParticipantModel = model("ChatParticipant", ChatParticipantSchema);
