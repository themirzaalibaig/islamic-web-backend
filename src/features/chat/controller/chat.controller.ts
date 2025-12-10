import { Response } from 'express';
import { Res, getCurrentUserId, catchAsync } from '@/utils';
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationIdParams,
  ListConversationsQueryDto,
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  deleteAllConversations,
} from '@/features/chat';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

export const createConversationController = catchAsync(
  async (req: AuthenticatedRequest<unknown, CreateConversationDto>, res: Response) => {
    const userId = getCurrentUserId(req);
    const chat = await createConversation(userId, req.body.title);
    return Res.created(res, { chat });
  },
);

export const getConversationsController = catchAsync(
  async (req: AuthenticatedRequest<ListConversationsQueryDto>, res: Response) => {
    const userId = getCurrentUserId(req);
    const { page = 1, limit = 20 } = req.query;
    const result = await getConversations(userId, page, limit);

    return Res.paginated(res, { chats: result.chats }, result.total, page, limit);
  },
);

export const getConversationController = catchAsync(
  async (req: AuthenticatedRequest<unknown, unknown, ConversationIdParams>, res: Response) => {
    const userId = getCurrentUserId(req);
    const chat = await getConversation(req.params.id, userId);
    return Res.success(res, { chat });
  },
);

export const sendMessageController = catchAsync(
  async (
    req: AuthenticatedRequest<unknown, SendMessageDto, ConversationIdParams>,
    res: Response,
  ) => {
    const userId = getCurrentUserId(req);
    const { id } = req.params;
    const { message } = req.body;
    const assistantMessage = await sendMessage(id, userId, message);
    return Res.success(res, { message: assistantMessage });
  },
);

export const deleteConversationController = catchAsync(
  async (req: AuthenticatedRequest<unknown, unknown, ConversationIdParams>, res: Response) => {
    const userId = getCurrentUserId(req);
    await deleteConversation(req.params.id, userId);
    return Res.success(res, {}, 'Conversation deleted successfully');
  },
);

export const deleteAllConversationsController = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    await deleteAllConversations(userId);
    return Res.success(res, {}, 'All conversations deleted successfully');
  },
);
