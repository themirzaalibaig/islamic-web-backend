import { z } from 'zod';
import { listUploadsQuerySchema, Upload } from '@/features/upload/';

export interface CreateUploadDto extends Partial<Pick<Upload, 'refType' | 'refId' | 'seo'>> {}

export interface UpdateUploadDto extends Partial<CreateUploadDto> {}

export interface GetAllUploadsDto extends z.infer<typeof listUploadsQuerySchema> {}
