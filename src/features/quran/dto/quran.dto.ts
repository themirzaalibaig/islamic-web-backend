import z from 'zod';
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

export type GetChaptersQueryDto = z.infer<typeof getChaptersQuerySchema>;
export type GetChapterParamsDto = z.infer<typeof getChapterParamsSchema>;
export type GetChapterQueryDto = z.infer<typeof getChapterQuerySchema>;
export type GetChapterInfoParamsDto = z.infer<typeof getChapterInfoParamsSchema>;
export type GetChapterInfoQueryDto = z.infer<typeof getChapterInfoQuerySchema>;
export type GetVersesByChapterParamsDto = z.infer<typeof getVersesByChapterParamsSchema>;
export type GetVersesByChapterQueryDto = z.infer<typeof getVersesByChapterQuerySchema>;
export type GetVersesByJuzParamsDto = z.infer<typeof getVersesByJuzParamsSchema>;
export type GetVersesByJuzQueryDto = z.infer<typeof getVersesByJuzQuerySchema>;
export type GetTafsirsQueryDto = z.infer<typeof getTafsirsQuerySchema>;
export type GetSurahTranslationsParamsDto = z.infer<typeof getSurahTranslationsParamsSchema>;
export type GetSurahTranslationsQueryDto = z.infer<typeof getSurahTranslationsQuerySchema>;
export type GetSurahTafsirsParamsDto = z.infer<typeof getSurahTafsirsParamsSchema>;
export type GetSurahTafsirsQueryDto = z.infer<typeof getSurahTafsirsQuerySchema>;
export type GetRecitationsQueryDto = z.infer<typeof getRecitationsQuerySchema>;
export type GetSurahRecitationParamsDto = z.infer<typeof getSurahRecitationParamsSchema>;
export type GetJuzRecitationParamsDto = z.infer<typeof getJuzRecitationParamsSchema>;
export type GetAyahRecitationParamsDto = z.infer<typeof getAyahRecitationParamsSchema>;