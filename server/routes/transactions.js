const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/transactions?limit=50&offset=0
router.get('/', (req, res) => {
  const db = getDb();
  const uid = req.user.userId;
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  const offset = parseInt(req.query.offset) || 0;

  const total = db.prepare('SELECT COUNT(*) as c FROM transactions WHERE user_id = ?').get(uid).c;
  const rows = db.prepare(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(uid, limit, offset);

  res.json({ transactions: rows, total, limit, offset });
});

module.exports = router;
