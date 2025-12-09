# Tasbeeh API Documentation

Complete API documentation for the Tasbeeh feature with full TypeScript type safety.

## Base URL

All endpoints are prefixed with `/api/tasbeehs`:

```
Base URL: /api/tasbeehs
```

## Authentication

**All endpoints require authentication.** You must include the authentication cookie (`accessToken`) in your requests. The user can only access their own tasbeehs.

## TypeScript Types

### Core Types

```typescript
// Tasbeeh Type
interface Tasbeeh {
  _id: string;
  name: string;
  text: string;
  target: number;
  user: User | null;
  userId?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Type (simplified)
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  fiqh?: string;
  isVerified: boolean;
}

// Create Tasbeeh DTO
interface CreateTasbeehDto {
  name: string;        // 1-100 characters
  text: string;        // 1-500 characters
  target: number;      // Integer, 1-1000000
}

// Update Tasbeeh DTO
interface UpdateTasbeehDto {
  name?: string;       // 1-100 characters
  text?: string;       // 1-500 characters
  target?: number;     // Integer, 1-1000000
  isActive?: boolean;
}

// List Query Parameters
interface ListTasbeehsQueryDto {
  page?: number;       // Minimum: 1
  limit?: number;      // Minimum: 1, Maximum: 100
  sort?: string;       // Field to sort by (default: 'createdAt')
  order?: 'asc' | 'desc';  // Sort order (default: 'desc')
  active?: boolean;    // Filter by active status
}

// Pagination Response
interface PaginationResult<T> {
  data: T[];
  total: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
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

## Endpoints

### 1. List All Tasbeehs

Get a paginated list of all tasbeehs for the authenticated user.

**Endpoint:** `GET /api/tasbeehs`

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: all, minimum: 1, maximum: 100)
- `sort` (optional): Field to sort by (default: 'createdAt')
- `order` (optional): Sort order - 'asc' or 'desc' (default: 'desc')
- `active` (optional): Filter by active status - 'true' or 'false' (default: true)

**Response Type:**
```typescript
// With pagination
ApiResponse<{ tasbeehs: Tasbeeh[] }> // with meta.pagination

// Without pagination
ApiResponse<{ tasbeehs: Tasbeeh[] }> // with meta.total
```

**Example Request:**
```typescript
// With pagination
const response = await fetch('/api/tasbeehs?page=1&limit=10&sort=createdAt&order=desc&active=true', {
  credentials: 'include', // Include cookies for authentication
});
const data: ApiResponse<{ tasbeehs: Tasbeeh[] }> = await response.json();

// Without pagination (get all)
const response = await fetch('/api/tasbeehs?sort=name&order=asc', {
  credentials: 'include',
});
const data: ApiResponse<{ tasbeehs: Tasbeeh[] }> = await response.json();
```

**Example Response (with pagination):**
```json
{
  "success": true,
  "message": "Tasbeehs retrieved successfully",
  "data": {
    "tasbeehs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Subhan Allah",
        "text": "سُبْحَانَ اللَّهِ",
        "target": 33,
        "user": {
          "_id": "507f191e810c19729de860ea",
          "username": "user123",
          "email": "user@example.com",
          "role": "user",
          "isVerified": true
        },
        "isActive": true,
        "createdAt": "2025-12-08T10:00:00.000Z",
        "updatedAt": "2025-12-08T10:00:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Alhamdulillah",
        "text": "الْحَمْدُ لِلَّهِ",
        "target": 33,
        "user": {
          "_id": "507f191e810c19729de860ea",
          "username": "user123",
          "email": "user@example.com",
          "role": "user",
          "isVerified": true
        },
        "isActive": true,
        "createdAt": "2025-12-08T09:00:00.000Z",
        "updatedAt": "2025-12-08T09:00:00.000Z"
      }
    ]
  },
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

