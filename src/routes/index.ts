import { Router } from 'express';
import { Res } from '@/utils';
import { env } from '@/config/env.config';
import { testsRouter } from '@/features/test';
import { uploadsRouter } from '@/features/upload';
import { authRouter } from '@/features/auth';
import { hadithsRouter } from '@/features/hadith';
import { tasbeehsRouter } from '@/features/tasbeeh';

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
router.use('/hadith', hadithsRouter);
router.use('/tasbeehs', tasbeehsRouter);
