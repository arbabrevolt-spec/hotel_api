import dotenv from 'dotenv';
dotenv.config();
const envLoaded = !!process.env.NODE_ENV
if (!envLoaded) throw new Error("Failed to Load env")

import app from './app';
import logger from './lib/logger';
import { checkConnection } from './db/knex';

const PORT = Number(process.env.PORT) || 3000

async function start() {
  try {
    await checkConnection();
    logger.info('Database connection established');
  } catch (err: any) {
    logger.error('Unable to connect to database', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

start();
