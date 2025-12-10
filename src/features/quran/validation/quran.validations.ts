import z from 'zod';

export const getChaptersQuerySchema = z.object({
  language: z.string().optional().default('en'),
});

export const getChapterParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(114)),
});

export const getChapterQuerySchema = z.object({
  language: z.string().optional().default('en'),
});

export const getChapterInfoParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(114)),
});

export const getChapterInfoQuerySchema = z.object({
  language: z.string().optional().default('en'),
});

export const getVersesByChapterParamsSchema = z.object({
  chapterNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(114)),
});

export const getVersesByChapterQuerySchema = z.object({
  language: z.string().optional(),
  words: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((val) => (typeof val === 'boolean' ? val : val === 'true'))
    .optional(),
  translations: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => parseInt(id, 10)) : undefined)),
  tafsirs: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => parseInt(id, 10)) : undefined)),
  audio: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  per_page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(50).optional()),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export const getVersesByJuzParamsSchema = z.object({
  juzNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(30)),
});

export const getVersesByJuzQuerySchema = z.object({
  language: z.string().optional(),
  words: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((val) => (typeof val === 'boolean' ? val : val === 'true'))
    .optional(),
  translations: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => parseInt(id, 10)) : undefined)),
  tafsirs: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => parseInt(id, 10)) : undefined)),
  audio: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  per_page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(50).optional()),
});

export const getTafsirsQuerySchema = z.object({
  language: z.string().optional(),
});

export const getSurahTranslationsParamsSchema = z.object({
  chapterNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(114)),
});

export const getSurahTranslationsQuerySchema = z.object({
  language: z.string().optional(),
  translations: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => parseInt(id, 10)) : undefined)),
});

export const getSurahTafsirsParamsSchema = z.object({
  chapterNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(114)),
});

export const getSurahTafsirsQuerySchema = z.object({
  language: z.string().optional(),
  tafsirs: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => parseInt(id, 10)) : undefined)),
});

export const getRecitationsQuerySchema = z.object({
  language: z.string().optional(),
});

export const getSurahRecitationParamsSchema = z.object({
  chapterNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(114)),
  recitationId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),
});

export const getJuzRecitationParamsSchema = z.object({
  juzNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(30)),
  recitationId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),
});

export const getAyahRecitationParamsSchema = z.object({
  ayahKey: z.string().regex(/^\d+:\d+$/, 'Ayah key must be in format chapter:verse'),
  recitationId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),
});