require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function initDb() {
  const sqlPath = path.join(__dirname, '..', 'database', 'setup.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  await pool.query(sql);
  console.log('Database tables created and seed data inserted.');
}

initDb()
  .catch((err) => {
    console.error('Database init failed:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
