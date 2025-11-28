import mongoose, { Document, Schema } from 'mongoose';
import { Upload } from '@/features/upload';

export interface UploadDocument extends Document, Omit<Upload, '_id'> {}

const UploadSchema = new Schema<UploadDocument>(
  {
    originalFilename: { type: String, required: true },
    provider: { type: String, required: true, enum: ['local', 'cloudinary', 'aws'] },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: { type: String },
    status: { type: String, required: true, enum: ['TEMP', 'ACTIVE'], default: 'TEMP' },
    refType: { type: String },
    refId: { type: String },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: { type: [String] },
    },
  },
  { timestamps: true },
);

UploadSchema.index({ refType: 1, refId: 1 });

export const UploadModel = mongoose.model<UploadDocument>('Upload', UploadSchema);
