import { Model, Query, FilterQuery } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}

export const buildSort = (field: string, order: 'asc' | 'desc'): Record<string, 1 | -1> => ({
  [field]: order === 'asc' ? 1 : -1,
});

export const computeOffset = (page: number, limit: number): number => (page - 1) * limit;

export async function paginateQuery<T>(
  query: Query<T[], any>,
  options: PaginationOptions = {},
): Promise<PaginationResult<T>> {
  const { page, limit, sort, order = 'desc' } = options;
  const filter = (query as any).getFilter ? (query as any).getFilter() : {};
  const model: Model<any> = (query as any).model;
  const total = await model.countDocuments(filter);

  if (sort) query = query.sort(buildSort(sort, order));

  if (!limit) {
    const data = await query;
    return { data, total } as PaginationResult<T>;
  }

  const currentPage = Math.max(page || 1, 1);
  const safeLimit = Math.max(limit, 1);
  const data = await query.skip(computeOffset(currentPage, safeLimit)).limit(safeLimit);
  const totalPages = Math.ceil(total / safeLimit);
  return { data, total, currentPage, totalPages, limit: safeLimit } as PaginationResult<T>;
}

export function addSearchFilters<T>(
  query: Query<T[], any>,
  searchTerm: string,
  searchableFields: string[],
): Query<T[], any> {
  if (!searchTerm) return query;
  const or = searchableFields.map((f) => ({ [f]: new RegExp(searchTerm, 'i') }));
  return query.or(or as any);
}

export async function findOneOrThrow<T>(
  model: Model<T>,
  obj: {
    where: FilterQuery<T>;
    relations?: string[];
    field: string;
    message: string;
    shouldExist?: boolean;
  },
): Promise<T | null> {
  const { where, field, message, shouldExist = true } = obj;
  const entity = await model.findOne(where as any);
  if (shouldExist && !entity) {
    const err = new Error(message);
    (err as any).field = field;
    throw err;
  }
  if (!shouldExist && entity) {
    const err = new Error(message);
    (err as any).field = field;
    throw err;
  }
  return entity as any;
}
