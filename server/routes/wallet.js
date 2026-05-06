const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All wallet routes require auth
router.use(authMiddleware);

// GET /api/wallet
router.get('/', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, phone, balance FROM users WHERE id = ?').get(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ balance: user.balance, user: { id: user.id, phone: user.phone } });
});

// GET /api/wallet/stats
router.get('/stats', (req, res) => {
  const db = getDb();
  const uid = req.user.userId;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);

  const spentRow = db.prepare(
    `SELECT COALESCE(SUM(ABS(amount)), 0) as total FROM transactions WHERE user_id = ? AND type = 'RUN' AND status = 'OK' AND created_at >= ?`
  ).get(uid, thirtyDaysAgo);

  const topupsRow = db.prepare(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'TOPUP' AND status = 'OK' AND created_at >= ?`
  ).get(uid, thirtyDaysAgo);

  const runCount = db.prepare(
    `SELECT COUNT(*) as c FROM transactions WHERE user_id = ? AND type = 'RUN' AND status = 'OK' AND created_at >= ?`
  ).get(uid, thirtyDaysAgo);

  const favRow = db.prepare(
    `SELECT agent_name, COUNT(*) as c FROM transactions WHERE user_id = ? AND type = 'RUN' AND status = 'OK' AND created_at >= ? GROUP BY agent_name ORDER BY c DESC LIMIT 1`
  ).get(uid, thirtyDaysAgo);

  const topupCount = db.prepare(
    `SELECT COUNT(*) as c FROM transactions WHERE user_id = ? AND type = 'TOPUP' AND status = 'OK' AND created_at >= ?`
  ).get(uid, thirtyDaysAgo);

  const avgPerDay = runCount.c > 0 ? (spentRow.total / Math.min(runCount.c, 30)).toFixed(2) : '0.00';

  res.json({
    spent30d: spentRow.total,
    topups30d: topupsRow.total,
    topupCount: topupCount.c,
    runCount30d: runCount.c,
    avgPerDay: `¥${avgPerDay}`,
    favoriteAgent: favRow ? favRow.agent_name : 'N/A'
  });
});

// POST /api/wallet/topup
const TOPUP_PACKAGES = {
  t10: { amount: 10, bonus: 0 },
  t50: { amount: 50, bonus: 2 },
  t100: { amount: 100, bonus: 8 },
  t300: { amount: 300, bonus: 36 },
  t500: { amount: 500, bonus: 80 },
  t1000: { amount: 1000, bonus: 200 }
};

router.post('/topup', (req, res) => {
  const { packageId } = req.body;
  const pkg = TOPUP_PACKAGES[packageId];
  if (!pkg) return res.status(400).json({ error: '无效充值套餐' });

  const db = getDb();
  const uid = req.user.userId;
  const user = db.prepare('SELECT id, phone, balance FROM users WHERE id = ?').get(uid);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const credit = pkg.amount + pkg.bonus;
  const oldBalance = user.balance;
  const newBalance = oldBalance + credit;

  const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${String(Math.random()).slice(2, 6)}`;

  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, uid);
  db.prepare(`
    INSERT INTO transactions (id, user_id, type, agent_name, amount, balance_before, balance_after, status)
    VALUES (?, ?, 'TOPUP', 'Wallet Top-up 余额充值', ?, ?, ?, 'OK')
  `).run(txnId, uid, credit, oldBalance, newBalance);

  res.json({ balance: newBalance, amount: pkg.amount, bonus: pkg.bonus, transactionId: txnId });
});

module.exports = router;
