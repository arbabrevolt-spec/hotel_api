import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });
const envLoaded = !!process.env.NODE_ENV
if (!envLoaded) throw new Error("Failed to Load env")


const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_PATH || './dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts',
    },
  },

  production: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_PATH || './hotel_db.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts',
    },
  },
};

export default config;
