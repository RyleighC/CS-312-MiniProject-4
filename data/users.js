const pool = require('../config/db');

async function findByUserId(userId) {
  const result = await pool.query(
    'SELECT user_id, password, name FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

async function authenticate(userId, password) {
  const result = await pool.query(
    'SELECT user_id, name FROM users WHERE user_id = $1 AND password = $2',
    [userId, password]
  );
  return result.rows[0] || null;
}

async function createUser({ userId, password, name }) {
  await pool.query(
    'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)',
    [userId.trim(), password, name.trim()]
  );
}

module.exports = {
  findByUserId,
  authenticate,
  createUser,
};
