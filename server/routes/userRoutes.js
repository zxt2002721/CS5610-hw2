const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { createSession, removeSession, getSession } = require('../utils/sessionStore');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

router.get('/user/isLoggedIn', async (req, res) => {
  if (!req.cookies?.sessionId) {
    return res.json({ loggedIn: false });
  }
  const session = getSession(req.cookies.sessionId);
  if (!session) {
    return res.json({ loggedIn: false });
  }
  const user = await User.findById(session.userId);
  if (!user) {
    removeSession(req.cookies.sessionId);
    return res.json({ loggedIn: false });
  }
  return res.json({ loggedIn: true, username: user.username, wins: user.wins });
});

router.post('/user/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmed = username.trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    const existing = await User.findOne({ username: trimmed });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username: trimmed, passwordHash });
    const sessionId = createSession(user);
    res.cookie('sessionId', sessionId, cookieOptions);
    return res.status(201).json({ username: user.username });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Unable to register' });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const sessionId = createSession(user);
    res.cookie('sessionId', sessionId, cookieOptions);
    return res.json({ username: user.username });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Unable to login' });
  }
});

router.post('/logout', (req, res) => {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) {
    removeSession(sessionId);
  }
  res.clearCookie('sessionId', { path: '/' });
  return res.json({ ok: true });
});

module.exports = router;
