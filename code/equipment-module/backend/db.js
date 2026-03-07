const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
    user: 'postgres',          // default user
    host: 'localhost',
    database: 'gympappa_db',  // the database you created
    password: 'Dewondara29',  // ⚠️ change this
    port: 5432,
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to PostgreSQL ✅');
        release();
    }
});

module.exports = pool;