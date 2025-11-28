import { createQueue, createWorker, defaultJobOptions } from '@/config';
import { logger } from '@/utils';
import { Job } from 'bullmq';

export const testQueue = createQueue('testQueue');

export const addTestJob = async (name: string, data: any) => {
  return testQueue.add(name, data, defaultJobOptions);
};

export const initTestWorker = () => {
  try {
    const worker = createWorker('testQueue', async (job: Job) => {
      logger.info({ id: job.id, name: job.name, data: job.data }, 'Processing job');
    });
    worker.on('completed', (job) => logger.info({ id: job.id }, 'Job completed'));
    worker.on('failed', (job, err) => logger.error({ id: job?.id, error: err }, 'Job failed'));
    return worker;
  } catch (err) {
    logger.error({ error: err }, 'Failed to initialize test worker');
    return undefined as any;
  }
};
