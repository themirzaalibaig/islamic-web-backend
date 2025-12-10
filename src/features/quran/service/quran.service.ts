import {
  GetVersesByChapterParamsDto,
  GetChapterQueryDto,
  GetChapterInfoQueryDto,
} from './../dto/quran.dto';
import {
  GetChapterInfoParamsDto,
  GetChapterParamsDto,
  GetChaptersQueryDto,
  GetVersesByChapterQueryDto,
} from '@/features/quran/dto/quran.dto';
import {
  Chapter,
  ChapterInfo,
  Translation,
  Tafsir,
  Recitation,
  Verse,
  TranslationText,
  TafsirText,
  RecitationAudio,
} from '@/features/quran/type/quran.type';
import { logger } from '@/utils/logger.util';
import { cacheGet, cacheSet, makeKey } from '@/utils/redis.util';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.quran.com/api/v4/',
});

// Chapters
export const getChapters = async ({ language }: GetChaptersQueryDto) => {
  try {
    const cacheKey = makeKey('chapters', language);
    const cached = (await cacheGet(cacheKey)) as Chapter[] | undefined;
    if (cached) return cached;
    const { data } = await api.get<{ chapters: Chapter[] }>('chapters', { params: { language } });
    cacheSet(cacheKey, data.chapters, 30 * 24 * 60 * 60 * 1000);
    return data.chapters;
  } catch (error) {
    logger.error(error, 'Failed to fetch chapters');
    throw new Error('Failed to fetch chapters');
  }
};

export const getChapter = async (
  id: GetChapterParamsDto['id'],
  { language }: GetChapterQueryDto,
) => {
  try {
    const cacheKey = makeKey('chapter', id.toString(), language);
    const cached = (await cacheGet(cacheKey)) as { chapter: Chapter } | undefined;
    if (cached) return cached.chapter;

    const params = { language };
    const { data } = await api.get<{ chapter: Chapter }>(`chapters/${id}`, { params });
    cacheSet(cacheKey, data, 30 * 24 * 60 * 60 * 1000);
    return data.chapter;
  } catch (error) {
    logger.error(error, `Failed to fetch chapter ${id}`);
    throw new Error(`Failed to fetch chapter ${id}`);
  }
};

export const getChapterInfo = async (
  id: GetChapterInfoParamsDto['id'],
  { language }: GetChapterInfoQueryDto,
) => {
  try {
    const cacheKey = makeKey('chapter-info', id.toString(), language);
    const cached = (await cacheGet(cacheKey)) as { chapter_info: ChapterInfo } | undefined;
    if (cached) return cached.chapter_info;

    const params = { language };
    const { data } = await api.get<{ chapter_info: ChapterInfo }>(`chapters/${id}/info`, {
      params,
    });
    cacheSet(cacheKey, data, 7 * 24 * 60 * 60 * 1000);
    return data.chapter_info;
  } catch (error) {
    logger.error(error, `Failed to fetch chapter info ${id}`);
    throw new Error(`Failed to fetch chapter info ${id}`);
  }
};

