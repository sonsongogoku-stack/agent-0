const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      balance REAL NOT NULL DEFAULT 0.00,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name_en TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      category TEXT NOT NULL,
      tagline TEXT NOT NULL,
      price_per_run REAL NOT NULL,
      price_subscribed REAL NOT NULL,
      subscription_monthly REAL NOT NULL,
      subscription_included INTEGER NOT NULL,
      runs INTEGER NOT NULL DEFAULT 0,
      avg_latency_ms INTEGER NOT NULL DEFAULT 1000,
      cover TEXT,
      photo TEXT,
      photo_credit TEXT,
      accent TEXT DEFAULT '#FF5A1F',
      input_type TEXT DEFAULT 'chat',
      sample_questions TEXT,
      sample_answer TEXT,
      capabilities TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('RUN','TOPUP','SUB','REFUND')),
      agent_id TEXT,
      agent_name TEXT,
      amount REAL NOT NULL,
      balance_before REAL NOT NULL,
      balance_after REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'OK' CHECK(status IN ('OK','ROLLBACK','PENDING')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      agent_id TEXT NOT NULL,
      since TEXT NOT NULL,
      renews_on TEXT NOT NULL,
      monthly REAL NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      included INTEGER NOT NULL,
      auto_renew INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      agent_id TEXT NOT NULL,
      input_type TEXT,
      prompt TEXT,
      translate_to TEXT,
      result TEXT,
      charge REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'completed',
      latency_ms INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_runs_user ON runs(user_id);
    CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);
  `);
}

module.exports = { getDb };
