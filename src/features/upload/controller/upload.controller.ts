import { Response } from 'express';
import multer from 'multer';
import { Res } from '@/utils';
import { TypedRequest } from '@/types';
import { CreateUploadDto, UpdateUploadDto, GetAllUploadsDto } from '@/features/upload';
import {
  createUploadFromBuffer,
  getUploadById,
  listUploads,
  updateUploadById,
  deleteUploadById,
} from '@/features/upload';
import { IdParams } from '@/dto';

const storage = multer.memoryStorage();
export const uploadSingleMiddleware = multer({ storage }).single('file');
export const uploadMultipleMiddleware = multer({ storage }).array('files');

export const createUploadController = async (
  req: TypedRequest<unknown, CreateUploadDto>,
  res: Response,
) => {
  try {
    const file = (req as any).file;
    const doc = await createUploadFromBuffer(file, req.body);
    return Res.created(res, { upload: doc });
  } catch (error: any) {
    return Res.internalError(res, "Internal server error", error);
  }
};

export const createUploadsController = async (
  req: TypedRequest<unknown, unknown>,
  res: Response,
) => {
  try {
    const files = (req as any).files || [];
    const results = [] as any[];
    for (const f of files) {
      const doc = await createUploadFromBuffer(f, {
        refType: (req.body as any).refType,
        refId: (req.body as any).refId,
      });
      results.push(doc);
    }
    return Res.created(res, { uploads: results });
  } catch (error: any) {
    return Res.internalError(res, "Internal server error", error);
  }
};

export const getUploadController = async (
  req: TypedRequest<unknown, unknown, IdParams>,
  res: Response,
) => {
  try {
    const doc = await getUploadById(req.params.id);
    if (!doc) return Res.notFound(res, 'Upload not found');
    return Res.success(res, { upload: doc });
  } catch (error: any) {
    return Res.internalError(res, "Internal server error", error);
  }
};

export const listUploadsController = async (req: TypedRequest<GetAllUploadsDto>, res: Response) => {
  const dto = req.query;
  try {
    const result = await listUploads(dto);
    if (dto.page && dto.limit)
      return Res.paginated(res, { uploads: result.data }, result.total, dto.page, dto.limit);
    return Res.success(res, { uploads: result.data }, 'Data retrieved successfully', undefined, {
      total: result.total,
    });
  } catch (error: any) {
    return Res.internalError(res, "Internal server error", error);
  }
};

export const updateUploadController = async (
  req: TypedRequest<unknown, UpdateUploadDto, IdParams>,
  res: Response,
) => {
  try {
    const doc = await updateUploadById(req.params.id, req.body as any);
    if (!doc) return Res.notFound(res, 'Upload not found');
    return Res.success(res, { upload: doc }, 'Updated');
  } catch (error: any) {
    return Res.internalError(res, "Internal server error", error);
  }
};

export const deleteUploadController = async (
  req: TypedRequest<unknown, unknown, IdParams>,
  res: Response,
) => {
  try {
    const ok = await deleteUploadById(req.params.id);
    if (!ok) return Res.notFound(res, 'Upload not found');
    return Res.noContent(res);
  } catch (error: any) {
    return Res.internalError(res, "Internal server error", error);
  }
};
