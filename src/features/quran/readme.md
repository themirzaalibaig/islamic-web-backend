# Quran API Documentation

Complete API documentation for the Quran feature with full TypeScript type safety, translations, tafsirs, and recitations.

## Base URL

All endpoints are prefixed with `/api/quran`:

```
Base URL: /api/quran
```

## Authentication

**All endpoints require authentication.** You must include the authentication cookie (`accessToken`) in your requests.

## TypeScript Types

### Core Types

```typescript
// Chapter Type
interface Chapter {
  id: number; // 1-114
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string; // e.g., "Al-Fatihah"
  name_complex: string; // e.g., "Al-Fātiĥah"
  name_arabic: string; // e.g., "الفاتحة"
  verses_count: number;
  pages: [number, number]; // [start_page, end_page]
  translated_name: {
    language_name: string;
    name: string; // e.g., "The Opener"
  };
}

// Chapter Info Type
interface ChapterInfo {
  chapter_id: number;
  text: string;
  short_text: string;
  source: string;
  language_name: string;
}

// Word Type (for word-by-word analysis)
interface Word {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: string;
  code_v1: string;
  code_v2: string;
  page_number: number;
  line_number: number;
  text: string; // Arabic text
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

// Verse Type
interface Verse {
  id: number;
  verse_number: number;
  verse_key: string; // Format: "1:1" (chapter:verse)
  juz_number: number; // 1-30
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_type?: string | null; // "recommended" | "obligatory" | null
  sajdah_number?: number | null;
  page_number: number;
  text_uthmani?: string; // Uthmani script
  text_indopak?: string; // Indo-Pak script
  text_simple?: string; // Simple Arabic text
  words?: Word[]; // Word-by-word breakdown
  translations?: TranslationText[];
  tafsirs?: TafsirText[];
  audio?: {
    url: string;
    duration: number;
    format: string;
    segments: number[][];
  };
}

// Translation Text Type
interface TranslationText {
  id: number;
  resource_id: number;
  resource_name: string;
  text: string;
  language_name: string;
}

// Tafsir Text Type
interface TafsirText {
  id: number;
  resource_id: number;
  resource_name: string;
  text: string;
  language_name: string;
}

// Translation Resource Type
interface Translation {
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

// Tafsir Resource Type
interface Tafsir {
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

// Recitation Type
interface Recitation {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

// Recitation Audio Type
interface RecitationAudio {
  audio_url: string;
  duration: number;
  format: string;
  segments: number[][];
}

// API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ValidationError[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  timestamp: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}
```

## API Endpoints

### 1. List All Chapters

Get a list of all 114 chapters (Surahs) of the Quran.

**Endpoint:** `GET /api/quran/chapters`

**Query Parameters:**

- `language` (optional, string, default: `"en"`): Language code for translated chapter names

**Example Request:**

```typescript
// Fetch chapters in English
const response = await fetch('/api/quran/chapters?language=en', {
  credentials: 'include', // Include auth cookie
});

// Fetch chapters in Arabic
const response = await fetch('/api/quran/chapters?language=ar', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "chapters": [
      {
        "id": 1,
        "revelation_place": "makkah",
        "revelation_order": 5,
        "bismillah_pre": false,
        "name_simple": "Al-Fatihah",
        "name_complex": "Al-Fātiĥah",
        "name_arabic": "الفاتحة",
        "verses_count": 7,
        "pages": [1, 1],
        "translated_name": {
          "language_name": "english",
          "name": "The Opener"
        }
      }
      // ... 113 more chapters
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage Example:**

```typescript
async function getChapters(language: string = 'en') {
  const response = await fetch(`/api/quran/chapters?language=${language}`, {
    credentials: 'include',
  });
  const result: ApiResponse<{ chapters: Chapter[] }> = await response.json();
  return result.data.chapters;
}

