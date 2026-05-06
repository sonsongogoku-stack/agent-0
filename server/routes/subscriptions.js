const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/subscriptions
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT s.*, a.code as agent_code, a.name_en as agent_name_en, a.name_zh as agent_name_zh,
           a.category as agent_category, a.price_per_run, a.price_subscribed
    FROM subscriptions s
    JOIN agents a ON a.id = s.agent_id
    WHERE s.user_id = ? AND s.active = 1
    ORDER BY s.created_at DESC
  `).all(req.user.userId);
  res.json(rows);
});

// POST /api/subscriptions
router.post('/', (req, res) => {
  const { agentId } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });

  const db = getDb();
  const uid = req.user.userId;

  // Check existing active subscription
  const existing = db.prepare(
    'SELECT id FROM subscriptions WHERE user_id = ? AND agent_id = ? AND active = 1'
  ).get(uid, agentId);
  if (existing) return res.status(409).json({ error: '已订阅该智能体' });

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(uid);
  if (!user || user.balance < agent.subscription_monthly) {
    return res.status(400).json({ error: '余额不足' });
  }

  const cost = agent.subscription_monthly;
  const oldBalance = user.balance;
  const newBalance = oldBalance - cost;

  const pad = n => String(n).padStart(2, '0');
  const d = new Date();
  const since = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`;
  const renew = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const renewsOn = `${renew.getFullYear()}.${pad(renew.getMonth()+1)}.${pad(renew.getDate())}`;
  const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${String(Math.random()).slice(2, 6)}`;

  const subResult = db.prepare(`
    INSERT INTO subscriptions (user_id, agent_id, since, renews_on, monthly, used, included)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(uid, agentId, since, renewsOn, cost, agent.subscription_included);

  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, uid);
  db.prepare(`
    INSERT INTO transactions (id, user_id, type, agent_id, agent_name, amount, balance_before, balance_after, status)
    VALUES (?, ?, 'SUB', ?, ?, ?, ?, ?, 'OK')
  `).run(txnId, uid, agentId, `${agent.name_en} 月度订阅`, -cost, oldBalance, newBalance);

  res.json({
    subscription: {
      id: subResult.lastInsertRowid,
      agentId,
      since,
      renewsOn,
      monthly: cost,
      used: 0,
      included: agent.subscription_included,
      autoRenew: true
    },
    balance: newBalance
  });
});

// DELETE /api/subscriptions/:agentId
router.delete('/:agentId', (req, res) => {
  const db = getDb();
  const result = db.prepare(
    'UPDATE subscriptions SET active = 0 WHERE user_id = ? AND agent_id = ? AND active = 1'
  ).run(req.user.userId, req.params.agentId);

  if (result.changes === 0) return res.status(404).json({ error: '未找到订阅' });
  res.json({ ok: true });
});

module.exports = router;
