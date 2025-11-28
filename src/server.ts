import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { v4 as uuid } from 'uuid';
import routes from '@/routes';
import { env, connectMongo, connectRedis } from '@/config';
import { logger, Res, initTestWorker, addTestJob, initWebsocket } from '@/utils';
import { apiRateLimiter } from '@/middlewares';

const app = express();

app.use((req, _res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuid();
  next();
});

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.use((req, _res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Request');
  next();
});

app.use(env.BASE_API_PATH, routes);
app.use(env.VERSIONED_API_PATH, routes);

app.use((req, res) => {
  return Res.notFound(res, 'Route not found');
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ error: err }, 'Unhandled error');
  return Res.internalError(res);
});

app.use('/uploads', express.static(path.join(process.cwd(), env.LOCAL_UPLOAD_DIR)));

const start = async (): Promise<void> => {
  await connectMongo();
  try {
    await connectRedis();
  } catch (err) {
    logger.error({ error: err }, 'Redis init failed');
  }
  const server = http.createServer(app);
  try {
    initWebsocket(server);
  } catch (err) {
    logger.error({ error: err }, 'Websocket init failed');
  }
  try {
    initTestWorker();
  } catch (err) {
    logger.error({ error: err }, 'Queue worker init failed');
  }
  server.listen(env.PORT, () => {
    logger.info(`Server listening on port http://localhost:${env.PORT}`);
  });
  addTestJob('boot', { startedAt: Date.now() }).catch(() => {});
};

start();

export default app;
