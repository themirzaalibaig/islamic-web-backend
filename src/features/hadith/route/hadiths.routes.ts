import z from 'zod';
import { Router } from 'express';
import {
  getCollectionController,
  getCollectionSchema,
  getCollectionsController,
  getBooksByCollectionController,
  getBookController,
  getBookSchema,
  getChaptersByBookController,
  getChaptersByBookSchema,
  getHadithsByBookController,
  getHadithsByBookSchema,
  getHadithsByBookQuerySchema,
  getHadithController,
  getHadithSchema,
  getRandomHadithController,
} from '@/features/hadith';
import { validate } from '@/middlewares';

export const hadithsRouter = Router();

hadithsRouter.get('/hadiths/random', getRandomHadithController);

hadithsRouter.get('/collections', getCollectionsController);
hadithsRouter.get(
  '/collections/:collectionName',
  validate(z.object({ params: getCollectionSchema })),
  getCollectionController,
);
hadithsRouter.get(
  '/collections/:collectionName/books',
  validate(z.object({ params: getCollectionSchema })),
  getBooksByCollectionController,
);
hadithsRouter.get(
  '/collections/:collectionName/books/:bookNumber',
  validate(z.object({ params: getBookSchema })),
  getBookController,
);
hadithsRouter.get(
  '/collections/:collectionName/books/:bookNumber/chapters',
  validate(z.object({ params: getChaptersByBookSchema })),
  getChaptersByBookController,
);
hadithsRouter.get(
  '/collections/:collectionName/books/:bookNumber/hadiths',
  validate(z.object({ params: getHadithsByBookSchema, query: getHadithsByBookQuerySchema })),
  getHadithsByBookController,
);
hadithsRouter.get(
  '/collections/:collectionName/hadiths/:hadithNumber',
  validate(z.object({ params: getHadithSchema })),
  getHadithController,
);
