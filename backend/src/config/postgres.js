const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'ciphersqlstudio',
});

const connectPostgres = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL connected');
        client.release();
    } catch (err) {
        console.error('❌ PostgreSQL connection failed:', err.message);
        process.exit(1);
    }
};

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query, connectPostgres };
