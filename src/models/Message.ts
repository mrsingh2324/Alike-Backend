import { Schema, model, type Model, type Types } from "mongoose";
// import { MessageStatus } from "@alike/shared";

// Local MessageStatus definition
const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
} as const;

type MessageStatus = typeof MessageStatus[keyof typeof MessageStatus];

export interface IMessage {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  caption?: string;
  status: MessageStatus;
  editedAt?: Date | null;
  isDeletedForSender?: boolean;
  isDeletedForAll?: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: false },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'file'] },
    caption: { type: String },
    status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.SENT },
    editedAt: { type: Date },
    isDeletedForSender: { type: Boolean, default: false },
    isDeletedForAll: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const MessageModel: Model<IMessage> = model<IMessage>("Message", MessageSchema);
