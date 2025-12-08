export interface SubCollection {
  lang: string;
  title: boolean;
  shortIntro: number;
}

export interface Collection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  totalHadith: number;
  totalAvailableHadith: number;
  collection: SubCollection[];
}

export interface Book {
  bookNumber: string;
  hadithStartNumber: string;
  numberOfHadith: string;
  book: {
    lang: string;
    name: boolean;
  }[];
  totalAvailableHadith: number;
}

export interface ChapterInfo {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  intro: string;
  ending: string;
}

export interface Chapter {
  bookNumber: string;
  chapterId: string;
  chapter: ChapterInfo[];
}

export interface Grade {
  grade: string;
  name: string;
}

export interface GradeWithGradedBy {
  graded_by: string;
  grade: string;
}

export interface Reference {
  book: string;
  hadith: string;
}

export interface HadithInfo {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  body: string;
  grades?: Grade[];
  reference?: Reference;
}

export interface HadithInfoWithUrn {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  urn: number;
  body: string;
  grades?: GradeWithGradedBy[];
}

export interface Hadith {
  hadithNumber: string;
  hadith: HadithInfo[];
}

export interface RandomHadith {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: HadithInfoWithUrn[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}
