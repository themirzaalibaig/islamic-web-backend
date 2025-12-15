import { Router } from 'express';
import { validate, authenticate, idempotency } from '@/middlewares';
import {
  createTasbeehController,
  getTasbeehController,
  updateTasbeehController,
  deleteTasbeehController,
  listTasbeehsController,
  createTasbeehSchema,
  updateTasbeehSchema,
  tasbeehIdParamsSchema,
  listTasbeehsQuerySchema,
} from '@/features/tasbeeh';

export const tasbeehsRouter = Router();

// All routes require authentication
tasbeehsRouter.use(authenticate);

// List all tasbeehs for the authenticated user
tasbeehsRouter.get(
  '/',
  validate({ query: listTasbeehsQuerySchema }) as any,
  listTasbeehsController,
);

// Get a specific tasbeeh by ID
tasbeehsRouter.get('/:id', validate({ params: tasbeehIdParamsSchema }), getTasbeehController);

// Create a new tasbeeh
tasbeehsRouter.post(
  '/',
  validate({ body: createTasbeehSchema }),
  idempotency('createTasbeeh'),
  createTasbeehController,
);

// Update a tasbeeh by ID
tasbeehsRouter.put(
  '/:id',
  validate({ params: tasbeehIdParamsSchema, body: updateTasbeehSchema }),
  idempotency('updateTasbeeh'),
  updateTasbeehController,
);

// Delete a tasbeeh by ID
tasbeehsRouter.delete('/:id', validate({ params: tasbeehIdParamsSchema }), deleteTasbeehController);
