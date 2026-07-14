const express = require('express');
const userStore = require('../data/users');

const router = express.Router();

router.get('/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

router.post('/signup', async (req, res) => {
  const { user_id, password, name } = req.body;

  if (!user_id?.trim() || !password || !name?.trim()) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    const existing = await userStore.findByUserId(user_id.trim());
    if (existing) {
      return res.status(409).json({
        error: 'That user ID is already taken. Please choose a different one.',
      });
    }

    await userStore.createUser({
      userId: user_id.trim(),
      password,
      name: name.trim(),
    });

    res.status(201).json({ message: 'Account created. Please sign in.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/signin', async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id?.trim() || !password) {
    return res.status(400).json({
      error: 'Please enter your user ID and password.',
    });
  }

  try {
    const user = await userStore.authenticate(user_id.trim(), password);
    if (!user) {
      return res.status(401).json({
        error: 'Incorrect user ID or password. Please try again.',
      });
    }

    req.session.user = {
      userId: user.user_id,
      name: user.name,
    };

    res.json({ user: req.session.user });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to sign out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Signed out.' });
  });
});

module.exports = router;
