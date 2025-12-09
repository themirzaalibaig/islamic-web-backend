import { Tasbeeh } from '@/features/tasbeeh/type/tasbeeh.type';
import { Document, model, Schema } from 'mongoose';

export interface TasbeehDocument extends Document, Omit<Tasbeeh, '_id' | 'user'> {
  user: Schema.Types.ObjectId;
}

export const TasbeehSchema = new Schema<TasbeehDocument>(
  {
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    target: { type: Number, required: true, min: 1 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

TasbeehSchema.index({ user: 1, isActive: 1 });

export const TasbeehModel = model<TasbeehDocument>('Tasbeeh', TasbeehSchema);
