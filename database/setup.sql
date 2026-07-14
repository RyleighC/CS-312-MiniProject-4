-- Run this script in pgAdmin against your PostgreSQL server.
-- 1. Create the database (run separately if it does not exist):
--    CREATE DATABASE "BlogDB";

-- 2. Connect to BlogDB, then run the rest of this file.

CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  blog_id SERIAL PRIMARY KEY,
  creator_name VARCHAR(255) NOT NULL,
  creator_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  date_updated TIMESTAMP
);

-- Seed users (3 accounts for sign-in testing)
INSERT INTO users (user_id, password, name) VALUES
  ('alice', 'password123', 'Alice Johnson'),
  ('bob', 'password123', 'Bob Smith'),
  ('carol', 'password123', 'Carol Williams')
ON CONFLICT (user_id) DO NOTHING;

-- Seed blogs (5 initial posts for the feed)
INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES
  (
    'Alice Johnson',
    'alice',
    'Getting Started with Inked',
    'Welcome to Inked! This platform lets you share your thoughts with the world. Sign in to create your own posts, or browse what others have written.',
    '2026-03-01 09:15:00'
  ),
  (
    'Bob Smith',
    'bob',
    'Why I Love Express.js',
    'Express.js makes building web applications fast and straightforward. Combined with EJS for templating and PostgreSQL for persistence, you get a solid full-stack foundation.',
    '2026-03-05 14:30:00'
  ),
  (
    'Carol Williams',
    'carol',
    'A Weekend in the Mountains',
    'Last weekend I hiked up to Eagle Peak. The trail was challenging but the view from the summit made every step worth it. Fresh air, quiet trails, and time to think — exactly what I needed.',
    '2026-03-10 08:00:00'
  ),
  (
    'Alice Johnson',
    'alice',
    'Tips for Better Blog Writing',
    'Keep your titles clear, open with a hook, and break long paragraphs into shorter ones. Most importantly, write about topics you genuinely care about — readers can tell.',
    '2026-03-12 16:45:00'
  ),
  (
    'Bob Smith',
    'bob',
    'PostgreSQL vs In-Memory Storage',
    'Storing blog posts in an array works for demos, but data disappears when the server restarts. PostgreSQL gives you durable storage, structured queries, and a foundation you can grow into.',
    '2026-03-14 11:20:00'
  );
