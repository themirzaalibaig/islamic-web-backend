import z from 'zod';

export const getCollectionSchema = z.object({
  collectionName: z.string(),
});

export const getBookSchema = z.object({
  collectionName: z.string(),
  bookNumber: z.string(),
});

export const getChaptersByBookSchema = z.object({
  collectionName: z.string(),
  bookNumber: z.string(),
});

export const getHadithsByBookSchema = z.object({
  collectionName: z.string(),
  bookNumber: z.string(),
});

export const getHadithsByBookQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export const getHadithSchema = z.object({
  collectionName: z.string(),
  hadithNumber: z.string(),
});