**Example Response (without pagination):**
```json
{
  "success": true,
  "message": "Tasbeehs retrieved successfully",
  "data": {
    "tasbeehs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Subhan Allah",
        "text": "سُبْحَانَ اللَّهِ",
        "target": 33,
        "isActive": true,
        "createdAt": "2025-12-08T10:00:00.000Z",
        "updatedAt": "2025-12-08T10:00:00.000Z"
      }
    ]
  },
  "meta": {
    "total": 25
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 2. Get Tasbeeh by ID

Get a specific tasbeeh by its ID. Only returns tasbeehs owned by the authenticated user.

**Endpoint:** `GET /api/tasbeehs/:id`

**Authentication:** Required

**Path Parameters:**
- `id` (required): Tasbeeh ObjectId (24 character hex string)

**Response Type:**
```typescript
ApiResponse<{ tasbeeh: Tasbeeh }>
```

**Example Request:**
```typescript
const tasbeehId = '507f1f77bcf86cd799439011';
const response = await fetch(`/api/tasbeehs/${tasbeehId}`, {
  credentials: 'include',
});
const data: ApiResponse<{ tasbeeh: Tasbeeh }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "tasbeeh": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Subhan Allah",
      "text": "سُبْحَانَ اللَّهِ",
      "target": 33,
      "user": {
        "_id": "507f191e810c19729de860ea",
        "username": "user123",
        "email": "user@example.com",
        "role": "user",
        "isVerified": true
      },
      "isActive": true,
      "createdAt": "2025-12-08T10:00:00.000Z",
      "updatedAt": "2025-12-08T10:00:00.000Z"
    }
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

### 3. Create Tasbeeh

Create a new tasbeeh for the authenticated user.

**Endpoint:** `POST /api/tasbeehs`

**Authentication:** Required

**Request Body:**
```typescript
CreateTasbeehDto
```

**Headers:**
- `Content-Type: application/json`
- `X-Idempotency-Key` (optional): Unique key to prevent duplicate requests

**Response Type:**
```typescript
ApiResponse<{ tasbeeh: Tasbeeh }>
```

**Example Request:**
```typescript
const response = await fetch('/api/tasbeehs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Idempotency-Key': 'unique-request-id-123', // Optional
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Subhan Allah',
    text: 'سُبْحَانَ اللَّهِ',
    target: 33,
  }),
});
const data: ApiResponse<{ tasbeeh: Tasbeeh }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "tasbeeh": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Subhan Allah",
      "text": "سُبْحَانَ اللَّهِ",
      "target": 33,
      "user": "507f191e810c19729de860ea",
      "isActive": true,
      "createdAt": "2025-12-08T14:00:00.000Z",
      "updatedAt": "2025-12-08T14:00:00.000Z"
    }
  },
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters
- `text`: Required, 1-500 characters
- `target`: Required, integer between 1 and 1,000,000

---

### 4. Update Tasbeeh

Update an existing tasbeeh. Only the owner can update their tasbeeh.

**Endpoint:** `PUT /api/tasbeehs/:id`

**Authentication:** Required

**Path Parameters:**
- `id` (required): Tasbeeh ObjectId (24 character hex string)

**Request Body:**
```typescript
UpdateTasbeehDto // All fields are optional
```

**Headers:**
- `Content-Type: application/json`
- `X-Idempotency-Key` (optional): Unique key to prevent duplicate requests

**Response Type:**
```typescript
ApiResponse<{ tasbeeh: Tasbeeh }>
```

**Example Request:**
```typescript
const tasbeehId = '507f1f77bcf86cd799439011';
const response = await fetch(`/api/tasbeehs/${tasbeehId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Idempotency-Key': 'unique-request-id-456', // Optional
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Subhan Allah (Updated)',
    target: 100,
    isActive: false,
  }),
});
const data: ApiResponse<{ tasbeeh: Tasbeeh }> = await response.json();
```

**Example Response:**
```json
{
  "success": true,
  "message": "Tasbeeh updated successfully",
  "data": {
    "tasbeeh": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Subhan Allah (Updated)",
      "text": "سُبْحَانَ اللَّهِ",
      "target": 100,
      "user": "507f191e810c19729de860ea",
      "isActive": false,
      "createdAt": "2025-12-08T10:00:00.000Z",
      "updatedAt": "2025-12-08T14:30:00.000Z"
    }
  },
  "timestamp": "2025-12-08T14:30:00.000Z"
}
```

**Validation Rules:**
- `name`: Optional, 1-100 characters (if provided)
- `text`: Optional, 1-500 characters (if provided)
- `target`: Optional, integer between 1 and 1,000,000 (if provided)
- `isActive`: Optional, boolean

---

### 5. Delete Tasbeeh

Delete a tasbeeh by ID. Only the owner can delete their tasbeeh.

**Endpoint:** `DELETE /api/tasbeehs/:id`

**Authentication:** Required

**Path Parameters:**
- `id` (required): Tasbeeh ObjectId (24 character hex string)

**Response Type:**
```typescript
// 204 No Content (no response body)
```

**Example Request:**
```typescript
const tasbeehId = '507f1f77bcf86cd799439011';
const response = await fetch(`/api/tasbeehs/${tasbeehId}`, {
  method: 'DELETE',
  credentials: 'include',
});

if (response.status === 204) {
  console.log('Tasbeeh deleted successfully');
}
```

**Example Response:**
```
Status: 204 No Content
(No response body)
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
- `201` - Created (for POST requests)
- `204` - No Content (for DELETE requests)
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (access denied)
- `404` - Not Found (resource doesn't exist or doesn't belong to user)
- `422` - Validation Error (invalid input)
- `500` - Internal Server Error

**Example Error Responses:**

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    {
      "field": "name",
      "message": "Name is required",
      "value": ""
    },
    {
      "field": "target",
      "message": "Target must be at least 1",
      "value": 0
    }
  ],
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Tasbeeh not found",
  "data": null,
  "errors": [],
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Authentication required. Please login.",
  "data": null,
  "errors": [],
  "timestamp": "2025-12-08T14:00:00.000Z"
}
```

---

## Usage Examples

### Axios Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/tasbeehs',
  withCredentials: true, // Include cookies for authentication
});