// Verses
export const getVersesByChapter = async (
  chapterNumber: GetVersesByChapterParamsDto['chapterNumber'],
  dto: GetVersesByChapterQueryDto,
) => {
  try {
    logger.info(`Fetching verses for chapter ${chapterNumber} with params: ${JSON.stringify(dto)}`);

    const cacheKey = makeKey('verses-chapter', chapterNumber.toString(), JSON.stringify(dto));
    const cached = (await cacheGet(cacheKey)) as { verses: Verse[] } | undefined;
    if (cached) return cached.verses;

    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_chapter/${chapterNumber}`, {
      params: {
        fields: 'text_uthmani,text_indopak,verse_key,verse_number,sura_number,text_uthmani_tajweed',
        ...dto,
      },
    });
    cacheSet(cacheKey, data, 7 * 24 * 60 * 60 * 1000);
    return data.verses;
  } catch (error: any) {
    logger.error(error, `Failed to fetch verses for chapter ${chapterNumber}`);
    throw new Error(`Failed to fetch verses for chapter ${chapterNumber}`);
  }
};

export const getVersesByJuz = async (
  juzNumber: number,
  options?: {
    language?: string;
    words?: boolean;
    translations?: number[];
    tafsirs?: number[];
    audio?: number;
    page?: number;
    per_page?: number;
  },
) => {
  try {
    const params: Record<string, any> = {};
    if (options?.language) params.language = options.language;
    if (options?.words !== undefined) params.words = options.words;
    if (options?.translations && Array.isArray(options.translations)) {
      params.translations = options.translations.join(',');
    }
    if (options?.tafsirs && Array.isArray(options.tafsirs)) {
      params.tafsirs = options.tafsirs.join(',');
    }
    if (options?.audio) params.audio = options.audio;
    if (options?.page) params.page = options.page;
    if (options?.per_page) params.per_page = options.per_page;

    const cacheKey = makeKey('verses-juz', juzNumber.toString(), JSON.stringify(params));
    const cached = (await cacheGet(cacheKey)) as { verses: Verse[] } | undefined;
    if (cached) return cached.verses;

    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_juz/${juzNumber}`, { params });

    // Ensure verses array exists
    if (!data || !data.verses || !Array.isArray(data.verses)) {
      throw new Error(`Invalid response format for juz ${juzNumber}`);
    }

    cacheSet(cacheKey, data, 7 * 24 * 60 * 60 * 1000);
    return data.verses;
  } catch (error: any) {
    logger.error(error, `Failed to fetch verses for juz ${juzNumber}`);
    if (error.response) {
      logger.error(
        { status: error.response.status, data: error.response.data },
        `API error for juz ${juzNumber}`,
      );
      throw new Error(
        `Failed to fetch verses for juz ${juzNumber}: ${error.response.data?.message || error.response.statusText}`,
      );
    }
    throw new Error(`Failed to fetch verses for juz ${juzNumber}: ${error.message}`);
  }
};

// Translations
export const getTranslations = async () => {
  try {
    const cacheKey = makeKey('translations');
    const cached = (await cacheGet(cacheKey)) as Translation[] | undefined;
    if (cached) return cached;
    const { data } = await api.get<{ translations: Translation[] }>('resources/translations');
    cacheSet(cacheKey, data.translations, 30 * 24 * 60 * 60 * 1000);
    return data.translations;
  } catch (error) {
    logger.error(error, 'Failed to fetch translations');
    throw new Error('Failed to fetch translations');
  }
};

