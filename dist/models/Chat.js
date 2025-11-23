import { Schema, model } from "mongoose";
// import { ChatType } from "../packages/shared/src";
// Local ChatType definition
const ChatType = {
    SINGLE: 'single',
    GROUP: 'group'
};
const ChatSchema = new Schema({
    type: { type: String, enum: Object.values(ChatType), required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    groupName: { type: String },
    groupAvatarUrl: { type: String },
    membersHash: { type: String, index: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });
export const ChatModel = model("Chat", ChatSchema);
