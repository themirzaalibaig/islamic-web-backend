import { IdentifiableType, TimestampType } from '@/types';

export type UploadStatus = 'TEMP' | 'ACTIVE';

export interface UploadSeoMeta {
  altText?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface UploadRef {
  refType?: string;
  refId?: string;
}

export interface Upload extends UploadRef, IdentifiableType, TimestampType {
  originalFilename: string;
  provider: 'local' | 'cloudinary' | 'aws';
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType?: string;
  status: UploadStatus;
  seo?: UploadSeoMeta;
}