export const getSurahTranslations = async (
  chapterNumber: number,
  options?: {
    language?: string;
    translations?: number[];
  },
) => {
  try {
    // Get verses with translations - translations are included in verse responses
    const params: Record<string, any> = {};
    if (options?.language) params.language = options.language;
    if (options?.translations && Array.isArray(options.translations)) {
      params.translations = options.translations.join(',');
    }

    const cacheKey = makeKey(
      'surah-translations',
      chapterNumber.toString(),
      JSON.stringify(params),
    );
    const cached = (await cacheGet(cacheKey)) as TranslationText[] | undefined;
    if (cached) return cached;

    // Fetch verses with translations and extract translations
    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_chapter/${chapterNumber}`, {
      params,
    });

    // Ensure verses array exists
    if (!data || !data.verses || !Array.isArray(data.verses)) {
      throw new Error(`Invalid response format for chapter ${chapterNumber}`);
    }

    // Extract translations from verses
    // Note: Translations may not always be present in the response even when requested
    const translations: TranslationText[] = [];
    data.verses.forEach((verse) => {
      if (verse.translations && Array.isArray(verse.translations)) {
        translations.push(...verse.translations);
      }
    });

    // If no translations found, return empty array instead of error
    cacheSet(cacheKey, translations, 7 * 24 * 60 * 60 * 1000);
    return translations;
  } catch (error: any) {
    logger.error(error, `Failed to fetch translations for chapter ${chapterNumber}`);
    if (error.response) {
      logger.error(
        { status: error.response.status, data: error.response.data },
        `API error for chapter translations ${chapterNumber}`,
      );
      throw new Error(
        `Failed to fetch translations for chapter ${chapterNumber}: ${error.response.data?.message || error.response.statusText}`,
      );
    }
    throw new Error(`Failed to fetch translations for chapter ${chapterNumber}: ${error.message}`);
  }
};

// Tafsirs
export const getTafsirs = async (language?: string) => {
  try {
    const cacheKey = makeKey('tafsirs', language || 'en');
    const cached = (await cacheGet(cacheKey)) as Tafsir[] | undefined;
    if (cached) return cached;

    const params = language ? { language } : {};
    const { data } = await api.get<{ tafsirs: Tafsir[] }>('resources/tafsirs', { params });
    cacheSet(cacheKey, data.tafsirs, 30 * 24 * 60 * 60 * 1000);
    return data.tafsirs;
  } catch (error) {
    logger.error(error, 'Failed to fetch tafsirs');
    throw new Error('Failed to fetch tafsirs');
  }
};

export const getSurahTafsirs = async (
  chapterNumber: number,
  options?: {
    language?: string;
    tafsirs?: number[];
  },
) => {
  try {
    // Get verses with tafsirs - tafsirs are included in verse responses
    const params: Record<string, any> = {};
    if (options?.language) params.language = options.language;
    if (options?.tafsirs && Array.isArray(options.tafsirs)) {
      params.tafsirs = options.tafsirs.join(',');
    }

    const cacheKey = makeKey('surah-tafsirs', chapterNumber.toString(), JSON.stringify(params));
    const cached = (await cacheGet(cacheKey)) as TafsirText[] | undefined;
    if (cached) return cached;

    // Fetch verses with tafsirs and extract tafsirs
    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_chapter/${chapterNumber}`, {
      params,
    });

    // Ensure verses array exists
    if (!data || !data.verses || !Array.isArray(data.verses)) {
      throw new Error(`Invalid response format for chapter ${chapterNumber}`);
    }

    // Extract tafsirs from verses
    // Note: Tafsirs may not always be present in the response even when requested
    const tafsirs: TafsirText[] = [];
    data.verses.forEach((verse) => {
      if (verse.tafsirs && Array.isArray(verse.tafsirs)) {
        tafsirs.push(...verse.tafsirs);
      }
    });

    // If no tafsirs found, return empty array instead of error
    cacheSet(cacheKey, tafsirs, 7 * 24 * 60 * 60 * 1000);
    return tafsirs;
  } catch (error: any) {
    logger.error(error, `Failed to fetch tafsirs for chapter ${chapterNumber}`);
    if (error.response) {
      logger.error(
        { status: error.response.status, data: error.response.data },
        `API error for chapter tafsirs ${chapterNumber}`,
      );
      throw new Error(
        `Failed to fetch tafsirs for chapter ${chapterNumber}: ${error.response.data?.message || error.response.statusText}`,
      );
    }
    throw new Error(`Failed to fetch tafsirs for chapter ${chapterNumber}: ${error.message}`);
  }
};

// Recitations
export const getRecitations = async (language?: string) => {
  try {
    const cacheKey = makeKey('recitations', language || 'en');
    const cached = (await cacheGet(cacheKey)) as Recitation[] | undefined;
    if (cached) return cached;

    const params = language ? { language } : {};
    const { data } = await api.get<{ recitations: Recitation[] }>('resources/recitations', {
      params,
    });
    cacheSet(cacheKey, data.recitations, 30 * 24 * 60 * 60 * 1000);
    return data.recitations;
  } catch (error) {
    logger.error(error, 'Failed to fetch recitations');
    throw new Error('Failed to fetch recitations');
  }
};