// Usage
const chapters = await getChapters('en');
chapters.forEach((chapter) => {
  console.log(`${chapter.id}. ${chapter.name_simple} - ${chapter.translated_name.name}`);
});
```

---

### 2. Get Single Chapter

Get detailed information about a specific chapter.

**Endpoint:** `GET /api/quran/chapters/:id`

**Path Parameters:**

- `id` (required, number): Chapter ID (1-114)

**Query Parameters:**

- `language` (optional, string, default: `"en"`): Language code

**Example Request:**

```typescript
const response = await fetch('/api/quran/chapters/1?language=en', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "chapter": {
      "id": 1,
      "revelation_place": "makkah",
      "revelation_order": 5,
      "bismillah_pre": false,
      "name_simple": "Al-Fatihah",
      "name_complex": "Al-Fātiĥah",
      "name_arabic": "الفاتحة",
      "verses_count": 7,
      "pages": [1, 1],
      "translated_name": {
        "language_name": "english",
        "name": "The Opener"
      }
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Get Chapter Info

Get additional information about a chapter (description, revelation period, etc.).

**Endpoint:** `GET /api/quran/chapters/:id/info`

**Path Parameters:**

- `id` (required, number): Chapter ID (1-114)

**Query Parameters:**

- `language` (optional, string, default: `"en"`): Language code

**Example Request:**

```typescript
const response = await fetch('/api/quran/chapters/1/info?language=en', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "chapter_info": {
      "chapter_id": 1,
      "text": "Al-Fatihah is the first chapter of the Quran...",
      "short_text": "The Opening",
      "source": "https://quran.com",
      "language_name": "english"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Get Verses by Chapter

Get all verses from a specific chapter with optional translations, tafsirs, audio, and word-by-word analysis.

**Endpoint:** `GET /api/quran/verses/chapter/:chapterNumber`

**Path Parameters:**

- `chapterNumber` (required, number): Chapter number (1-114)

**Query Parameters:**

- `language` (optional, string): Language code for word translations
- `words` (optional, boolean): Include word-by-word breakdown
- `translations` (optional, string): Comma-separated translation IDs (e.g., "131,85")
- `tafsirs` (optional, string): Comma-separated tafsir IDs (e.g., "169,168")
- `audio` (optional, number): Recitation ID to include audio
- `page` (optional, number): Page number for pagination
- `per_page` (optional, number): Items per page (max: 50)
- `offset` (optional, number): Offset for pagination
- `limit` (optional, number): Limit number of verses

**Example Request:**

```typescript
// Get verses with translations and word-by-word analysis
const response = await fetch(
  '/api/quran/verses/chapter/1?words=true&translations=131,85&language=en',
  { credentials: 'include' },
);

// Get verses with tafsir and audio
const response = await fetch('/api/quran/verses/chapter/1?tafsirs=169&audio=1', {
  credentials: 'include',
});

// Get paginated verses
const response = await fetch('/api/quran/verses/chapter/1?page=1&per_page=10', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "verses": [
      {
        "id": 1,
        "verse_number": 1,
        "verse_key": "1:1",
        "juz_number": 1,
        "hizb_number": 1,
        "rub_el_hizb_number": 1,
        "ruku_number": 1,
        "manzil_number": 1,
        "sajdah_type": null,
        "page_number": 1,
        "text_uthmani": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        "text_simple": "بسم الله الرحمن الرحيم",
        "words": [
          {
            "id": 1,
            "position": 1,
            "text": "بِسْمِ",
            "translation": { "text": "In (the) name", "language_name": "english" },
            "transliteration": { "text": "bismi", "language_name": "english" }
          }
          // ... more words
        ],
        "translations": [
          {
            "id": 131,
            "resource_id": 131,
            "resource_name": "Sahih International",
            "text": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
            "language_name": "english"
          }
        ],
        "tafsirs": [
          {
            "id": 169,
            "resource_id": 169,
            "resource_name": "Ibn Kathir",
            "text": "In the Name of Allah, the Most Gracious, the Most Merciful...",
            "language_name": "english"
          }
        ],
        "audio": {
          "url": "https://...",
          "duration": 5.2,
          "format": "mp3",
          "segments": [[0, 5.2]]
        }
      }
      // ... more verses
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage Example:**

```typescript
interface VerseOptions {
  language?: string;
  words?: boolean;
  translations?: number[];
  tafsirs?: number[];
  audio?: number;
  page?: number;
  per_page?: number;
}

async function getVersesByChapter(chapterNumber: number, options: VerseOptions = {}) {
  const params = new URLSearchParams();
  if (options.language) params.append('language', options.language);
  if (options.words) params.append('words', 'true');
  if (options.translations) params.append('translations', options.translations.join(','));
  if (options.tafsirs) params.append('tafsirs', options.tafsirs.join(','));
  if (options.audio) params.append('audio', options.audio.toString());
  if (options.page) params.append('page', options.page.toString());
  if (options.per_page) params.append('per_page', options.per_page.toString());

  const response = await fetch(`/api/quran/verses/chapter/${chapterNumber}?${params.toString()}`, {
    credentials: 'include',
  });
  const result: ApiResponse<{ verses: Verse[] }> = await response.json();
  return result.data.verses;
}

// Usage
const verses = await getVersesByChapter(1, {
  words: true,
  translations: [131, 85],
  language: 'en',
});
```

---

### 5. Get Verses by Juz

Get all verses from a specific Juz (one of the 30 parts of the Quran).

**Endpoint:** `GET /api/quran/verses/juz/:juzNumber`

**Path Parameters:**

- `juzNumber` (required, number): Juz number (1-30)

**Query Parameters:**

- `language` (optional, string): Language code
- `words` (optional, boolean): Include word-by-word breakdown
- `translations` (optional, string): Comma-separated translation IDs
- `tafsirs` (optional, string): Comma-separated tafsir IDs
- `audio` (optional, number): Recitation ID
- `page` (optional, number): Page number
- `per_page` (optional, number): Items per page (max: 50)

**Example Request:**

```typescript
const response = await fetch('/api/quran/verses/juz/1?translations=131&words=true', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "verses": [
      // ... verses from Juz 1
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 6. List All Translations

Get a list of all available translation resources.

**Endpoint:** `GET /api/quran/translations`

**Example Request:**

```typescript
const response = await fetch('/api/quran/translations', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "translations": [
      {
        "id": 131,
        "name": "Sahih International",
        "author_name": "Sahih International",
        "slug": "sahih-international",
        "language_name": "english",
        "translated_name": {
          "name": "Sahih International",
          "language_name": "english"
        }
      }
      // ... more translations
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage Example:**

```typescript
async function getTranslations() {
  const response = await fetch('/api/quran/translations', {
    credentials: 'include',
  });
  const result: ApiResponse<{ translations: Translation[] }> = await response.json();
  return result.data.translations;
}

// Filter by language
const englishTranslations = (await getTranslations()).filter((t) => t.language_name === 'english');
```

---

### 7. Get Chapter Translations

Get translations for all verses in a specific chapter.

**Endpoint:** `GET /api/quran/chapters/:chapterNumber/translations`

**Path Parameters:**

- `chapterNumber` (required, number): Chapter number (1-114)

**Query Parameters:**

- `language` (optional, string): Language code
- `translations` (optional, string): Comma-separated translation IDs

**Example Request:**

```typescript
const response = await fetch('/api/quran/chapters/1/translations?translations=131,85', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "translations": [
      {
        "id": 131,
        "resource_id": 131,
        "resource_name": "Sahih International",
        "text": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        "language_name": "english"
      }
      // ... more translations
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 8. List All Tafsirs

Get a list of all available tafsir (exegesis) resources.

**Endpoint:** `GET /api/quran/tafsirs`

**Query Parameters:**

- `language` (optional, string): Language code

**Example Request:**

```typescript
const response = await fetch('/api/quran/tafsirs?language=en', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "tafsirs": [
      {
        "id": 169,
        "name": "Ibn Kathir",
        "author_name": "Ibn Kathir",
        "slug": "ibn-kathir",
        "language_name": "english",
        "translated_name": {
          "name": "Ibn Kathir",
          "language_name": "english"
        }
      }
      // ... more tafsirs
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 9. Get Chapter Tafsirs

Get tafsir (exegesis) for all verses in a specific chapter.

**Endpoint:** `GET /api/quran/chapters/:chapterNumber/tafsirs`

**Path Parameters:**

- `chapterNumber` (required, number): Chapter number (1-114)

**Query Parameters:**

- `language` (optional, string): Language code
- `tafsirs` (optional, string): Comma-separated tafsir IDs

**Example Request:**

```typescript
const response = await fetch('/api/quran/chapters/1/tafsirs?tafsirs=169', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "tafsirs": [
      {
        "id": 169,
        "resource_id": 169,
        "resource_name": "Ibn Kathir",
        "text": "In the Name of Allah, the Most Gracious, the Most Merciful...",
        "language_name": "english"
      }
      // ... more tafsirs
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 10. List All Recitations

Get a list of all available recitation resources (Qaris/Reciters).

**Endpoint:** `GET /api/quran/recitations`

**Query Parameters:**

- `language` (optional, string): Language code

**Example Request:**

```typescript
const response = await fetch('/api/quran/recitations?language=en', {
  credentials: 'include',
});
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "recitations": [
      {
        "id": 1,
        "reciter_name": "Abdul Basit",
        "style": "Murattal",
        "translated_name": {
          "name": "Abdul Basit",
          "language_name": "english"
        }
      }
      // ... more recitations
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 11. Get Chapter Recitation

Get audio recitation files for all verses in a specific chapter.

**Endpoint:** `GET /api/quran/chapters/:chapterNumber/recitations/:recitationId`

**Path Parameters:**

- `chapterNumber` (required, number): Chapter number (1-114)
- `recitationId` (required, number): Recitation ID

**Example Request:**

```typescript
const response = await fetch('/api/quran/chapters/1/recitations/1', { credentials: 'include' });
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "audio_files": [
      {
        "audio_url": "https://...",
        "duration": 5.2,
        "format": "mp3",
        "segments": [[0, 5.2]]
      }
      // ... more audio files
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage Example:**

```typescript
async function getChapterRecitation(chapterNumber: number, recitationId: number) {
  const response = await fetch(`/api/quran/chapters/${chapterNumber}/recitations/${recitationId}`, {
    credentials: 'include',
  });
  const result: ApiResponse<{ audio_files: RecitationAudio[] }> = await response.json();
  return result.data.audio_files;
}

// Usage
const audioFiles = await getChapterRecitation(1, 1);
audioFiles.forEach((audio, index) => {
  console.log(`Verse ${index + 1}: ${audio.audio_url}`);
});
```

---

### 12. Get Juz Recitation

Get audio recitation files for all verses in a specific Juz.

**Endpoint:** `GET /api/quran/juzs/:juzNumber/recitations/:recitationId`

**Path Parameters:**

- `juzNumber` (required, number): Juz number (1-30)
- `recitationId` (required, number): Recitation ID

**Example Request:**

```typescript
const response = await fetch('/api/quran/juzs/1/recitations/1', { credentials: 'include' });
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "audio_files": [
      {
        "audio_url": "https://...",
        "duration": 120.5,
        "format": "mp3",
        "segments": [[0, 120.5]]
      }
      // ... more audio files
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 13. Get Ayah (Verse) Recitation

Get audio recitation file for a specific verse.

**Endpoint:** `GET /api/quran/verses/:ayahKey/recitations/:recitationId`

**Path Parameters:**

- `ayahKey` (required, string): Verse key in format "chapter:verse" (e.g., "1:1")
- `recitationId` (required, number): Recitation ID

**Example Request:**

```typescript
const response = await fetch('/api/quran/verses/1:1/recitations/1', { credentials: 'include' });
```

**Example Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "audio_file": {
      "audio_url": "https://...",
      "duration": 5.2,
      "format": "mp3",
      "segments": [[0, 5.2]]
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage Example:**

```typescript
async function playVerseAudio(verseKey: string, recitationId: number) {
  const response = await fetch(`/api/quran/verses/${verseKey}/recitations/${recitationId}`, {
    credentials: 'include',
  });
  const result: ApiResponse<{ audio_file: RecitationAudio }> = await response.json();

  const audio = new Audio(result.data.audio_file.audio_url);
  audio.play();
}

// Usage
playVerseAudio('1:1', 1);
```

---

## Complete Usage Examples

### Example 1: Display Chapter with Verses, Translations, and Audio

```typescript
async function displayChapter(chapterId: number) {
  // 1. Get chapter info
  const chapterRes = await fetch(`/api/quran/chapters/${chapterId}?language=en`, {
    credentials: 'include',
  });
  const chapterData: ApiResponse<{ chapter: Chapter }> = await chapterRes.json();
  const chapter = chapterData.data.chapter;

  // 2. Get verses with translations and word-by-word
  const versesRes = await fetch(
    `/api/quran/verses/chapter/${chapterId}?words=true&translations=131&language=en`,
    { credentials: 'include' },
  );
  const versesData: ApiResponse<{ verses: Verse[] }> = await versesRes.json();
  const verses = versesData.data.verses;

  // 3. Get recitations list
  const recitationsRes = await fetch('/api/quran/recitations?language=en', {
    credentials: 'include',
  });
  const recitationsData: ApiResponse<{ recitations: Recitation[] }> = await recitationsRes.json();
  const recitations = recitationsData.data.recitations;

  return {
    chapter,
    verses,
    recitations,
  };
}

// Usage
const { chapter, verses, recitations } = await displayChapter(1);
console.log(`Chapter: ${chapter.name_simple}`);
verses.forEach((verse) => {
  console.log(`Verse ${verse.verse_number}: ${verse.text_simple}`);
  if (verse.translations) {
    console.log(`Translation: ${verse.translations[0].text}`);
  }
});
```

### Example 2: Build a Quran Reader Component

```typescript
interface QuranReaderProps {
  chapterId: number;
  translationIds?: number[];
  showWords?: boolean;
  showTafsir?: boolean;
}

async function QuranReader({
  chapterId,
  translationIds = [131],
  showWords = false,
  showTafsir = false,
}: QuranReaderProps) {
  // Build query params
  const params = new URLSearchParams();
  if (translationIds.length > 0) {
    params.append('translations', translationIds.join(','));
  }
  if (showWords) {
    params.append('words', 'true');
    params.append('language', 'en');
  }
  if (showTafsir) {
    params.append('tafsirs', '169'); // Ibn Kathir
  }

  const response = await fetch(`/api/quran/verses/chapter/${chapterId}?${params.toString()}`, {
    credentials: 'include',
  });
  const result: ApiResponse<{ verses: Verse[] }> = await response.json();
  return result.data.verses;
}
```

### Example 3: Audio Player with Multiple Reciters

```typescript
async function setupAudioPlayer(chapterId: number) {
  // Get available recitations
  const recitationsRes = await fetch('/api/quran/recitations?language=en', {
    credentials: 'include',
  });
  const recitationsData: ApiResponse<{ recitations: Recitation[] }> = await recitationsRes.json();
  const recitations = recitationsData.data.recitations;

  // Get audio for first reciter
  const audioRes = await fetch(
    `/api/quran/chapters/${chapterId}/recitations/${recitations[0].id}`,
    { credentials: 'include' },
  );
  const audioData: ApiResponse<{ audio_files: RecitationAudio[] }> = await audioRes.json();
  const audioFiles = audioData.data.audio_files;

  return {
    recitations,
    audioFiles,
  };
}

// Usage
const { recitations, audioFiles } = await setupAudioPlayer(1);
// Create playlist from audioFiles
const playlist = audioFiles.map((audio) => audio.audio_url);
```

---

## Error Handling

All endpoints return standard error responses:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  timestamp: string;
}
```

**Common Error Codes:**

- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Missing or invalid authentication
- `404`: Not Found - Resource not found
- `422`: Unprocessable Entity - Validation errors
- `500`: Internal Server Error

**Example Error Handling:**

```typescript
async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        // Validation errors
        data.errors.forEach((error: ValidationError) => {
          console.error(`${error.field}: ${error.message}`);
        });
      } else {
        // General error
        console.error(data.message);
      }
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

---

## Best Practices

### 1. Caching

The API responses are cached on the backend. For frontend caching:

```typescript
// Use React Query or SWR for client-side caching
import { useQuery } from '@tanstack/react-query';

function useChapters(language: string = 'en') {
  return useQuery({
    queryKey: ['chapters', language],
    queryFn: async () => {
      const response = await fetch(`/api/quran/chapters?language=${language}`, {
        credentials: 'include',
      });
      const data: ApiResponse<{ chapters: Chapter[] }> = await response.json();
      return data.data.chapters;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
```

### 2. Pagination

For large chapters, use pagination:

```typescript
async function getVersesPaginated(chapterId: number, page: number = 1, perPage: number = 10) {
  const response = await fetch(
    `/api/quran/verses/chapter/${chapterId}?page=${page}&per_page=${perPage}`,
    { credentials: 'include' },
  );
  const data: ApiResponse<{ verses: Verse[] }> = await response.json();
  return data.data.verses;
}
```

### 3. Loading States

```typescript
const [loading, setLoading] = useState(false);
const [verses, setVerses] = useState<Verse[]>([]);

async function loadVerses(chapterId: number) {
  setLoading(true);
  try {
    const response = await fetch(`/api/quran/verses/chapter/${chapterId}`, {
      credentials: 'include',
    });
    const data: ApiResponse<{ verses: Verse[] }> = await response.json();
    setVerses(data.data.verses);
  } catch (error) {
    console.error('Failed to load verses:', error);
  } finally {
    setLoading(false);
  }
}
```

### 4. Type Safety

Always use TypeScript types:

```typescript
import type {
  Chapter,
  Verse,
  Translation,
  Tafsir,
  Recitation,
} from '@/types/quran'; // Adjust import path

// Type-safe function
function renderVerse(verse: Verse) {
  return (
    <div>
      <p>{verse.text_simple}</p>
      {verse.translations?.map(trans => (
        <p key={trans.id}>{trans.text}</p>
      ))}
    </div>
  );
}
```

---

## Additional Feature Suggestions

### Potential Future Enhancements

1. **Search Functionality**
   - Search verses by text (Arabic or translation)
   - Search by keywords or topics
   - Advanced filters (chapter, juz, page, etc.)

2. **Get Verses by Page Number**
   - `GET /api/quran/verses/page/:pageNumber`
   - Useful for page-based navigation

3. **Get Verses by Ruku/Hizb/Manzil**
   - `GET /api/quran/verses/ruku/:rukuNumber`
   - `GET /api/quran/verses/hizb/:hizbNumber`
   - `GET /api/quran/verses/manzil/:manzilNumber`

4. **Get Single Verse**
   - `GET /api/quran/verses/:verseKey`
   - Get a specific verse by key (e.g., "1:1")

5. **Get Juz Information**
   - `GET /api/quran/juzs/:juzNumber`
   - Get metadata about a Juz

6. **Get Page Information**
   - `GET /api/quran/pages/:pageNumber`
   - Get verses on a specific page

7. **Random Verse**
   - `GET /api/quran/verses/random`
   - Get a random verse (useful for "Verse of the Day")

8. **Verse Range**
   - `GET /api/quran/verses/range/:startKey/:endKey`
   - Get verses from "1:1" to "1:7"

9. **User-Specific Features** (requires backend implementation)
   - Bookmark verses
   - Add personal notes to verses
   - Reading progress tracking
   - Favorite translations/reciters

10. **Advanced Features**
    - Related verses (thematic connections)
    - Word frequency analysis
    - Verse comparison tool
    - Export verses (PDF, text, etc.)

---

## Common Translation IDs

For quick reference, here are some popular translation IDs:

- `131` - Sahih International (English)
- `85` - Dr. Mustafa Khattab (English)
- `149` - Muhammad Taqi-ud-Din al-Hilali & Muhammad Muhsin Khan (English)
- `20` - Muhammad Asad (English)
- `171` - Abdul Haleem (English)

## Common Tafsir IDs

- `169` - Ibn Kathir (English)
- `168` - Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti (English)

## Common Recitation IDs

- `1` - Abdul Basit Murattal
- `2` - Abdul Basit Mujawwad
- `3` - Abdul Rahman Al-Sudais
- `4` - Saad Al-Ghamdi
- `5` - Mishary Rashid Alafasy

---

---

## Testing Results

All endpoints have been tested and verified to be working correctly.

**Test Status: ✅ 17/17 Endpoints Working (100%)**

### Tested Endpoints

1. ✅ **GET /api/quran/chapters** - List All Chapters
2. ✅ **GET /api/quran/chapters/:id** - Get Single Chapter
3. ✅ **GET /api/quran/chapters/:id/info** - Get Chapter Info
4. ✅ **GET /api/quran/verses/chapter/:chapterNumber** - Get Verses by Chapter (basic)
5. ✅ **GET /api/quran/verses/chapter/:chapterNumber** (with translations) - Get Verses by Chapter with Translations
6. ✅ **GET /api/quran/verses/chapter/:chapterNumber** (with words) - Get Verses by Chapter with Word-by-Word
7. ✅ **GET /api/quran/verses/chapter/:chapterNumber** (with tafsirs) - Get Verses by Chapter with Tafsirs
8. ✅ **GET /api/quran/verses/chapter/:chapterNumber** (paginated) - Get Verses by Chapter with Pagination
9. ✅ **GET /api/quran/verses/juz/:juzNumber** - Get Verses by Juz
10. ✅ **GET /api/quran/translations** - List All Translations
11. ✅ **GET /api/quran/chapters/:chapterNumber/translations** - Get Chapter Translations
12. ✅ **GET /api/quran/tafsirs** - List All Tafsirs
13. ✅ **GET /api/quran/chapters/:chapterNumber/tafsirs** - Get Chapter Tafsirs
14. ✅ **GET /api/quran/recitations** - List All Recitations
15. ✅ **GET /api/quran/chapters/:chapterNumber/recitations/:recitationId** - Get Chapter Recitation
16. ✅ **GET /api/quran/juzs/:juzNumber/recitations/:recitationId** - Get Juz Recitation
17. ✅ **GET /api/quran/verses/:ayahKey/recitations/:recitationId** - Get Ayah Recitation

### Testing Notes

- All endpoints require authentication via `accessToken` cookie
- All endpoints return proper HTTP status codes (200 for success)
- Query parameters are properly validated and transformed
- Error handling is implemented for all endpoints
- Responses are cached on the backend for optimal performance

---
