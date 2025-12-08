# Hadith API Documentation

Complete API documentation for the Hadith feature with full TypeScript type safety.

## Base URL

All endpoints are prefixed with `/api/hadith`:

```
Base URL: /api/hadith
```

## TypeScript Types

### Core Types

```typescript
// Collection Types
interface SubCollection {
  lang: string;
  title: boolean;
  shortIntro: number;
}

interface Collection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  totalHadith: number;
  totalAvailableHadith: number;
  collection: SubCollection[];
}

// Book Types
interface Book {
  bookNumber: string;
  hadithStartNumber: string;
  numberOfHadith: string;
  book: {
    lang: string;
    name: boolean;
  }[];
  totalAvailableHadith: number;
}

// Chapter Types
interface ChapterInfo {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  intro: string;
  ending: string;
}

interface Chapter {
  bookNumber: string;
  chapterId: string;
  chapter: ChapterInfo[];
}

// Hadith Types
interface Grade {
  grade: string;
  name: string;
}

interface GradeWithGradedBy {
  graded_by: string;
  grade: string;
}

interface Reference {
  book: string;
  hadith: string;
}

interface HadithInfo {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  body: string;
  grades?: Grade[];
  reference?: Reference;
}

interface HadithInfoWithUrn {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  urn: number;
  body: string;
  grades?: GradeWithGradedBy[];
}

interface Hadith {
  hadithNumber: string;
  hadith: HadithInfo[];
}

interface RandomHadith {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: HadithInfoWithUrn[];
}

// Pagination Type
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}

// API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ValidationError[];
  timestamp: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}
```

## Endpoints

### 1. Get Random Hadith

Get a randomly selected hadith from any collection.

**Endpoint:** `GET /api/hadith/hadiths/random`

**Request:**
- No parameters required

**Response Type:**
```typescript
ApiResponse<{ hadith: RandomHadith }>
```

**Example Request:**
```typescript
const response = await fetch('/api/hadith/hadiths/random');
const data: ApiResponse<{ hadith: RandomHadith }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "hadith": {
      "collection": "bukhari",
      "bookNumber": "1",
      "chapterId": "1.00",
      "hadithNumber": "1",
      "hadith": [
        {
          "lang": "en",
          "chapterNumber": "1",
          "chapterTitle": "How the Divine Revelation started",
          "urn": 10,
          "body": "<p>Narrated 'Umar bin Al-Khattab...</p>",
          "grades": [
            {
              "graded_by": "Imam Bukhari",
              "grade": "Sahih"
            }
          ]
        }
      ]
    }
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 2. Get All Collections

Get a list of all available hadith collections.

**Endpoint:** `GET /api/hadith/collections`

**Request:**
- No parameters required

**Response Type:**
```typescript
ApiResponse<{ collections: Collection[] }>
```

**Example Request:**
```typescript
const response = await fetch('/api/hadith/collections');
const data: ApiResponse<{ collections: Collection[] }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "collections": [
      {
        "name": "bukhari",
        "hasBooks": true,
        "hasChapters": true,
        "totalHadith": 7291,
        "totalAvailableHadith": 7277,
        "collection": [
          {
            "lang": "en",
            "title": "Sahih al-Bukhari",
            "shortIntro": "Sahih al-Bukhari is a collection..."
          },
          {
            "lang": "ar",
            "title": "صحيح البخاري",
            "shortIntro": "Sahih al-Bukhari is a collection..."
          }
        ]
      }
    ]
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 3. Get Collection by Name

Get details of a specific collection.

**Endpoint:** `GET /api/hadith/collections/:collectionName`

**Path Parameters:**
```typescript
{
  collectionName: string; // e.g., "bukhari", "muslim", "nasai"
}
```

**Response Type:**
```typescript
ApiResponse<{ collection: Collection }>
```

**Example Request:**
```typescript
const collectionName = 'bukhari';
const response = await fetch(`/api/hadith/collections/${collectionName}`);
const data: ApiResponse<{ collection: Collection }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "collection": {
      "name": "bukhari",
      "hasBooks": true,
      "hasChapters": true,
      "totalHadith": 7291,
      "totalAvailableHadith": 7277,
      "collection": [
        {
          "lang": "en",
          "title": "Sahih al-Bukhari",
          "shortIntro": "Sahih al-Bukhari is a collection..."
        }
      ]
    }
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 4. Get Books by Collection

Get all books in a specific collection.

**Endpoint:** `GET /api/hadith/collections/:collectionName/books`

**Path Parameters:**
```typescript
{
  collectionName: string; // e.g., "bukhari"
}
```

**Response Type:**
```typescript
ApiResponse<{ books: Book[] }>
```

**Example Request:**
```typescript
const collectionName = 'bukhari';
const response = await fetch(`/api/hadith/collections/${collectionName}/books`);
const data: ApiResponse<{ books: Book[] }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "books": [
      {
        "bookNumber": "1",
        "hadithStartNumber": "1",
        "numberOfHadith": "7",
        "book": [
          {
            "lang": "en",
            "name": "Revelation"
          },
          {
            "lang": "ar",
            "name": "كتاب بدء الوحى"
          }
        ],
        "totalAvailableHadith": 7
      }
    ]
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 5. Get Book by Number

