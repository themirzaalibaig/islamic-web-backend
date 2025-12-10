import z from 'zod';
import { Router } from 'express';
import {
  getChaptersController,
  getChapterController,
  getChapterInfoController,
  getVersesByChapterController,
  getVersesByJuzController,
  getTranslationsController,
  getSurahTranslationsController,
  getTafsirsController,
  getSurahTafsirsController,
  getRecitationsController,
  getSurahRecitationController,
  getJuzRecitationController,
  getAyahRecitationController,
} from '@/features/quran';
import { authenticate } from '@/middlewares';
import { validate } from '@/middlewares/validation.middleware';
import {
  getChaptersQuerySchema,
  getChapterParamsSchema,
  getChapterQuerySchema,
  getChapterInfoParamsSchema,
  getChapterInfoQuerySchema,
  getVersesByChapterParamsSchema,
  getVersesByChapterQuerySchema,
  getVersesByJuzParamsSchema,
  getVersesByJuzQuerySchema,
  getTafsirsQuerySchema,
  getSurahTranslationsParamsSchema,
  getSurahTranslationsQuerySchema,
  getSurahTafsirsParamsSchema,
  getSurahTafsirsQuerySchema,
  getRecitationsQuerySchema,
  getSurahRecitationParamsSchema,
  getJuzRecitationParamsSchema,
  getAyahRecitationParamsSchema,
} from '@/features/quran/validation/quran.validations';

export const quransRouter = Router();

// Chapters
quransRouter.get(
  '/chapters',
  authenticate,
  validate({ query: getChaptersQuerySchema }),
  getChaptersController,
);

quransRouter.get(
  '/chapters/:id',
  authenticate,
  validate(
    z.object({
      params: getChapterParamsSchema,
      query: getChapterQuerySchema,
    }),
  ),
  getChapterController,
);

quransRouter.get(
  '/chapters/:id/info',
  authenticate,
  validate(
    z.object({
      params: getChapterInfoParamsSchema,
      query: getChapterInfoQuerySchema,
    }),
  ),
  getChapterInfoController,
);

// Verses
quransRouter.get(
  '/verses/chapter/:chapterNumber',
  authenticate,
  validate(
    z.object({
      params: getVersesByChapterParamsSchema,
      query: getVersesByChapterQuerySchema,
    }),
  ),
  getVersesByChapterController,
);

quransRouter.get(
  '/verses/juz/:juzNumber',
  authenticate,
  validate(
    z.object({
      params: getVersesByJuzParamsSchema,
      query: getVersesByJuzQuerySchema,
    }),
  ),
  getVersesByJuzController,
);

// Translations
quransRouter.get('/translations', authenticate, getTranslationsController);

quransRouter.get(
  '/chapters/:chapterNumber/translations',
  authenticate,
  validate(
    z.object({
      params: getSurahTranslationsParamsSchema,
      query: getSurahTranslationsQuerySchema,
    }),
  ),
  getSurahTranslationsController,
);

// Tafsirs
quransRouter.get(
  '/tafsirs',
  authenticate,
  validate({ query: getTafsirsQuerySchema }),
  getTafsirsController,
);

quransRouter.get(
  '/chapters/:chapterNumber/tafsirs',
  authenticate,
  validate(
    z.object({
      params: getSurahTafsirsParamsSchema,
      query: getSurahTafsirsQuerySchema,
    }),
  ),
  getSurahTafsirsController,
);

// Recitations
quransRouter.get(
  '/recitations',
  authenticate,
  validate({ query: getRecitationsQuerySchema }),
  getRecitationsController,
);

quransRouter.get(
  '/chapters/:chapterNumber/recitations/:recitationId',
  authenticate,
  validate(z.object({ params: getSurahRecitationParamsSchema })),
  getSurahRecitationController,
);

quransRouter.get(
  '/juzs/:juzNumber/recitations/:recitationId',
  authenticate,
  validate(z.object({ params: getJuzRecitationParamsSchema })),
  getJuzRecitationController,
);

quransRouter.get(
  '/verses/:ayahKey/recitations/:recitationId',
  authenticate,
  validate(z.object({ params: getAyahRecitationParamsSchema })),
  getAyahRecitationController,
);