// Type-safe API client
export const tasbeehClient = {
  // List all tasbeehs
  list: (params?: ListTasbeehsQueryDto) =>
    api.get<ApiResponse<{ tasbeehs: Tasbeeh[] }>>('/', { params }),

  // Get tasbeeh by ID
  getById: (id: string) =>
    api.get<ApiResponse<{ tasbeeh: Tasbeeh }>>(`/${id}`),

  // Create tasbeeh
  create: (data: CreateTasbeehDto, idempotencyKey?: string) =>
    api.post<ApiResponse<{ tasbeeh: Tasbeeh }>>('/', data, {
      headers: idempotencyKey
        ? { 'X-Idempotency-Key': idempotencyKey }
        : {},
    }),

  // Update tasbeeh
  update: (id: string, data: UpdateTasbeehDto, idempotencyKey?: string) =>
    api.put<ApiResponse<{ tasbeeh: Tasbeeh }>>(`/${id}`, data, {
      headers: idempotencyKey
        ? { 'X-Idempotency-Key': idempotencyKey }
        : {},
    }),

  // Delete tasbeeh
  delete: (id: string) => api.delete(`/${id}`),
};

// Usage examples
try {
  // List tasbeehs with pagination
  const { data: listResponse } = await tasbeehClient.list({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    active: true,
  });
  console.log(listResponse.data.tasbeehs);

  // Get single tasbeeh
  const { data: getResponse } = await tasbeehClient.getById('507f1f77bcf86cd799439011');
  console.log(getResponse.data.tasbeeh);

  // Create tasbeeh
  const { data: createResponse } = await tasbeehClient.create({
    name: 'Subhan Allah',
    text: 'سُبْحَانَ اللَّهِ',
    target: 33,
  }, 'unique-key-123');
  console.log(createResponse.data.tasbeeh);

  // Update tasbeeh
  const { data: updateResponse } = await tasbeehClient.update(
    '507f1f77bcf86cd799439011',
    {
      target: 100,
      isActive: false,
    },
    'unique-key-456'
  );
  console.log(updateResponse.data.tasbeeh);

  // Delete tasbeeh
  await tasbeehClient.delete('507f1f77bcf86cd799439011');
  console.log('Tasbeeh deleted');
} catch (error: any) {
  if (error.response) {
    console.error('API Error:', error.response.data);
  } else {
    console.error('Network Error:', error.message);
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { tasbeehClient, Tasbeeh, CreateTasbeehDto, UpdateTasbeehDto } from './api';

export const useTasbeehs = (params?: ListTasbeehsQueryDto) => {
  const [tasbeehs, setTasbeehs] = useState<Tasbeeh[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasbeehs = async () => {
      try {
        setLoading(true);
        const { data } = await tasbeehClient.list(params);
        setTasbeehs(data.data.tasbeehs);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tasbeehs');
      } finally {
        setLoading(false);
      }
    };

    fetchTasbeehs();
  }, [params]);

  const createTasbeeh = async (data: CreateTasbeehDto) => {
    try {
      const response = await tasbeehClient.create(data);
      setTasbeehs((prev) => [response.data.data.tasbeeh, ...prev]);
      return response.data.data.tasbeeh;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create tasbeeh');
    }
  };

  const updateTasbeeh = async (id: string, data: UpdateTasbeehDto) => {
    try {
      const response = await tasbeehClient.update(id, data);
      setTasbeehs((prev) =>
        prev.map((t) => (t._id === id ? response.data.data.tasbeeh : t))
      );
      return response.data.data.tasbeeh;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update tasbeeh');
    }
  };

  const deleteTasbeeh = async (id: string) => {
    try {
      await tasbeehClient.delete(id);
      setTasbeehs((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete tasbeeh');
    }
  };

  return {
    tasbeehs,
    loading,
    error,
    createTasbeeh,
    updateTasbeeh,
    deleteTasbeeh,
  };
};
```

---

## Notes

1. **Authentication**: All endpoints require authentication via cookies. Make sure to include `credentials: 'include'` in fetch requests or `withCredentials: true` in axios.

2. **User Isolation**: Users can only access, modify, or delete their own tasbeehs. Attempting to access another user's tasbeeh will result in a 404 error.

3. **Idempotency**: POST and PUT requests support idempotency keys via the `X-Idempotency-Key` header. This prevents duplicate operations if a request is retried.

4. **Caching**: Responses are cached on the server side for improved performance. Cache is automatically invalidated on create, update, and delete operations.

5. **Pagination**: When using pagination, the response includes metadata with total count, current page, total pages, and limit. Without pagination parameters, all tasbeehs are returned.

6. **Filtering**: Use the `active` query parameter to filter tasbeehs by their active status. The default behavior returns active tasbeehs.

7. **Sorting**: Default sort is by `createdAt` in descending order (newest first). You can sort by any field using the `sort` and `order` query parameters.

8. **Validation**: All input is validated on the server. Invalid data will return a 422 status with detailed error messages for each field.

---

## Common Tasbeeh Examples

Here are some common tasbeeh texts you might want to use:

- **Subhan Allah** (سُبْحَانَ اللَّهِ) - "Glory be to Allah"
- **Alhamdulillah** (الْحَمْدُ لِلَّهِ) - "Praise be to Allah"
- **Allahu Akbar** (اللَّهُ أَكْبَرُ) - "Allah is the Greatest"
- **La ilaha illa Allah** (لَا إِلَٰهَ إِلَّا اللَّهُ) - "There is no god but Allah"
- **Astaghfirullah** (أَسْتَغْفِرُ اللَّهَ) - "I seek forgiveness from Allah"
- **Subhan Allah wa bihamdihi** (سُبْحَانَ اللَّهِ وَبِحَمْدِهِ) - "Glory be to Allah and praise be to Him"
- **Subhan Allahil Azeem** (سُبْحَانَ اللَّهِ الْعَظِيمِ) - "Glory be to Allah, the Great"

Common target counts:
- 33 (for morning/evening dhikr)
- 100 (for extended dhikr)
- 1000 (for special occasions)

---