Get details of a specific book in a collection.

**Endpoint:** `GET /api/hadith/collections/:collectionName/books/:bookNumber`

**Path Parameters:**
```typescript
{
  collectionName: string; // e.g., "bukhari"
  bookNumber: string;      // e.g., "1", "2", "3"
}
```

**Response Type:**
```typescript
ApiResponse<{ book: Book }>
```

**Example Request:**
```typescript
const collectionName = 'bukhari';
const bookNumber = '1';
const response = await fetch(`/api/hadith/collections/${collectionName}/books/${bookNumber}`);
const data: ApiResponse<{ book: Book }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "book": {
      "bookNumber": "1",
      "hadithStartNumber": "1",
      "numberOfHadith": "7",
      "book": [
        {
          "lang": "en",
          "name": "Revelation"
        }
      ],
      "totalAvailableHadith": 7
    }
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 6. Get Chapters by Book

Get all chapters in a specific book.

**Endpoint:** `GET /api/hadith/collections/:collectionName/books/:bookNumber/chapters`

**Path Parameters:**
```typescript
{
  collectionName: string; // e.g., "bukhari"
  bookNumber: string;      // e.g., "1"
}
```

**Response Type:**
```typescript
ApiResponse<{ chapters: Chapter[] }>
```

**Example Request:**
```typescript
const collectionName = 'bukhari';
const bookNumber = '1';
const response = await fetch(`/api/hadith/collections/${collectionName}/books/${bookNumber}/chapters`);
const data: ApiResponse<{ chapters: Chapter[] }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "chapters": [
      {
        "bookNumber": "1",
        "chapterId": "1.00",
        "chapter": [
          {
            "lang": "en",
            "chapterNumber": "1",
            "chapterTitle": "How the Divine Revelation started",
            "intro": "<p>And the Statement of Allah...</p>",
            "ending": null
          },
          {
            "lang": "ar",
            "chapterNumber": "1",
            "chapterTitle": "باب كَيْفَ كَانَ بَدْءُ الْوَحْىِ",
            "intro": "<p>وَقَوْلُ اللَّهِ...</p>",
            "ending": null
          }
        ]
      }
    ]
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 7. Get Hadiths by Book

Get all hadiths in a specific book with pagination support.

**Endpoint:** `GET /api/hadith/collections/:collectionName/books/:bookNumber/hadiths`

**Path Parameters:**
```typescript
{
  collectionName: string; // e.g., "bukhari"
  bookNumber: string;      // e.g., "1"
}
```

**Query Parameters:**
```typescript
{
  page?: number;   // Page number (optional, default: 1)
  limit?: number;  // Items per page (optional, default: 50)
}
```

**Response Type:**
```typescript
ApiResponse<PaginatedResponse<Hadith>>
```

