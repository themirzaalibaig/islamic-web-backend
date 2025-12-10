import { Schema, model, Document } from 'mongoose';
import { Chat, ChatMessage, MessageSource } from '../type/chat.type';

export interface ChatDocument extends Document, Omit<Chat, '_id' | 'userId'> {
  userId: Schema.Types.ObjectId;
}

const MessageSourceSchema = new Schema<MessageSource>(
  {
    type: { type: String, enum: ['quran', 'hadith'], required: true },
    reference: { type: String, required: true },
    text: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const ChatMessageSchema = new Schema<ChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    sources: [MessageSourceSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

export const ChatSchema = new Schema<ChatDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    messages: [ChatMessageSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ChatSchema.index({ userId: 1, isActive: 1, createdAt: -1 });

export const ChatModel = model<ChatDocument>('Chat', ChatSchema);
