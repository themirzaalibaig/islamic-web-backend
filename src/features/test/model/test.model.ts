import { Test } from '@/features/test';
import mongoose, { Document, Schema } from 'mongoose';

export interface TestDocument extends Document, Omit<Test, '_id'> {}

const TestSchema = new Schema<TestDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true },
);

export const TestModel = mongoose.model<TestDocument>('Test', TestSchema);
