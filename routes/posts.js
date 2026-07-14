const express = require('express');
const blogStore = require('../data/blogs');
const { requireAuth, requireOwnership } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await blogStore.getAllBlogs();
    res.json({ posts });
  } catch (err) {
    console.error('Failed to load posts:', err);
    res.status(500).json({
      error: 'Unable to load posts. Check your database connection.',
      posts: [],
    });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const post = await blogStore.getBlogById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json({ post });
  } catch (err) {
    console.error('Failed to load post:', err);
    res.status(500).json({ error: 'Unable to load this post.' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, content } = req.body;
  const user = req.session.user;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Please fill in the title and content.' });
  }

  try {
    const post = await blogStore.createBlog({
      creatorName: user.name,
      creatorUserId: user.userId,
      title,
      body: content,
    });
    res.status(201).json({ post });
  } catch (err) {
    console.error('Failed to create post:', err);
    res.status(500).json({ error: 'Unable to save your post. Please try again.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  try {
    const post = await blogStore.getBlogById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (!requireOwnership(post, req.session.user)) {
      return res.status(403).json({
        error: 'You can only edit posts you created.',
      });
    }

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const updated = await blogStore.updateBlog(id, { title, body: content });
    res.json({ post: updated });
  } catch (err) {
    console.error('Failed to update post:', err);
    res.status(500).json({ error: 'Unable to update this post.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const post = await blogStore.getBlogById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (!requireOwnership(post, req.session.user)) {
      return res.status(403).json({
        error: 'You can only delete posts you created.',
      });
    }

    await blogStore.deleteBlog(id);
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    console.error('Failed to delete post:', err);
    res.status(500).json({ error: 'Unable to delete this post.' });
  }
});

module.exports = router;
