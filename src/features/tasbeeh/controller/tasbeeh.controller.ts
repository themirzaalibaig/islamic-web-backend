import { Response } from 'express';
import { Res, getCurrentUserId, catchAsync } from '@/utils';
import {
  CreateTasbeehDto,
  UpdateTasbeehDto,
  ListTasbeehsQueryDto,
  TasbeehIdParams,
  createTasbeeh,
  getTasbeehById,
  updateTasbeehById,
  deleteTasbeehById,
  listTasbeehs,
} from '@/features/tasbeeh';
import { TypedRequest } from '@/types';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

export const createTasbeehController = catchAsync(
  async (req: AuthenticatedRequest<unknown, CreateTasbeehDto>, res: Response) => {
    const userId = getCurrentUserId(req);
    const doc = await createTasbeeh(req.body, userId);
    return Res.created(res, { tasbeeh: doc });
  },
);

export const getTasbeehController = catchAsync(
  async (req: AuthenticatedRequest<unknown, unknown, TasbeehIdParams>, res: Response) => {
    const userId = getCurrentUserId(req);
    const doc = await getTasbeehById(req.params.id, userId);
    return Res.success(res, { tasbeeh: doc });
  },
);

export const updateTasbeehController = catchAsync(
  async (req: AuthenticatedRequest<unknown, UpdateTasbeehDto, TasbeehIdParams>, res: Response) => {
    const userId = getCurrentUserId(req);
    const doc = await updateTasbeehById(req.params.id, req.body, userId);
    return Res.success(res, { tasbeeh: doc }, 'Tasbeeh updated successfully');
  },
);

export const deleteTasbeehController = catchAsync(
  async (req: AuthenticatedRequest<unknown, unknown, TasbeehIdParams>, res: Response) => {
    const userId = getCurrentUserId(req);
    await deleteTasbeehById(req.params.id, userId);
    return Res.noContent(res);
  },
);

export const listTasbeehsController = catchAsync(
  async (req: AuthenticatedRequest<ListTasbeehsQueryDto>, res: Response) => {
    const userId = getCurrentUserId(req);
    const dto = req.query;
    const result = await listTasbeehs(dto, userId);

    if (dto.page && dto.limit) {
      return Res.paginated(res, { tasbeehs: result.data }, result.total, dto.page, dto.limit);
    }

    return Res.success(
      res,
      { tasbeehs: result.data },
      'Tasbeehs retrieved successfully',
      undefined,
      {
        total: result.total,
      },
    );
  },
);
