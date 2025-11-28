import { Router } from 'express';
import { idempotency, validate } from '@/middlewares';
import {
  createTestSchema,
  updateTestSchema,
  testIdParamsSchema,
  listTestsQuerySchema,
  createTestController,
  getTestController,
  updateTestController,
  deleteTestController,
  listTestsController,
} from '@/features/test';

export const testsRouter = Router();

testsRouter.get('/', validate({ query: listTestsQuerySchema }), listTestsController);
testsRouter.post(
  '/',
  validate({ body: createTestSchema }),
  idempotency('createTest'),
  createTestController,
);
testsRouter.get('/:id', validate({ params: testIdParamsSchema }), getTestController);
testsRouter.put(
  '/:id',
  validate({ params: testIdParamsSchema, body: updateTestSchema }),
  updateTestController,
);
testsRouter.delete('/:id', validate({ params: testIdParamsSchema }), deleteTestController);
