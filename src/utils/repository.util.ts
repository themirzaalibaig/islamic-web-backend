import {
  buildVersionedCacheKey,
  cacheGet,
  cacheSet,
  cacheDel,
  incrementCacheVersion,
  invalidateEntityListCache,
  makeKey,
  paginateQuery,
  PaginationOptions,
  PaginationResult,
  buildSort,
} from '@/utils';
import { Model, Document, FilterQuery } from 'mongoose';

type ListCacheKeyParams = {
  prefix: string[];
  pagination?: PaginationOptions;
  extra?: (string | number)[];
};

const buildListCacheKey = async (entity: string, params: ListCacheKeyParams): Promise<string> => {
  const { prefix, pagination, extra = [] } = params;
  const { page = 1, limit, sort = 'createdAt', order = 'desc' } = pagination || {};

  const keyParts = limit
    ? ['list', page, limit, sort, order, ...extra]
    : ['list', 'all', sort, order, ...extra];

  return buildVersionedCacheKey(entity, [...prefix, ...keyParts]);
};

const SINGLE_TTL_SECONDS = 20 * 60; // 20 mins
const LIST_TTL_SECONDS = 15 * 60; // 15 mins

export const createCachedRepository = <T extends Document>(
  model: Model<T>,
  entityName: string,
  ttlSeconds?: number,
  listTtlSeconds?: number,
) => {
  const singleKey = (id: string) => makeKey(entityName, id);

  return {
    async create(payload: any) {
      const doc = await model.create(payload);
      await cacheSet(
        singleKey((doc as any)._id.toString()),
        doc.toObject(),
        ttlSeconds || SINGLE_TTL_SECONDS,
      );
      await incrementCacheVersion(entityName);
      await invalidateEntityListCache(entityName);
      return doc;
    },

    async findById(id: string) {
      const key = singleKey(id);
      const cached = await cacheGet<T>(key);
      if (cached) return cached;

      const doc = await model.findById(id).lean();
      if (doc) await cacheSet(key, doc as any, ttlSeconds || SINGLE_TTL_SECONDS);
      return doc;
    },

    async updateById(id: string, payload: any) {
      const doc = await model.findByIdAndUpdate(id, payload, { new: true }).lean();
      if (doc) {
        await cacheSet(singleKey(id), doc as any, ttlSeconds || SINGLE_TTL_SECONDS);
      }
      await incrementCacheVersion(entityName);
      await invalidateEntityListCache(entityName);
      return doc;
    },

    async deleteById(id: string) {
      const doc = await model.findByIdAndDelete(id).lean();
      if (doc) {
        await cacheDel(singleKey(id));
        await incrementCacheVersion(entityName);
        await invalidateEntityListCache(entityName);
      }
      return doc;
    },

    async list(
      dto: PaginationOptions & { extraCacheParams?: (string | number)[] } = {},
      filter?: FilterQuery<T>,
    ): Promise<PaginationResult<T>> {
      const { extraCacheParams = [], ...pagination } = dto;
      const cacheKey = await buildListCacheKey(entityName, {
        prefix: ['list'],
        pagination,
        extra: extraCacheParams,
      });

      const cached = await cacheGet<PaginationResult<T>>(cacheKey);
      if (cached) return cached;

      const query = model.find(filter || {}).lean();
      if (pagination.sort) {
        query.sort(buildSort(pagination.sort, pagination.order === 'asc' ? 'asc' : 'desc'));
      }

      const result = (await paginateQuery<any>(query as any, pagination)) as PaginationResult<T>;

      await cacheSet(cacheKey, result, listTtlSeconds || LIST_TTL_SECONDS);
      return result;
    },
  };
};
