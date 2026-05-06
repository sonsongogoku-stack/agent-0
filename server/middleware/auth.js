const jwt = require('jsonwebtoken');

const JWT_SECRET = 'agent-0-dev-secret-2026';
const JWT_EXPIRY = '7d';

function generateToken(user) {
  return jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权，请先登录', code: 'NO_TOKEN' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.userId, phone: payload.phone };
    next();
  } catch (e) {
    return res.status(401).json({ error: '登录已过期，请重新登录', code: 'TOKEN_EXPIRED' });
  }
}

module.exports = { generateToken, authMiddleware, JWT_SECRET };
