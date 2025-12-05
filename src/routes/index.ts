import { Router } from 'express';
import { Res } from '@/utils';
import { env } from '@/config/env.config';
import { testsRouter } from '@/features/test';
import { uploadsRouter } from '@/features/upload';
import { authRouter } from '@/features/auth';

export const router = Router();

router.get('/health', (req, res) => {
  return Res.success(
    res,
    {
      status: 'ok',
    },
    'Service healthy',
    undefined,
    {
      version: env.API_VERSION,
      timestamp: Date.now(),
    },
  );
});

router.use('/tests', testsRouter);
router.use('/uploads', uploadsRouter);
router.use('/auth', authRouter);