**Example Request:**
```typescript
const collectionName = 'bukhari';
const bookNumber = '1';
const page = 1;
const limit = 10;

const queryParams = new URLSearchParams({
  page: page.toString(),
  limit: limit.toString()
});

const response = await fetch(
  `/api/hadith/collections/${collectionName}/books/${bookNumber}/hadiths?${queryParams}`
);
const data: ApiResponse<PaginatedResponse<Hadith>> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "hadithNumber": "1",
        "hadith": [
          {
            "lang": "en",
            "chapterNumber": "1",
            "chapterTitle": "How the Divine Revelation started",
            "body": "<p>Narrated 'Umar bin Al-Khattab...</p>",
            "grades": [
              {
                "grade": "Sahih",
                "name": "Imam Bukhari"
              }
            ],
            "reference": {
              "book": "1",
              "hadith": "1"
            }
          }
        ]
      }
    ],
    "total": 7,
    "limit": 10,
    "previous": null,
    "next": null
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 8. Get Hadith by Number

Get a specific hadith by its number in a collection.

**Endpoint:** `GET /api/hadith/collections/:collectionName/hadiths/:hadithNumber`

**Path Parameters:**
```typescript
{
  collectionName: string; // e.g., "bukhari"
  hadithNumber: string;    // e.g., "1", "2", "3"
}
```

**Response Type:**
```typescript
ApiResponse<{ hadith: Hadith }>
```

**Example Request:**
```typescript
const collectionName = 'bukhari';
const hadithNumber = '1';
const response = await fetch(`/api/hadith/collections/${collectionName}/hadiths/${hadithNumber}`);
const data: ApiResponse<{ hadith: Hadith }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "hadith": {
      "hadithNumber": "1",
      "hadith": [
        {
          "lang": "en",
          "chapterNumber": "1",
          "chapterTitle": "How the Divine Revelation started",
          "body": "<p>Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying...</p>",
          "grades": [
            {
              "grade": "Sahih",
              "name": "Imam Bukhari"
            }
          ],
          "reference": {
            "book": "1",
            "hadith": "1"
          }
        },
        {
          "lang": "ar",
          "chapterNumber": "1",
          "chapterTitle": "باب كَيْفَ كَانَ بَدْءُ الْوَحْىِ",
          "body": "<p>حَدَّثَنَا عَبْدُ اللَّهِ...</p>",
          "grades": []
        }
      ]
    }
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

**Error Response Type:**
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
  errors?: ValidationError[];
  timestamp: string;
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `422` - Validation Error (invalid input)
- `500` - Internal Server Error

**Example Error Response:**
```json
{
  "success": false,
  "message": "Unable to retrieve collection",
  "data": null,
  "errors": [
    {
      "field": "collectionName",
      "message": "Collection not found",
      "value": "invalid-collection"
    }
  ],
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---


### Axios Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/hadith',
});

// Type-safe API client
export const hadithClient = {
  getCollections: () =>
    api.get<ApiResponse<{ collections: Collection[] }>>('/collections'),

  getCollection: (collectionName: string) =>
    api.get<ApiResponse<{ collection: Collection }>>(`/collections/${collectionName}`),

  getBooks: (collectionName: string) =>
    api.get<ApiResponse<{ books: Book[] }>>(`/collections/${collectionName}/books`),

  getBook: (collectionName: string, bookNumber: string) =>
    api.get<ApiResponse<{ book: Book }>>(
      `/collections/${collectionName}/books/${bookNumber}`
    ),

  getChapters: (collectionName: string, bookNumber: string) =>
    api.get<ApiResponse<{ chapters: Chapter[] }>>(
      `/collections/${collectionName}/books/${bookNumber}/chapters`
    ),

  getHadithsByBook: (
    collectionName: string,
    bookNumber: string,
    params?: { page?: number; limit?: number }
  ) =>
    api.get<ApiResponse<PaginatedResponse<Hadith>>>(
      `/collections/${collectionName}/books/${bookNumber}/hadiths`,
      { params }
    ),

  getHadith: (collectionName: string, hadithNumber: string) =>
    api.get<ApiResponse<{ hadith: Hadith }>>(
      `/collections/${collectionName}/hadiths/${hadithNumber}`
    ),

  getRandomHadith: () =>
    api.get<ApiResponse<{ hadith: RandomHadith }>>('/hadiths/random'),
};

// Usage
const { data } = await hadithClient.getCollections();
if (data.data.success) {
  console.log(data.data.data.collections);
}
```

---

## Available Collections

Common collection names you can use:

- `bukhari` - Sahih al-Bukhari
- `muslim` - Sahih Muslim
- `nasai` - Sunan an-Nasa'i
- `abudawud` - Sunan Abi Dawud
- `tirmidhi` - Jami` at-Tirmidhi
- `ibnmajah` - Sunan Ibn Majah
- `malik` - Muwatta Malik
- `ahmad` - Musnad Ahmad
- `darimi` - Sunan ad-Darimi
- `riyadussalihin` - Riyad as-Salihin
- `adab` - Al-Adab Al-Mufrad
- `shamail` - Ash-Shama'il Al-Muhammadiyah
- `mishkat` - Mishkat al-Masabih
- `bulugh` - Bulugh al-Maram
- `nawawi40` - An-Nawawi's 40 Hadith
- `hisn` - Hisn al-Muslim
- `virtues` - Special Virtues of the Qur'an's Chapters and Verses

---

## Notes

1. **Caching**: Responses are cached on the server side. Collections, books, and chapters are cached for 30 days. Hadiths are cached for 7 days. Random hadiths are not cached.

2. **Pagination**: When using pagination endpoints, use the `previous` and `next` values in the response to navigate between pages.

---
