# Chat API Documentation

This document provides comprehensive documentation for the Chat API endpoints, designed for frontend developers integrating the Islamic Assistant chat feature.

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Create Conversation](#1-create-conversation)
  - [List Conversations](#2-list-conversations)
  - [Get Single Conversation](#3-get-single-conversation)
  - [Send Message](#4-send-message)
  - [Delete Conversation](#5-delete-conversation)
  - [Delete All Conversations](#6-delete-all-conversations)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Example Usage](#example-usage)

## Overview

The Chat API provides endpoints for managing conversations with an Islamic Assistant AI. The assistant can answer questions about:
- The Holy Quran (verses, chapters, meanings, interpretations)
- Hadith (Prophet Muhammad's teachings and Sunnah)
- General Islamic knowledge and guidance

All responses include proper citations with source references that are automatically extracted.

## Base URL

```
/api/v1/chat
```

## Authentication

All endpoints require authentication using a Bearer token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

Alternatively, you can use cookie-based authentication with `accessToken` cookie.

## Endpoints

### 1. Create Conversation

Create a new conversation thread.

**Endpoint:** `POST /api/v1/chat`

**Request Body:**
```json
{
  "title": "Optional conversation title" // Optional, max 200 characters
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "chat": {
      "_id": "693ee1811c0f733adfe36845",
      "userId": "693edd44a347fed4bf821e76",
      "title": "Optional conversation title",
      "messages": [],
      "isActive": true,
      "createdAt": "2025-12-14T16:10:41.519Z",
      "updatedAt": "2025-12-14T16:10:41.519Z"
    }
  },
  "timestamp": "2025-12-14T16:10:41.680Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:9000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "My First Conversation"}'
```

---

### 2. List Conversations

Get a paginated list of all user's conversations.

**Endpoint:** `GET /api/v1/chat`

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 20, min: 1, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "chats": [
      {
        "_id": "693ee1811c0f733adfe36845",
        "userId": "693edd44a347fed4bf821e76",
        "title": "My First Conversation",
        "messages": [],
        "isActive": true,
        "createdAt": "2025-12-14T16:10:41.519Z",
        "updatedAt": "2025-12-14T16:10:41.519Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "currentPage": "1",
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": "20",
      "hasNextPage": false,
      "hasPrevPage": false,
      "nextPage": null,
      "prevPage": null
    }
  },
  "timestamp": "2025-12-14T16:10:47.358Z"
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:9000/api/v1/chat?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Get Single Conversation

Get a specific conversation with all its messages.

**Endpoint:** `GET /api/v1/chat/:id`

**URL Parameters:**
- `id`: Conversation ID (MongoDB ObjectId)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "chat": {
      "_id": "693ee1811c0f733adfe36845",
      "userId": "693edd44a347fed4bf821e76",
      "title": "My First Conversation",
      "messages": [
        {
          "role": "user",
          "content": "What does the Quran say about patience?",
          "createdAt": "2025-12-14T16:12:00.000Z"
        },
        {
          "role": "assistant",
          "content": "The Quran presents patience (sabr) as a core virtue...",
          "sources": [
            {
              "type": "quran",
              "reference": "Quran 2:153",
              "text": "",
              "metadata": {
                "chapterId": 2,
                "verseNumber": 153
              }
            }
          ],
          "createdAt": "2025-12-14T16:12:15.000Z"
        }
      ],
      "isActive": true,
      "createdAt": "2025-12-14T16:10:41.519Z",
      "updatedAt": "2025-12-14T16:12:15.000Z"
    }
  },
  "timestamp": "2025-12-14T16:12:15.086Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:9000/api/v1/chat/693ee1811c0f733adfe36845 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Send Message

Send a message to the AI assistant in a conversation. The assistant will respond with an answer and automatically extract source citations.

**Endpoint:** `POST /api/v1/chat/:id/messages`

**URL Parameters:**
- `id`: Conversation ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "message": "What does the Quran say about patience?" // Required, 1-2000 characters
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": {
      "role": "assistant",
      "content": "The Quran presents patience (sabr) as a core virtue of faith—seeking Allah's help, enduring trials, restraining from sin, and persevering in worship—promising immense reward for the patient. Key teachings include:\n\n- Command and divine support\n  - \"Seek help through patience and prayer; indeed, Allah is with the patient.\" Quran 2:153\n  - \"Seek help through patience and prayer; indeed, it is difficult except for the humbly submissive.\" Quran 2:45\n\n- Life is a test; glad tidings for the patient\n  - \"And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.\" Quran 2:155\n  - \"Who, when disaster strikes them, say, 'Indeed we belong to Allah, and indeed to Him we will return.'\" Quran 2:156\n  - \"Those are the ones upon whom are blessings from their Lord and mercy. And it is those who are the [rightly] guided.\" Quran 2:157",
      "sources": [
        {
          "type": "quran",
          "reference": "Quran 2:153",
          "text": "",
          "metadata": {
            "chapterId": 2,
            "verseNumber": 153
          }
        },
        {
          "type": "quran",
          "reference": "Quran 2:45",
          "text": "",
          "metadata": {
            "chapterId": 2,
            "verseNumber": 45
          }
        },
        {
          "type": "quran",
          "reference": "Quran 2:155",
          "text": "",
          "metadata": {
            "chapterId": 2,
            "verseNumber": 155
          }
        }
      ],
      "createdAt": "2025-12-14T16:12:15.085Z"
    }
  },
  "timestamp": "2025-12-14T16:12:15.447Z"
}
```

**Note:** The response may take 10-30 seconds depending on the complexity of the question.

**cURL Example:**
```bash
curl -X POST http://localhost:9000/api/v1/chat/693ee1811c0f733adfe36845/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What does the Quran say about patience?"}'
```

---

### 5. Delete Conversation

Soft delete a specific conversation (sets `isActive` to false).

**Endpoint:** `DELETE /api/v1/chat/:id`

**URL Parameters:**
- `id`: Conversation ID (MongoDB ObjectId)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Conversation deleted successfully",
  "data": {},
  "timestamp": "2025-12-14T16:17:02.580Z"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:9000/api/v1/chat/693ee1811c0f733adfe36845 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Delete All Conversations

Soft delete all conversations for the authenticated user.

**Endpoint:** `DELETE /api/v1/chat`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "All conversations deleted successfully",
  "data": {},
  "timestamp": "2025-12-14T16:17:11.997Z"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:9000/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Data Models

### Chat

```typescript
interface Chat {
  _id: string;                    // MongoDB ObjectId
  userId: string;                 // User ID who owns the conversation
  title: string;                  // Conversation title (max 200 chars)
  messages: ChatMessage[];        // Array of messages
  isActive: boolean;              // Whether conversation is active
  createdAt: string;              // ISO 8601 date string
  updatedAt: string;              // ISO 8601 date string
}
```

### ChatMessage

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';     // Message sender role
  content: string;                 // Message content
  sources?: MessageSource[];       // Optional array of sources (only for assistant messages)
  createdAt: string;               // ISO 8601 date string
}
```

### MessageSource

```typescript
interface MessageSource {
  type: 'quran' | 'hadith';       // Type of source
  reference: string;               // Reference string (e.g., "Quran 2:153")
  text: string;                    // Source text (currently empty, reserved for future use)
  metadata?: {
    // For Quran sources
    chapterId?: number;            // Chapter number
    verseNumber?: number;          // Verse number
    
    // For Hadith sources
    collectionName?: string;       // Collection name (e.g., "sahih-bukhari")
    bookNumber?: string;           // Book number
    hadithNumber?: string;         // Hadith number
  };
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message description",
  "data": null,
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ],
  "timestamp": "2025-12-14T16:10:41.680Z"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error or invalid request
- `401 Unauthorized` - Authentication required or invalid token
- `404 Not Found` - Conversation not found
- `500 Internal Server Error` - Server error

### Example Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    {
      "field": "message",
      "message": "Message is required"
    }
  ],
  "timestamp": "2025-12-14T16:10:41.680Z"
}
```

---

## Example Usage

### JavaScript/TypeScript (Fetch API)

```typescript
const API_BASE_URL = 'http://localhost:9000/api/v1';
const token = 'YOUR_JWT_TOKEN';

// Create a new conversation
async function createConversation(title?: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title: title || 'New Conversation' })
  });
  
  const data = await response.json();
  return data.data.chat;
}

// List conversations
async function listConversations(page = 1, limit = 20) {
  const response = await fetch(
    `${API_BASE_URL}/chat?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  return data;
}

// Get a conversation
async function getConversation(conversationId: string) {
  const response = await fetch(
    `${API_BASE_URL}/chat/${conversationId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  return data.data.chat;
}

// Send a message
async function sendMessage(conversationId: string, message: string) {
  const response = await fetch(
    `${API_BASE_URL}/chat/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    }
  );
  
  const data = await response.json();
  return data.data.message;
}

// Delete a conversation
async function deleteConversation(conversationId: string) {
  const response = await fetch(
    `${API_BASE_URL}/chat/${conversationId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  return data;
}

// Usage example
async function chatExample() {
  // Create a conversation
  const chat = await createConversation('Patience in Islam');
  console.log('Created conversation:', chat._id);
  
  // Send a message
  const response = await sendMessage(chat._id, 'What does the Quran say about patience?');
  console.log('Assistant response:', response.content);
  console.log('Sources:', response.sources);
  
  // Get full conversation
  const fullChat = await getConversation(chat._id);
  console.log('All messages:', fullChat.messages);
}
```

### React Hook Example

```typescript
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:9000/api/v1';

export function useChat(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    conversationId: string,
    message: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      const data = await response.json();
      return data.data.message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { sendMessage, loading, error };
}
```

### Axios Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Chat API methods
export const chatAPI = {
  createConversation: (title?: string) =>
    api.post('/chat', { title }),
  
  listConversations: (page = 1, limit = 20) =>
    api.get('/chat', { params: { page, limit } }),
  
  getConversation: (id: string) =>
    api.get(`/chat/${id}`),
  
  sendMessage: (conversationId: string, message: string) =>
    api.post(`/chat/${conversationId}/messages`, { message }),
  
  deleteConversation: (id: string) =>
    api.delete(`/chat/${id}`),
  
  deleteAllConversations: () =>
    api.delete('/chat')
};
```

---

## Notes

1. **Response Time**: The send message endpoint may take 10-30 seconds to respond, depending on the complexity of the question. Make sure to handle loading states appropriately in your UI.

2. **Source Citations**: The assistant automatically extracts source citations from its responses. Sources are parsed from text patterns like "Quran 2:153" or "Sahih Bukhari 1:1".

3. **Conversation Title**: If no title is provided when creating a conversation, it defaults to "New Conversation". The title is automatically updated to the first 50 characters of the first user message.

4. **Pagination**: When listing conversations, use the pagination metadata to implement proper pagination controls in your UI.

5. **Soft Delete**: Conversations are soft-deleted (marked as inactive) rather than permanently removed from the database.

6. **Message History**: The conversation maintains full message history. Each message includes a timestamp and role (user/assistant).

---

## Support

For issues or questions, please contact the backend development team.
