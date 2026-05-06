const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// POST /api/dev/reset-balance
router.post('/reset-balance', (req, res) => {
  const { amount } = req.body;
  if (amount === undefined || amount === null) return res.status(400).json({ error: 'amount required' });

  const db = getDb();
  const uid = req.user.userId;
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(uid);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const oldBalance = user.balance;
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(amount, uid);

  res.json({ balance: amount, previousBalance: oldBalance });
});

module.exports = router;
