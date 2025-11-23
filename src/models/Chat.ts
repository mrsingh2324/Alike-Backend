import { Schema, model, type Model, type Types } from "mongoose";
// import { ChatType } from "@alike/shared";

// Local ChatType definition
const ChatType = {
  SINGLE: 'single',
  GROUP: 'group'
} as const;

type ChatType = typeof ChatType[keyof typeof ChatType];

export interface IChat {
  type: ChatType;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  groupName?: string;
  groupAvatarUrl?: string;
  membersHash?: string | null;
  lastMessage?: Types.ObjectId | null;
}

const ChatSchema = new Schema<IChat>(
  {
    type: { type: String, enum: Object.values(ChatType), required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    groupName: { type: String },
    groupAvatarUrl: { type: String },
    membersHash: { type: String, index: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }
  },
  { timestamps: true }
);

export const ChatModel: Model<IChat> = model<IChat>("Chat", ChatSchema);
