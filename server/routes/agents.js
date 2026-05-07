const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

function parseAgent(row) {
  if (!row) return null;
  return {
    ...row,
    sample_questions: row.sample_questions ? JSON.parse(row.sample_questions) : [],
    capabilities: row.capabilities ? JSON.parse(row.capabilities) : []
  };
}

// GET /api/agents
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM agents ORDER BY CASE WHEN id = 'ai-canvas' THEN 0 ELSE 1 END, runs DESC').all();
  res.json(rows.map(parseAgent));
});

// GET /api/agents/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Agent not found' });
  res.json(parseAgent(row));
});

module.exports = router;
