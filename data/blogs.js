const pool = require('../config/db');

function mapBlog(row) {
  return {
    id: row.blog_id,
    author: row.creator_name,
    creatorUserId: row.creator_user_id,
    title: row.title,
    content: row.body,
    createdAt: row.date_created,
    updatedAt: row.date_updated,
  };
}

async function getAllBlogs() {
  const result = await pool.query(
    'SELECT * FROM blogs ORDER BY date_created DESC'
  );
  return result.rows.map(mapBlog);
}

async function getBlogById(id) {
  const result = await pool.query(
    'SELECT * FROM blogs WHERE blog_id = $1',
    [id]
  );
  return result.rows[0] ? mapBlog(result.rows[0]) : null;
}

async function createBlog({ creatorName, creatorUserId, title, body }) {
  const result = await pool.query(
    `INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [creatorName, creatorUserId, title.trim(), body.trim()]
  );
  return mapBlog(result.rows[0]);
}

async function updateBlog(id, { title, body }) {
  const result = await pool.query(
    `UPDATE blogs
     SET title = $1, body = $2, date_updated = NOW()
     WHERE blog_id = $3
     RETURNING *`,
    [title.trim(), body.trim(), id]
  );
  return result.rows[0] ? mapBlog(result.rows[0]) : null;
}

async function deleteBlog(id) {
  const result = await pool.query(
    'DELETE FROM blogs WHERE blog_id = $1 RETURNING blog_id',
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
