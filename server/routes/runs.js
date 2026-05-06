const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// POST /api/runs  — execute and pre-charge
router.post('/', (req, res) => {
  const { agentId, prompt, translateTo } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });

  const db = getDb();
  const uid = req.user.userId;

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  // Determine price (subscription or pay-as-you-go)
  const sub = db.prepare(
    'SELECT * FROM subscriptions WHERE user_id = ? AND agent_id = ? AND active = 1'
  ).get(uid, agentId);
  const charge = sub ? agent.price_subscribed : agent.price_per_run;

  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(uid);
  if (!user || user.balance < charge) {
    return res.status(400).json({ error: '余额不足', charge, balance: user?.balance || 0 });
  }

  const oldBalance = user.balance;
  const newBalance = oldBalance - charge;

  const runId = `RUN-${Date.now().toString(36).toUpperCase()}-${String(Math.random()).slice(2, 6)}`;
  const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${String(Math.random()).slice(2, 6)}`;

  // We want to generate a mock result client-side, so store the run as pending first
  // then the client will decide the result
  db.prepare(`
    INSERT INTO runs (id, user_id, agent_id, prompt, translate_to, charge, status, latency_ms)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(runId, uid, agentId, prompt, translateTo || null, charge, agent.avg_latency_ms);

  // Pre-charge balance
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, uid);
  db.prepare(`
    INSERT INTO transactions (id, user_id, type, agent_id, agent_name, amount, balance_before, balance_after, status)
    VALUES (?, ?, 'RUN', ?, ?, ?, ?, ?, 'OK')
  `).run(txnId, uid, agentId, `${agent.name_en} ${agent.name_zh}`, -charge, oldBalance, newBalance);

  // Update agent run count
  db.prepare('UPDATE agents SET runs = runs + 1 WHERE id = ?').run(agentId);

  // Update subscription usage if subscribed
  if (sub) {
    db.prepare('UPDATE subscriptions SET used = used + 1 WHERE id = ?').run(sub.id);
  }

  res.json({
    runId,
    charge,
    balanceBefore: oldBalance,
    balanceAfter: newBalance,
    agentId: agent.id,
    agentName: agent.name_en,
    latencyMs: agent.avg_latency_ms
  });
});

// GET /api/runs?limit=20&offset=0
router.get('/', (req, res) => {
  const db = getDb();
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;

  const total = db.prepare('SELECT COUNT(*) as c FROM runs WHERE user_id = ?').get(req.user.userId).c;
  const rows = db.prepare(
    'SELECT r.*, a.name_en as agent_name_en, a.name_zh as agent_name_zh FROM runs r JOIN agents a ON a.id = r.agent_id WHERE r.user_id = ? ORDER BY r.created_at DESC LIMIT ? OFFSET ?'
  ).all(req.user.userId, limit, offset);

  res.json({ runs: rows, total, limit, offset });
});

// PATCH /api/runs/:id  — update run result/status (called after client finishes animation)
router.patch('/:id', (req, res) => {
  const { result, status } = req.body;
  const db = getDb();
  db.prepare('UPDATE runs SET result = ?, status = ? WHERE id = ? AND user_id = ?')
    .run(result || null, status || 'completed', req.params.id, req.user.userId);
  res.json({ ok: true });
});

module.exports = router;
