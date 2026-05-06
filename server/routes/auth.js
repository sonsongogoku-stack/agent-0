const express = require('express');
const { getDb } = require('../db');
const { generateToken } = require('../middleware/auth');
const { sendSms } = require('../sms');

const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 11) {
    return res.status(400).json({ error: '请输入有效的 11 位手机号' });
  }

  const db = getDb();
  const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);

  const result = await sendSms(phone, generatedCode);
  if (!result.ok) {
    return res.status(500).json({ error: result.message });
  }

  // Store the code that was actually sent (dev: ours, prod: from Aliyun API)
  const actualCode = result.code || generatedCode;
  db.prepare('INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)').run(phone, actualCode, expiresAt);

  res.json({ ok: true, message: result.message });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: '手机号和验证码不能为空' });
  }

  const db = getDb();

  // Demo code 123456: always works, logs in as the demo user
  if (code === '123456') {
    let user = db.prepare('SELECT id, phone, balance FROM users WHERE phone = ?').get('13800001234');
    if (!user) {
      const info = db.prepare('INSERT INTO users (phone, balance) VALUES (?, 10.00)').run('13800001234');
      user = { id: info.lastInsertRowid, phone: '13800001234', balance: 10.00 };
    }
    const token = generateToken(user);
    console.log(`[demo-login] ${phone} → demo user 13800001234`);
    return res.json({ token, user: { id: user.id, phone: user.phone, balance: user.balance } });
  }

  const record = db.prepare(
    `SELECT id FROM otp_codes WHERE phone = ? AND code = ? AND used = 0 AND expires_at > datetime('now') ORDER BY id DESC LIMIT 1`
  ).get(phone, code);

  if (!record) {
    return res.status(401).json({ error: '验证码无效或已过期' });
  }

  db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(record.id);

  // Find or create user
  let user = db.prepare('SELECT id, phone, balance FROM users WHERE phone = ?').get(phone);
  if (!user) {
    const info = db.prepare('INSERT INTO users (phone, balance) VALUES (?, 10.00)').run(phone);
    user = { id: info.lastInsertRowid, phone, balance: 10.00 };
  }

  const token = generateToken(user);

  res.json({
    token,
    user: { id: user.id, phone: user.phone, balance: user.balance }
  });
});

// POST /api/auth/dev-login  (skip OTP for development)
router.post('/dev-login', (req, res) => {
  const { phone } = req.body;
  const phoneNum = phone || '13800001234';

  const db = getDb();
  let user = db.prepare('SELECT id, phone, balance FROM users WHERE phone = ?').get(phoneNum);
  if (!user) {
    const info = db.prepare('INSERT INTO users (phone, balance) VALUES (?, 10.00)').run(phoneNum);
    user = { id: info.lastInsertRowid, phone: phoneNum, balance: 10.00 };
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, phone: user.phone, balance: user.balance } });
});

module.exports = router;