export const getSurahRecitation = async (chapterNumber: number, recitationId: number) => {
  try {
    // Get verses with audio - audio is included in verse responses
    const cacheKey = makeKey('surah-recitation', chapterNumber.toString(), recitationId.toString());
    const cached = (await cacheGet(cacheKey)) as RecitationAudio[] | undefined;
    if (cached) return cached;

    // Fetch verses with audio
    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_chapter/${chapterNumber}`, {
      params: { audio: recitationId },
    });

    // Extract audio from verses
    const audioFiles: RecitationAudio[] = [];
    data.verses.forEach((verse) => {
      if (verse.audio) {
        audioFiles.push({
          audio_url: verse.audio.url,
          duration: verse.audio.duration,
          format: verse.audio.format,
          segments: verse.audio.segments,
        });
      }
    });

    cacheSet(cacheKey, audioFiles, 7 * 24 * 60 * 60 * 1000);
    return audioFiles;
  } catch (error: any) {
    logger.error(error, `Failed to fetch recitation for chapter ${chapterNumber}`);
    if (error.response) {
      logger.error(
        { status: error.response.status, data: error.response.data },
        `API error for chapter recitation ${chapterNumber}`,
      );
      throw new Error(
        `Failed to fetch recitation for chapter ${chapterNumber}: ${error.response.data?.message || error.response.statusText}`,
      );
    }
    throw new Error(`Failed to fetch recitation for chapter ${chapterNumber}: ${error.message}`);
  }
};

export const getJuzRecitation = async (juzNumber: number, recitationId: number) => {
  try {
    // Get verses with audio - audio is included in verse responses
    const cacheKey = makeKey('juz-recitation', juzNumber.toString(), recitationId.toString());
    const cached = (await cacheGet(cacheKey)) as RecitationAudio[] | undefined;
    if (cached) return cached;

    // Fetch verses with audio
    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_juz/${juzNumber}`, {
      params: { audio: recitationId },
    });

    // Extract audio from verses
    const audioFiles: RecitationAudio[] = [];
    data.verses.forEach((verse) => {
      if (verse.audio) {
        audioFiles.push({
          audio_url: verse.audio.url,
          duration: verse.audio.duration,
          format: verse.audio.format,
          segments: verse.audio.segments,
        });
      }
    });

    cacheSet(cacheKey, audioFiles, 7 * 24 * 60 * 60 * 1000);
    return audioFiles;
  } catch (error: any) {
    logger.error(error, `Failed to fetch recitation for juz ${juzNumber}`);
    if (error.response) {
      logger.error(
        { status: error.response.status, data: error.response.data },
        `API error for juz recitation ${juzNumber}`,
      );
      throw new Error(
        `Failed to fetch recitation for juz ${juzNumber}: ${error.response.data?.message || error.response.statusText}`,
      );
    }
    throw new Error(`Failed to fetch recitation for juz ${juzNumber}: ${error.message}`);
  }
};

export const getAyahRecitation = async (ayahKey: string, recitationId: number) => {
  try {
    // Parse chapter and verse from ayahKey (format: "1:1")
    const [chapterNumber, verseNumber] = ayahKey.split(':').map(Number);

    const cacheKey = makeKey('ayah-recitation', ayahKey, recitationId.toString());
    const cached = (await cacheGet(cacheKey)) as RecitationAudio | undefined;
    if (cached) return cached;

    // Fetch verses with audio for the specific chapter
    const { data } = await api.get<{ verses: Verse[] }>(`verses/by_chapter/${chapterNumber}`, {
      params: { audio: recitationId },
    });

    // Find the specific verse by verse_number
    const verse = data.verses.find((v) => v.verse_number === verseNumber);
    if (!verse || !verse.audio) {
      throw new Error(`Audio not found for ayah ${ayahKey}`);
    }

    const audioFile: RecitationAudio = {
      audio_url: verse.audio.url,
      duration: verse.audio.duration,
      format: verse.audio.format,
      segments: verse.audio.segments,
    };

    cacheSet(cacheKey, audioFile, 7 * 24 * 60 * 60 * 1000);
    return audioFile;
  } catch (error: any) {
    logger.error(error, `Failed to fetch recitation for ayah ${ayahKey}`);
    if (error.response) {
      logger.error(
        { status: error.response.status, data: error.response.data },
        `API error for ayah recitation ${ayahKey}`,
      );
      throw new Error(
        `Failed to fetch recitation for ayah ${ayahKey}: ${error.response.data?.message || error.response.statusText}`,
      );
    }
    throw new Error(`Failed to fetch recitation for ayah ${ayahKey}: ${error.message}`);
  }
};
