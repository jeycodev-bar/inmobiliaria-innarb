import { Pool } from 'pg';
import 'dotenv/config';

if (
    !process.env.DB_USER ||
    !process.env.DB_NAME ||
    !process.env.DB_PASSWORD
) {
    throw new Error(
        'Error: Faltan variables de entorno críticas para la base de datos (DB_USER, DB_NAME, DB_PASSWORD).'
    );
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export default pool;