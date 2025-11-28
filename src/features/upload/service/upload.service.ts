import { v4 as uuid } from 'uuid';
import { createCachedRepository } from '@/utils';
import { GetAllUploadsDto, Upload, UploadStatus, CreateUploadDto } from '@/features/upload';
import { UploadModel } from '@/features/upload/model/upload.model';
import { storageUploadBuffer, storageUploadFile, storageDeleteAsset } from '@/providers';

const repo = createCachedRepository(UploadModel as any, 'upload');

export const createUploadFromBuffer = async (
  file: { buffer: Buffer; originalname: string; mimetype?: string },
  payload: CreateUploadDto,
): Promise<Upload> => {
  const ext = file.originalname.split('.').pop() || 'bin';
  const name = `${Date.now()}-${uuid()}.${ext}`;
  const stored = await storageUploadBuffer(file.buffer, name, { folder: payload.refType });
  const doc = await repo.create({
    originalFilename: file.originalname,
    provider: stored.secureUrl.startsWith('http')
      ? stored.url.includes('amazonaws')
        ? 'aws'
        : 'cloudinary'
      : 'local',
    publicId: stored.publicId,
    url: stored.url,
    secureUrl: stored.secureUrl,
    resourceType: stored.resourceType,
    status: 'TEMP' as UploadStatus,
    refType: payload.refType,
    refId: payload.refId,
    seo: payload.seo,
  });
  return (doc as any).toObject
    ? ((doc as any).toObject() as unknown as Upload)
    : (doc as unknown as Upload);
};

export const createUploadFromPath = async (
  path: string,
  filename: string,
  payload: { refType?: string; refId?: string } = {},
): Promise<Upload> => {
  const stored = await storageUploadFile(path, filename, { folder: payload.refType });
  const doc = await repo.create({
    originalFilename: filename,
    provider: stored.secureUrl.startsWith('http')
      ? stored.url.includes('amazonaws')
        ? 'aws'
        : 'cloudinary'
      : 'local',
    publicId: stored.publicId,
    url: stored.url,
    secureUrl: stored.secureUrl,
    resourceType: stored.resourceType,
    status: 'TEMP' as UploadStatus,
    refType: payload.refType,
    refId: payload.refId,
  });
  return (doc as any).toObject
    ? ((doc as any).toObject() as unknown as Upload)
    : (doc as unknown as Upload);
};

export const getUploadById = async (id: string): Promise<Upload | null> => {
  const doc = await repo.findById(id);
  return doc as any;
};

export const listUploads = async (
  dto: Partial<GetAllUploadsDto> = {},
): Promise<{
  data: Upload[];
  total: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}> => {
  const { page, limit, sort, order = 'desc', refType, refId, status, type } = dto as any;
  const filter: any = {};
  if (refType) filter.refType = refType;
  if (refId) filter.refId = refId;
  if (status) filter.status = status;
  if (type) filter.resourceType = type;
  const pagination = { page, limit, sort, order };
  const result = (await repo.list(pagination as any, filter)) as any;
  if (limit) {
    return {
      data: result.data as Upload[],
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
    };
  }
  return { data: result.data as Upload[], total: result.total };
};

export const updateUploadById = async (
  id: string,
  payload: {
    status?: UploadStatus;
    refType?: string;
    refId?: string;
    seo?: { metaTitle?: string; metaDescription?: string; metaKeywords?: string[] };
  },
): Promise<Upload | null> => {
  const doc = await repo.updateById(id, payload);
  return doc as any;
};

export const deleteUploadById = async (id: string): Promise<boolean> => {
  const doc = (await repo.deleteById(id)) as any;
  if (!doc) return false;
  await storageDeleteAsset(doc.publicId);
  return true;
};
