import { ChatModel, ChatDocument } from '../model/chat.model';
import { Chat, ChatMessage, MessageSource } from '../type/chat.type';
import { run } from '@openai/agents';
import { islamicAssistantAgent } from '@/ai/agents/islamic-assistant.agent';
import { logger } from '@/utils/logger.util';
import { AppError } from '@/utils/error.util';
import { FilterQuery, ObjectId } from 'mongoose';
import { findOneOrThrow } from '@/utils/db.util';

// Extract sources from AI response (parse citations)
function extractSources(response: string): MessageSource[] {
  const sources: MessageSource[] = [];

  // Pattern: "Quran 2:255" or "Quran 2:255-256"
  const quranPattern = /Quran\s+(\d+):(\d+)(?:-(\d+))?/gi;
  let match;
  const seen = new Set<string>();

  while ((match = quranPattern.exec(response)) !== null) {
    const reference = `Quran ${match[1]}:${match[2]}`;
    if (seen.has(reference)) continue;
    seen.add(reference);

    sources.push({
      type: 'quran',
      reference,
      text: '',
      metadata: {
        chapterId: parseInt(match[1]),
        verseNumber: parseInt(match[2]),
      },
    });
  }

  // Pattern: "Sahih Bukhari 1:1" or "Sahih Muslim 2:3"
  const hadithPattern =
    /(Sahih\s+Bukhari|Sahih\s+Muslim|Sunan\s+Abi\s+Dawud|Sunan\s+At-Tirmidhi|Sunan\s+An-Nasa'i|Sunan\s+Ibn\s+Majah)\s+(\d+):(\d+)/gi;
  while ((match = hadithPattern.exec(response)) !== null) {
    const reference = `${match[1]} ${match[2]}:${match[3]}`;
    if (seen.has(reference)) continue;
    seen.add(reference);

    sources.push({
      type: 'hadith',
      reference,
      text: '',
      metadata: {
        collectionName: match[1].toLowerCase().replace(/\s+/g, '-'),
        bookNumber: match[2],
        hadithNumber: match[3],
      },
    });
  }

  return sources;
}

export const createConversation = async (userId: string, title?: string): Promise<Chat> => {
  const chat = await ChatModel.create({
    userId,
    title: title || 'New Conversation',
    messages: [],
    isActive: true,
  });

  const chatObj = chat.toObject();
  return {
    ...chatObj,
    userId: chatObj.userId.toString(),
    _id: (chatObj._id as ObjectId).toString(),
  } as Chat;
};

export const getConversations = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ chats: Chat[]; total: number }> => {
  const skip = (page - 1) * limit;

  const [chats, total] = await Promise.all([
    ChatModel.find({ userId, isActive: true })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ChatModel.countDocuments({ userId, isActive: true }),
  ]);

  const formattedChats: Chat[] = chats.map((chat) => ({
    ...chat,
    userId: chat.userId.toString(),
    _id: chat._id.toString(),
  })) as Chat[];

  return { chats: formattedChats, total };
};

export const getConversation = async (conversationId: string, userId: string): Promise<Chat> => {
  const chat = await findOneOrThrow<ChatDocument>(ChatModel, {
    where: { _id: conversationId, userId, isActive: true } as FilterQuery<ChatDocument>,
    field: 'id',
    message: 'Conversation not found',
  });

  const chatObj = chat?.toObject();
  return {
    ...chatObj,
    userId: chatObj.userId.toString(),
    _id: chatObj._id.toString(),
  } as Chat;
};

export const sendMessage = async (
  conversationId: string,
  userId: string,
  message: string,
): Promise<ChatMessage> => {
  // Get conversation
  const chat = await ChatModel.findOne({
    _id: conversationId,
    userId,
    isActive: true,
  });

  if (!chat) {
    throw AppError.notFound('Conversation not found');
  }

  // Add user message
  const userMessage: ChatMessage = {
    role: 'user',
    content: message,
    createdAt: new Date(),
  };

  chat.messages.push(userMessage);

  // Update title if it's the first message
  if (chat.messages.length === 1) {
    chat.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
  }

  // Build context from recent messages (last 6 messages for context)
  const recentMessages = chat.messages.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Call AI agent
  const context = recentMessages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');

  const prompt = `${context}\n\nUser: ${message}\n\nAssistant:`;

  try {
    const result = await run(islamicAssistantAgent, prompt);
    const assistantResponse = result.finalOutput || '';

    // Extract sources
    const sources = extractSources(assistantResponse);

    // Add assistant message
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: assistantResponse,
      sources,
      createdAt: new Date(),
    };

    chat.messages.push(assistantMessage);
    await chat.save();

    return assistantMessage;
  } catch (error) {
    logger.error(error, 'Error generating AI response');
    throw new AppError('Failed to generate response', 500);
  }
};

export const deleteConversation = async (conversationId: string, userId: string): Promise<void> => {
  const result = await ChatModel.updateOne({ _id: conversationId, userId }, { isActive: false });

  if (result.matchedCount === 0) {
    throw AppError.notFound('Conversation not found');
  }
};

export const deleteAllConversations = async (userId: string): Promise<void> => {
  await ChatModel.updateMany({ userId, isActive: true }, { isActive: false });
};
