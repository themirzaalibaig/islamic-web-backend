import { Request, Response } from 'express';
import {
  getCollection,
  GetCollectionDto,
  getCollections,
  getBooksByCollection,
  getBook,
  GetBookDto,
  getChaptersByBook,
  GetChaptersByBookDto,
  getHadithsByBook,
  GetHadithsByBookDto,
  GetHadithsByBookQueryDto,
  getHadith,
  GetHadithDto,
  getRandomHadith,
} from '@/features/hadith';
import { catchAsync, Res } from '@/utils';
import { TypedRequest } from '@/types';

export const getCollectionsController = catchAsync(async (req: Request, res: Response) => {
  const collections = await getCollections();
  Res.success(res, { collections });
});

export const getCollectionController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetCollectionDto>, res: Response) => {
    const { collectionName } = req.params;
    const collection = await getCollection(collectionName);
    Res.success(res, { collection });
  },
);

export const getBooksByCollectionController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetCollectionDto>, res: Response) => {
    const { collectionName } = req.params;
    const books = await getBooksByCollection(collectionName);
    Res.success(res, { books });
  },
);

export const getBookController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetBookDto>, res: Response) => {
    const { collectionName, bookNumber } = req.params;
    const book = await getBook(collectionName, bookNumber);
    Res.success(res, { book });
  },
);

export const getChaptersByBookController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetChaptersByBookDto>, res: Response) => {
    const { collectionName, bookNumber } = req.params;
    const chapters = await getChaptersByBook(collectionName, bookNumber);
    Res.success(res, { chapters });
  },
);

export const getHadithsByBookController = catchAsync(
  async (
    req: TypedRequest<GetHadithsByBookQueryDto, unknown, GetHadithsByBookDto>,
    res: Response,
  ) => {
    const { collectionName, bookNumber } = req.params;
    const { page, limit } = req.query;
    const result = await getHadithsByBook(collectionName, bookNumber, page, limit);
    Res.success(res, result);
  },
);

export const getHadithController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetHadithDto>, res: Response) => {
    const { collectionName, hadithNumber } = req.params;
    const hadith = await getHadith(collectionName, hadithNumber);
    Res.success(res, { hadith });
  },
);

export const getRandomHadithController = catchAsync(async (req: Request, res: Response) => {
  const hadith = await getRandomHadith();
  Res.success(res, { hadith });
});
