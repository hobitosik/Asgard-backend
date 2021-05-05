import { createPool } from 'mysql';
const host = process.env.HOST || 'localhost';
export const pool = createPool({
    connectionLimit: 100,
    host: host,
    user: 'asgard',
    password: 'q1w2e3r4t5y6',
    database: 'asgard'
});
