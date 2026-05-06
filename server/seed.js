const { getDb } = require('./db');

function seedIfEmpty() {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (count > 0) return;

  console.log('[seed] Seeding initial data...');

  const now = new Date();

  // ── Demo user ──
  db.prepare(`INSERT INTO users (id, phone, balance) VALUES (1, '13800001234', 236.20)`).run();

  // ── 9 Agents (same data as frontend data.jsx, minus JSX glyphs) ──
  const agents = [
    {
      id: 'ai-canvas', code: 'AGT-009',
      name_en: 'AI Canvas', name_zh: 'Atelier 画布',
      category: 'GENERATION 生成',
      tagline: '多模型生成画布。节点编排、文生图、图生图——自由组合工作流。',
      price_per_run: 0.01, price_subscribed: 0.01,
      subscription_monthly: 0, subscription_included: 0,
      runs: 1, avg_latency_ms: 0,
      cover: 'radial-gradient(ellipse at 50% 30%, #1a2a3a 0%, #0D0E13 70%, #0a0a0f 100%)',
      photo: '',
      photo_credit: '',
      input_type: 'canvas',
      accent: '#60A5FA',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['文生图 · 图生图', '多模型切换', '节点编排工作流', '本地存储'])
    },
    {
      id: 'jobs-qa', code: 'AGT-001',
      name_en: 'Jobs Q&A', name_zh: '乔布斯问答',
      category: 'DIALOGUE 对话',
      tagline: '向史蒂夫·乔布斯请教产品、设计与领导力。基于公开演讲与著作训练。',
      price_per_run: 0.50, price_subscribed: 0.10,
      subscription_monthly: 19, subscription_included: 200,
      runs: 184293, avg_latency_ms: 1800,
      cover: 'radial-gradient(ellipse at 30% 30%, #3a1d10 0%, #1F1F24 60%, #0D0E13 100%)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'a thoughtful man in glasses',
      input_type: 'chat',
      accent: '#FF5A1F',
      sample_questions: JSON.stringify([
        '下一代消费电子产品最重要的是什么？',
        '如何把一支团队从零带到 100 人？',
        '为什么字体在产品里如此关键？',
        '面对失败，你会怎么重新出发？'
      ]),
      sample_answer: 'Focus and simplicity. 简单比复杂更难——你必须努力让你的思考变得清晰，从而让它变得简单。但最终是值得的，因为一旦你做到了，你就能撼动山岳。',
      capabilities: JSON.stringify(['训练于 1000+ 公开演讲与采访', '支持中英文提问', '保留语气与个人观点', '拒绝臆造未公开事实'])
    },
    {
      id: 'txt2img', code: 'AGT-002',
      name_en: 'Text → Image', name_zh: '文生图',
      category: 'GENERATION 生成',
      tagline: '高保真图像生成。支持中英文 prompt、多尺寸输出与风格预设。',
      price_per_run: 0.80, price_subscribed: 0.20,
      subscription_monthly: 39, subscription_included: 300,
      runs: 902451, avg_latency_ms: 8200,
      cover: 'radial-gradient(ellipse at 70% 30%, #DE0541 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, #FF5A1F 0%, transparent 50%), linear-gradient(135deg, #14161C 0%, #1F1F24 100%)',
      photo: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'warm mountain landscape at golden hour',
      input_type: 'prompt',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['1024×1024 / 1024×1536 / 1536×1024', '中英文提示词', '12 种风格预设', '种子值锁定 + 多图变体'])
    },
    {
      id: 'translate', code: 'AGT-003',
      name_en: 'Translate', name_zh: '翻译',
      category: 'LANGUAGE 语言',
      tagline: '中英日韩法德六语互译，保留语境与术语一致性。',
      price_per_run: 0.05, price_subscribed: 0.01,
      subscription_monthly: 9, subscription_included: 1000,
      runs: 1245019, avg_latency_ms: 600,
      cover: 'radial-gradient(ellipse at 50% 50%, #2a1810 0%, #14161C 70%, #0D0E13 100%)',
      photo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'two people in conversation across a desk',
      input_type: 'translate',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['中 / 英 / 日 / 韩 / 法 / 德 / 西', '术语库一致性', '上下文记忆 4K tokens', '同义改写选项'])
    },
    {
      id: 'code-asst', code: 'AGT-004',
      name_en: 'Code Pilot', name_zh: '代码助手',
      category: 'DEVELOPER 开发',
      tagline: '多语言代码补全、解释与重构。',
      price_per_run: 0.10, price_subscribed: 0.02,
      subscription_monthly: 29, subscription_included: 500,
      runs: 488203, avg_latency_ms: 2200,
      cover: 'radial-gradient(ellipse at 80% 20%, #1f3a3a 0%, transparent 50%), linear-gradient(135deg, #0D1A1A 0%, #14161C 100%)',
      photo: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'developer at keyboard, candid',
      input_type: 'prompt',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['Python / JS / TS / Rust / Go', '代码解释 + 重构', 'Test 生成', '多文件上下文'])
    },
    {
      id: 'doc-summ', code: 'AGT-005',
      name_en: 'Doc Digest', name_zh: '文档摘要',
      category: 'ANALYSIS 分析',
      tagline: '上传 PDF / Word，获得关键要点与结构化摘要。',
      price_per_run: 0.30, price_subscribed: 0.08,
      subscription_monthly: 19, subscription_included: 200,
      runs: 152093, avg_latency_ms: 3400,
      cover: 'radial-gradient(ellipse at 30% 70%, #2a1810 0%, transparent 50%), linear-gradient(135deg, #1F1F24 0%, #14161C 100%)',
      photo: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'reader with open book and notes',
      input_type: 'prompt',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['PDF / Word / TXT 上传', '结构化摘要输出', '关键数据提取', '多文档对比'])
    },
    {
      id: 'voice-clone', code: 'AGT-006',
      name_en: 'Voice Cast', name_zh: '声音克隆',
      category: 'AUDIO 音频',
      tagline: '30 秒样本即可生成你的专属声音模型。',
      price_per_run: 0.60, price_subscribed: 0.15,
      subscription_monthly: 49, subscription_included: 100,
      runs: 38221, avg_latency_ms: 5400,
      cover: 'radial-gradient(ellipse at 50% 50%, #2A1810 0%, transparent 60%), linear-gradient(135deg, #0D0E13 0%, #14161C 100%)',
      photo: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'hand holding a vintage microphone',
      input_type: 'prompt',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['30s 样本训练', '多情感风格', '实时合成', '中英文支持'])
    },
    {
      id: 'video-gen', code: 'AGT-007',
      name_en: 'Video Forge', name_zh: '视频生成',
      category: 'GENERATION 生成',
      tagline: '5 秒短视频生成，支持运镜与风格控制。',
      price_per_run: 4.50, price_subscribed: 1.20,
      subscription_monthly: 99, subscription_included: 60,
      runs: 22087, avg_latency_ms: 28000,
      cover: 'radial-gradient(ellipse at 60% 40%, #4a2418 0%, transparent 60%), linear-gradient(135deg, #2A1810 0%, #1F1F24 100%)',
      photo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'warm cinematic film reel',
      input_type: 'prompt',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['5s 短视频', '运镜控制', '风格迁移', '多比例输出'])
    },
    {
      id: 'data-viz', code: 'AGT-008',
      name_en: 'Chart Lab', name_zh: '图表实验室',
      category: 'ANALYSIS 分析',
      tagline: '把 CSV / Excel 转成可解释的图表与洞察。',
      price_per_run: 0.20, price_subscribed: 0.05,
      subscription_monthly: 19, subscription_included: 300,
      runs: 71089, avg_latency_ms: 2600,
      cover: 'radial-gradient(ellipse at 20% 80%, #2a1810 0%, transparent 60%), linear-gradient(135deg, #14161C 0%, #1F1F24 100%)',
      photo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
      photo_credit: 'analyst with charts on laptop',
      input_type: 'prompt',
      accent: '#FF5A1F',
      sample_questions: null,
      sample_answer: null,
      capabilities: JSON.stringify(['CSV / Excel 导入', '自动图表生成', '异常检测', '导出 PNG / PDF'])
    }
  ];

  const insertAgent = db.prepare(`
    INSERT INTO agents (id, code, name_en, name_zh, category, tagline,
      price_per_run, price_subscribed, subscription_monthly, subscription_included,
      runs, avg_latency_ms, cover, photo, photo_credit, accent, input_type,
      sample_questions, sample_answer, capabilities)
    VALUES (@id, @code, @name_en, @name_zh, @category, @tagline,
      @price_per_run, @price_subscribed, @subscription_monthly, @subscription_included,
      @runs, @avg_latency_ms, @cover, @photo, @photo_credit, @accent, @input_type,
      @sample_questions, @sample_answer, @capabilities)
  `);
  for (const a of agents) {
    insertAgent.run(a);
  }

  // ── OTP code for demo (123456, never expires) ──
  const farFuture = '2030-12-31 23:59:59';
  db.prepare(`DELETE FROM otp_codes WHERE phone = '13800001234' AND code = '123456'`).run();
  db.prepare(`INSERT INTO otp_codes (phone, code, expires_at, used) VALUES ('13800001234', '123456', ?, 0)`).run(farFuture);

  // ── Demo subscription ──
  db.prepare(`INSERT INTO subscriptions (user_id, agent_id, since, renews_on, monthly, used, included)
    VALUES (1, 'txt2img', '2026.04.04', '2026.06.04', 39, 87, 300)`).run();

  // ── Demo transactions ──
  const transactions = [
    { id: 'TXN-20260501-A8F3', user_id: 1, type: 'RUN', agent_id: 'jobs-qa', agent_name: 'Jobs Q&A 乔布斯问答', amount: -0.10, balance_before: 184.30, balance_after: 184.20, status: 'OK', created_at: '2026-05-05 14:32:11' },
    { id: 'TXN-20260501-A8E2', user_id: 1, type: 'RUN', agent_id: 'txt2img', agent_name: 'Text → Image 文生图', amount: -0.20, balance_before: 184.50, balance_after: 184.30, status: 'OK', created_at: '2026-05-05 14:24:08' },
    { id: 'TXN-20260501-A8D1', user_id: 1, type: 'RUN', agent_id: 'txt2img', agent_name: 'Text → Image 文生图', amount: -0.20, balance_before: 184.70, balance_after: 184.50, status: 'OK', created_at: '2026-05-05 14:22:45' },
    { id: 'TXN-20260430-B8C9', user_id: 1, type: 'TOPUP', agent_id: null, agent_name: 'Wallet Top-up 余额充值', amount: 100.00, balance_before: 84.70, balance_after: 184.70, status: 'OK', created_at: '2026-05-04 21:08:33' },
    { id: 'TXN-20260430-B8B4', user_id: 1, type: 'SUB', agent_id: 'txt2img', agent_name: 'Text → Image 月度订阅', amount: -39.00, balance_before: 123.70, balance_after: 84.70, status: 'OK', created_at: '2026-05-04 18:14:02' },
    { id: 'TXN-20260430-B8A7', user_id: 1, type: 'RUN', agent_id: 'translate', agent_name: 'Translate 翻译', amount: -0.01, balance_before: 123.71, balance_after: 123.70, status: 'OK', created_at: '2026-05-04 17:55:21' },
    { id: 'TXN-20260429-C7F1', user_id: 1, type: 'RUN', agent_id: 'jobs-qa', agent_name: 'Jobs Q&A 乔布斯问答', amount: -0.50, balance_before: 124.21, balance_after: 123.71, status: 'OK', created_at: '2026-05-03 09:32:48' },
    { id: 'TXN-20260429-C7E5', user_id: 1, type: 'RUN', agent_id: 'txt2img', agent_name: 'Text → Image 文生图', amount: 0.00, balance_before: 124.21, balance_after: 124.21, status: 'ROLLBACK', created_at: '2026-05-03 09:28:17' }
  ];
  const insertTxn = db.prepare(`
    INSERT INTO transactions (id, user_id, type, agent_id, agent_name, amount, balance_before, balance_after, status, created_at)
    VALUES (@id, @user_id, @type, @agent_id, @agent_name, @amount, @balance_before, @balance_after, @status, @created_at)
  `);
  for (const t of transactions) {
    insertTxn.run(t);
  }

  console.log('[seed] Done — 1 user, 9 agents, 1 subscription, 8 transactions, 1 demo OTP.');
}

// Always ensure a fresh demo OTP exists (runs on every server start)
function ensureDemoOtp() {
  const db = getDb();
  const farFuture = '2030-12-31 23:59:59';
  const existing = db.prepare(`SELECT id FROM otp_codes WHERE phone = '13800001234' AND code = '123456' AND used = 0`).get();
  if (!existing) {
    db.prepare(`DELETE FROM otp_codes WHERE phone = '13800001234' AND code = '123456'`).run();
    db.prepare(`INSERT INTO otp_codes (phone, code, expires_at, used) VALUES ('13800001234', '123456', ?, 0)`).run(farFuture);
    console.log('[seed] Demo OTP refreshed (123456)');
  }
}

module.exports = { seedIfEmpty, ensureDemoOtp };
