import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import router from './router';
import httpLogger from './middleware/httpLogger';
import { errorHandler } from './middleware/errorHandler';
import logger from './lib/logger';
import { setupSwagger } from './swagger';
import { sendResponse } from './lib/response';

const app = express();

// Swagger UI for auth module
setupSwagger(app);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Optional: redirect root `/` to index.html
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(express.json());
app.use(httpLogger);



// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch((err) => {
  logger.error('Failed to create uploads directory', { error: err.message });
});

// Serve uploaded listing images
app.use('/uploads', express.static(uploadsDir));

app.get('/health', async (_req, res) => {
  try {
    // verify DB connectivity on each health check
    await import('./db/knex').then(({ checkConnection }) => checkConnection());
    sendResponse(res, true, { data: { status: 'ok' } });
  } catch (err: any) {
    sendResponse(res, false, { error: 'Database connection failed' }, 500);
  }
});

app.use('/api', router);

// 404 — no route matched
app.use((_req: Request, res: Response) => {
  sendResponse(res, false, { error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404);
});

// Central error handler — must be last
app.use(errorHandler);

export default app;
