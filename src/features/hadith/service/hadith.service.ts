import { env } from '@/config';
import { logger, makeKey, cacheSet, cacheGet } from '@/utils';
import {
  Book,
  Collection,
  Chapter,
  Hadith,
  PaginatedResponse,
  RandomHadith,
} from '@/features/hadith';
import axios from 'axios';

const api = axios.create({
  baseURL: env.SUNNAH_URL,
  headers: {
    'X-API-Key': env.SUNNAH_API_KEY,
  },
});

export const getCollections = async (): Promise<Collection[]> => {
  try {
    const cacheKey = makeKey('collections');
    const cached = (await cacheGet(cacheKey)) as Collection[] | undefined;
    if (cached) return cached;

    const { data } = await api.get<{ data: Collection[] }>('/collections');
    cacheSet(cacheKey, data.data, 30 * 24 * 60 * 60 * 1000); // Cache for one month because it rarely changes
    return data.data;
  } catch (error) {
    logger.error(error, 'Failed to fetch collections');
    throw new Error('Unable to retrieve collections');
  }
};

export const getCollection = async (collectionName: string): Promise<Collection | undefined> => {
  try {
    const cacheKey = makeKey(`collection:${collectionName}`);
    const cached = (await cacheGet(cacheKey)) as Collection | undefined;
    if (cached) return cached;

    const { data } = await api.get<Collection>(`/collections/${collectionName}`);
    cacheSet(cacheKey, data, 30 * 24 * 60 * 60 * 1000); // Cache for one month because it rarely changes
    return data;
  } catch (error) {
    logger.error(error, `Failed to fetch collection: ${collectionName}`);
    throw new Error('Unable to retrieve collection');
  }
};

export const getBooksByCollection = async (collectionName: string): Promise<Book[]> => {
  try {
    const cacheKey = makeKey(`books:${collectionName}`);
    const cached = (await cacheGet(cacheKey)) as Book[] | undefined;
    if (cached) return cached;

    const { data } = await api.get<{ data: Book[] }>(`/collections/${collectionName}/books`);
    cacheSet(cacheKey, data.data, 30 * 24 * 60 * 60 * 1000); // Cache for one month because it rarely changes
    return data.data;
  } catch (error) {
    logger.error(error, `Failed to fetch books by collection: ${collectionName}`);
    throw new Error('Unable to retrieve books by collection');
  }
};

export const getBook = async (
  collectionName: string,
  bookNumber: string,
): Promise<Book | undefined> => {
  try {
    const cacheKey = makeKey(`book:${collectionName}:${bookNumber}`);
    const cached = (await cacheGet(cacheKey)) as Book | undefined;
    if (cached) return cached;

    const { data } = await api.get<Book>(`/collections/${collectionName}/books/${bookNumber}`);
    cacheSet(cacheKey, data, 30 * 24 * 60 * 60 * 1000); // Cache for one month because it rarely changes
    return data;
  } catch (error) {
    logger.error(error, `Failed to fetch book: ${collectionName}:${bookNumber}`);
    throw new Error('Unable to retrieve book');
  }
};

export const getChaptersByBook = async (
  collectionName: string,
  bookNumber: string,
): Promise<Chapter[]> => {
  try {
    const cacheKey = makeKey(`chapters:${collectionName}:${bookNumber}`);
    const cached = (await cacheGet(cacheKey)) as Chapter[] | undefined;
    if (cached) return cached;

    const { data } = await api.get<PaginatedResponse<Chapter>>(
      `/collections/${collectionName}/books/${bookNumber}/chapters`,
    );
    cacheSet(cacheKey, data.data, 30 * 24 * 60 * 60 * 1000); // Cache for one month because it rarely changes
    return data.data;
  } catch (error) {
    logger.error(error, `Failed to fetch chapters: ${collectionName}:${bookNumber}`);
    throw new Error('Unable to retrieve chapters');
  }
};

export const getHadithsByBook = async (
  collectionName: string,
  bookNumber: string,
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<Hadith>> => {
  try {
    const cacheKey = makeKey(`hadiths:${collectionName}:${bookNumber}:${page || 1}:${limit || 50}`);
    const cached = (await cacheGet(cacheKey)) as PaginatedResponse<Hadith> | undefined;
    if (cached) return cached;

    const params: Record<string, string> = {};
    if (page) params.page = page.toString();
    if (limit) params.limit = limit.toString();

    const { data } = await api.get<PaginatedResponse<Hadith>>(
      `/collections/${collectionName}/books/${bookNumber}/hadiths`,
      { params },
    );
    cacheSet(cacheKey, data, 7 * 24 * 60 * 60 * 1000); // Cache for one week
    return data;
  } catch (error) {
    logger.error(error, `Failed to fetch hadiths: ${collectionName}:${bookNumber}`);
    throw new Error('Unable to retrieve hadiths');
  }
};

export const getHadith = async (
  collectionName: string,
  hadithNumber: string,
): Promise<Hadith | undefined> => {
  try {
    const cacheKey = makeKey(`hadith:${collectionName}:${hadithNumber}`);
    const cached = (await cacheGet(cacheKey)) as Hadith | undefined;
    if (cached) return cached;

    const { data } = await api.get<Hadith>(
      `/collections/${collectionName}/hadiths/${hadithNumber}`,
    );
    cacheSet(cacheKey, data, 7 * 24 * 60 * 60 * 1000); // Cache for one week
    return data;
  } catch (error) {
    logger.error(error, `Failed to fetch hadith: ${collectionName}:${hadithNumber}`);
    throw new Error('Unable to retrieve hadith');
  }
};

export const getRandomHadith = async (): Promise<RandomHadith> => {
  try {
    const { data } = await api.get<RandomHadith>('/hadiths/random');
    return data;
  } catch (error) {
    logger.error(error, 'Failed to fetch random hadith');
    throw new Error('Unable to retrieve random hadith');
  }
};
