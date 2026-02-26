import Knex from 'knex';

const config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
    },
}
const db = Knex(config);

export async function checkConnection(): Promise<void> {
    // simple lightweight query to verify connectivity
    await db.raw('select 1');
}

export default db;
