const { v4: uuidv4 } = require('uuid');

const sessions = new Map();

const createSession = (user) => {
  const sessionId = uuidv4();
  sessions.set(sessionId, { userId: user._id?.toString(), username: user.username });
  return sessionId;
};

const getSession = (sessionId) => {
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
};

const removeSession = (sessionId) => {
  if (!sessionId) return;
  sessions.delete(sessionId);
};

module.exports = {
  createSession,
  getSession,
  removeSession,
};
