export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface ChapterInfo {
  chapter_id: number;
  text: string;
  short_text: string;
  source: string;
  language_name: string;
}

export interface Word {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: string;
  code_v1: string;
  code_v2: string;
  page_number: number;
  line_number: number;
  text: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_type?: string | null;
  sajdah_number?: number | null;
  page_number: number;
  text_uthmani?: string;
  text_indopak?: string;
  text_simple?: string;
  words?: Word[];
  translations?: TranslationText[];
  tafsirs?: TafsirText[];
  audio?: {
    url: string;
    duration: number;
    format: string;
    segments: number[][];
  };
}

export interface TranslationText {
  id: number;
  resource_id: number;
  resource_name: string;
  text: string;
  language_name: string;
}

export interface TafsirText {
  id: number;
  resource_id: number;
  resource_name: string;
  text: string;
  language_name: string;
}

export interface Translation {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface Tafsir {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface Recitation {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface RecitationAudio {
  audio_url: string;
  duration: number;
  format: string;
  segments: number[][];
}
