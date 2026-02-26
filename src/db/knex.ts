import Knex from 'knex';

const config = {
    client: 'better-sqlite3',
    connection: {
        filename: process.env.DB_PATH || './dev.sqlite3',
    },
    useNullAsDefault: true,
}

const db = Knex(config);

export async function checkConnection(): Promise<void> {
    await db.raw('select 1');
}

export default db;
