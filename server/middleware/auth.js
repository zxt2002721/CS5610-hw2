const { getSession, removeSession } = require('../utils/sessionStore');
const User = require('../models/User');

// Attach user to the request if a valid session exists.
const attachUser = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      const session = getSession(sessionId);
      if (session?.userId) {
        const user = await User.findById(session.userId);
        if (user) {
          req.user = user;
        } else {
          removeSession(sessionId);
        }
      }
    }
  } catch (err) {
    console.error('Failed to attach user', err);
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  return next();
};

module.exports = { attachUser, requireAuth };
