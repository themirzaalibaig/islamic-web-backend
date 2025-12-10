import { createCachedRepository, findOneOrThrow, AppError } from '@/utils';
import { TasbeehModel, TasbeehDocument } from '@/features/tasbeeh/model/tasbeeh.model';
import { CreateTasbeehDto, UpdateTasbeehDto, ListTasbeehsQueryDto } from '@/features/tasbeeh';
import { FilterQuery } from 'mongoose';

const repo = createCachedRepository(TasbeehModel, 'tasbeeh');

export const createTasbeeh = async (payload: CreateTasbeehDto, userId: string) => {
  const doc = await repo.create({
    ...payload,
    user: userId,
    isActive: true,
  });
  return doc;
};

export const getTasbeehById = async (id: string, userId: string) => {
  const doc = await findOneOrThrow<TasbeehDocument>(TasbeehModel, {
    where: { _id: id, user: userId } as FilterQuery<TasbeehDocument>,
    field: 'id',
    message: 'Tasbeeh not found',
  });
  return doc;
};

export const updateTasbeehById = async (id: string, payload: UpdateTasbeehDto, userId: string) => {
  // Verify ownership
  await findOneOrThrow<TasbeehDocument>(TasbeehModel, {
    where: { _id: id, user: userId } as FilterQuery<TasbeehDocument>,
    field: 'id',
    message: 'Tasbeeh not found',
  });

  const doc = await repo.updateById(id, payload);
  if (!doc) {
    throw AppError.notFound('Tasbeeh not found');
  }
  return doc;
};

export const deleteTasbeehById = async (id: string, userId: string) => {
  // Verify ownership
  await findOneOrThrow<TasbeehDocument>(TasbeehModel, {
    where: { _id: id, user: userId } as FilterQuery<TasbeehDocument>,
    field: 'id',
    message: 'Tasbeeh not found',
  });

  const doc = await repo.deleteById(id);
  if (!doc) {
    throw AppError.notFound('Tasbeeh not found');
  }
  return doc;
};

export const listTasbeehs = async (dto: ListTasbeehsQueryDto, userId: string) => {
  const filter: FilterQuery<TasbeehDocument> = { user: userId };

  if (dto.active !== undefined) {
    filter.isActive = dto.active;
  }

  const result = await repo.list(dto, filter);
  return result;
};
