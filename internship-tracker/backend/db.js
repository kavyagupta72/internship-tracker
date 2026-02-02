const { Pool } = require('pg');
require('dotenv').config();

// The Pool handles multiple connections so your app doesn't crash
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

module.exports = pool;