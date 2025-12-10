import { Request, Response } from 'express';
import { catchAsync, Res } from '@/utils';
import { TypedRequest } from '@/types';
import {
  getChapters,
  getChapter,
  getChapterInfo,
  getVersesByChapter,
  getVersesByJuz,
  getTranslations,
  getSurahTranslations,
  getTafsirs,
  getSurahTafsirs,
  getRecitations,
  getSurahRecitation,
  getJuzRecitation,
  getAyahRecitation,
} from '@/features/quran';
import {
  GetChaptersQueryDto,
  GetChapterParamsDto,
  GetChapterQueryDto,
  GetChapterInfoParamsDto,
  GetChapterInfoQueryDto,
  GetVersesByChapterParamsDto,
  GetVersesByChapterQueryDto,
  GetVersesByJuzParamsDto,
  GetVersesByJuzQueryDto,
  GetTafsirsQueryDto,
  GetSurahTranslationsParamsDto,
  GetSurahTranslationsQueryDto,
  GetSurahTafsirsParamsDto,
  GetSurahTafsirsQueryDto,
  GetRecitationsQueryDto,
  GetSurahRecitationParamsDto,
  GetJuzRecitationParamsDto,
  GetAyahRecitationParamsDto,
} from '@/features/quran/dto/quran.dto';

// Chapters
export const getChaptersController = catchAsync(
  async (req: TypedRequest<GetChaptersQueryDto>, res: Response) => {
    const { language } = req.query;
    const chapters = await getChapters(language);
    Res.success(res, { chapters });
  },
);

export const getChapterController = catchAsync(
  async (req: TypedRequest<GetChapterQueryDto, unknown, GetChapterParamsDto>, res: Response) => {
    const { id } = req.params;
    const { language } = req.query;
    const chapter = await getChapter(id, language);
    Res.success(res, { chapter });
  },
);

export const getChapterInfoController = catchAsync(
  async (
    req: TypedRequest<GetChapterInfoQueryDto, unknown, GetChapterInfoParamsDto>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { language } = req.query;
    const chapterInfo = await getChapterInfo(id, language);
    Res.success(res, { chapter_info: chapterInfo });
  },
);

// Verses
export const getVersesByChapterController = catchAsync(
  async (
    req: TypedRequest<GetVersesByChapterQueryDto, unknown, GetVersesByChapterParamsDto>,
    res: Response,
  ) => {
    const { chapterNumber } = req.params;
    const { language, words, translations, tafsirs, audio, page, per_page, offset, limit } =
      req.query;
    const verses = await getVersesByChapter(chapterNumber, {
      language,
      words,
      translations,
      tafsirs,
      audio,
      page,
      per_page,
      offset,
      limit,
    });
    Res.success(res, { verses });
  },
);

export const getVersesByJuzController = catchAsync(
  async (
    req: TypedRequest<GetVersesByJuzQueryDto, unknown, GetVersesByJuzParamsDto>,
    res: Response,
  ) => {
    const { juzNumber } = req.params;
    const { language, words, translations, tafsirs, audio, page, per_page } = req.query;
    const verses = await getVersesByJuz(juzNumber, {
      language,
      words,
      translations,
      tafsirs,
      audio,
      page,
      per_page,
    });
    Res.success(res, { verses });
  },
);

// Translations
export const getTranslationsController = catchAsync(async (req: Request, res: Response) => {
  const translations = await getTranslations();
  Res.success(res, { translations });
});

export const getSurahTranslationsController = catchAsync(
  async (
    req: TypedRequest<GetSurahTranslationsQueryDto, unknown, GetSurahTranslationsParamsDto>,
    res: Response,
  ) => {
    const { chapterNumber } = req.params;
    const { language, translations } = req.query;
    const surahTranslations = await getSurahTranslations(chapterNumber, {
      language,
      translations,
    });
    Res.success(res, { translations: surahTranslations });
  },
);

// Tafsirs
export const getTafsirsController = catchAsync(
  async (req: TypedRequest<GetTafsirsQueryDto>, res: Response) => {
    const { language } = req.query;
    const tafsirs = await getTafsirs(language);
    Res.success(res, { tafsirs });
  },
);

export const getSurahTafsirsController = catchAsync(
  async (
    req: TypedRequest<GetSurahTafsirsQueryDto, unknown, GetSurahTafsirsParamsDto>,
    res: Response,
  ) => {
    const { chapterNumber } = req.params;
    const { language, tafsirs } = req.query;
    const surahTafsirs = await getSurahTafsirs(chapterNumber, {
      language,
      tafsirs,
    });
    Res.success(res, { tafsirs: surahTafsirs });
  },
);

// Recitations
export const getRecitationsController = catchAsync(
  async (req: TypedRequest<GetRecitationsQueryDto>, res: Response) => {
    const { language } = req.query;
    const recitations = await getRecitations(language);
    Res.success(res, { recitations });
  },
);

export const getSurahRecitationController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetSurahRecitationParamsDto>, res: Response) => {
    const { chapterNumber, recitationId } = req.params;
    const audioFiles = await getSurahRecitation(chapterNumber, recitationId);
    Res.success(res, { audio_files: audioFiles });
  },
);

export const getJuzRecitationController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetJuzRecitationParamsDto>, res: Response) => {
    const { juzNumber, recitationId } = req.params;
    const audioFiles = await getJuzRecitation(juzNumber, recitationId);
    Res.success(res, { audio_files: audioFiles });
  },
);

export const getAyahRecitationController = catchAsync(
  async (req: TypedRequest<unknown, unknown, GetAyahRecitationParamsDto>, res: Response) => {
    const { ayahKey, recitationId } = req.params;
    const audioFile = await getAyahRecitation(ayahKey, recitationId);
    Res.success(res, { audio_file: audioFile });
  },
);
