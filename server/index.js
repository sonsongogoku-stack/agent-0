const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { seedIfEmpty, ensureDemoOtp } = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;
const CANVAS_PORT = 3010;
const CANVAS_DIR = path.join(__dirname, '..', '..', 'aicanvas');
const CANVAS_URL = process.env.CANVAS_URL || '';  // set = external canvas (Docker), empty = spawn sidecar

app.use(cors());
app.use(express.json());

// Serve static files from project root
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "index.html")));
app.use(express.static(path.join(__dirname, '..')));

// Mount API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/runs', require('./routes/runs'));
app.use('/api/dev', require('./routes/dev'));

// Serve frontend config (injected before app scripts in Agent X.html)
app.get('/config.js', (req, res) => {
  res.type('js');
  const canvasUrl = process.env.CANVAS_URL || `http://localhost:${CANVAS_PORT}`;
  res.send(`window.AGENT_X_CANVAS_URL = ${JSON.stringify(canvasUrl)};`);
});

// Auto-seed database on first run
seedIfEmpty();
ensureDemoOtp();

app.listen(PORT, () => {
  console.log(`[server] AGENT-0 API running at http://localhost:${PORT}`);
  console.log(`[server] Open http://localhost:${PORT}/Agent%20X.html in browser`);
  console.log(`[server] AI Canvas agent → http://localhost:${CANVAS_PORT}`);
});

// ── Auto-start AI Canvas (Next.js) as sidecar ─────────────
// Skip sidecar when CANVAS_URL is set (Docker: separate container)
if (CANVAS_URL) {
  console.log(`[server] AI Canvas → external: ${CANVAS_URL}`);
} else if (!process.env.CANVAS_DISABLED) {
  console.log(`[server] Starting AI Canvas (Next.js) on port ${CANVAS_PORT}...`);
  const canvas = spawn('npm', ['run', 'dev'], {
    cwd: CANVAS_DIR,
    stdio: 'pipe',
    env: { ...process.env, PORT: String(CANVAS_PORT) },
  });

  canvas.stdout.on('data', (d) => {
    const line = d.toString().trim();
    if (line.includes('localhost') || line.includes('ready') || line.includes('error') || line.includes('[server]'))
      console.log(`[canvas] ${line}`);
  });
  canvas.stderr.on('data', (d) => {
    const line = d.toString().trim();
    if (line) console.log(`[canvas] ${line}`);
  });
  canvas.on('error', (err) => console.error(`[canvas] Failed to start: ${err.message}`));
  canvas.on('exit', (code) => {
    if (code !== 0) console.warn(`[canvas] Exited with code ${code} (expected if already running elsewhere)`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => { canvas.kill(); process.exit(); });
  process.on('SIGTERM', () => { canvas.kill(); process.exit(); });
} else {
  console.log(`[server] AI Canvas disabled via CANVAS_DISABLED=1`);
}
