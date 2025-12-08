import z from 'zod';
import {
  getCollectionSchema,
  getBookSchema,
  getChaptersByBookSchema,
  getHadithsByBookSchema,
  getHadithsByBookQuerySchema,
  getHadithSchema,
} from '@/features/hadith';

export type GetCollectionDto = z.infer<typeof getCollectionSchema>;
export type GetBookDto = z.infer<typeof getBookSchema>;
export type GetChaptersByBookDto = z.infer<typeof getChaptersByBookSchema>;
export type GetHadithsByBookDto = z.infer<typeof getHadithsByBookSchema>;
export type GetHadithsByBookQueryDto = z.infer<typeof getHadithsByBookQuerySchema>;
export type GetHadithDto = z.infer<typeof getHadithSchema>;
