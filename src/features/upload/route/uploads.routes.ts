import { Router } from 'express';
import {
  validate,
  idempotency,
  validateUploadSingleFile,
  validateUploadMultipleFiles,
} from '@/middlewares';
import {
  uploadCreateSchema,
  uploadUpdateSchema,
  uploadIdParamsSchema,
  listUploadsQuerySchema,
  createUploadController,
  createUploadsController,
  getUploadController,
  listUploadsController,
  updateUploadController,
  deleteUploadController,
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '@/features/upload';

export const uploadsRouter = Router();

uploadsRouter.get('/', validate({ query: listUploadsQuerySchema }), listUploadsController);
uploadsRouter.post(
  '/',
  validate({ body: uploadCreateSchema }),
  idempotency('upload'),
  uploadSingleMiddleware,
  validateUploadSingleFile,
  createUploadController,
);
uploadsRouter.post(
  '/multiple',
  validate({ body: uploadCreateSchema }),
  idempotency('uploadMultiple'),
  uploadMultipleMiddleware,
  validateUploadMultipleFiles,
  createUploadsController,
);
uploadsRouter.get('/:id', validate({ params: uploadIdParamsSchema }), getUploadController);
uploadsRouter.put(
  '/:id',
  validate({ params: uploadIdParamsSchema, body: uploadUpdateSchema }),
  updateUploadController,
);
uploadsRouter.delete('/:id', validate({ params: uploadIdParamsSchema }), deleteUploadController);
