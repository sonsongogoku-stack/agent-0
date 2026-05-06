// AGENT-0 — API service layer

const API_BASE = '';  // same-origin

const api = {
  getToken: () => localStorage.getItem('token'),

  get: async (path) => {
    const headers = {};
    const token = api.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/api${path}`, { headers });
    if (res.status === 401 && token) {
      localStorage.removeItem('token');
      window.location.reload();
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },

  post: async (path, body) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = api.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/api${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (res.status === 401 && token) {
      localStorage.removeItem('token');
      window.location.reload();
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },

  del: async (path) => {
    const headers = {};
    const token = api.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/api${path}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },

  // Fetch agents from API and merge with local glyphs
  fetchAgents: async () => {
    const data = await api.get('/agents');
    return data.map(a => ({
      id: a.id,
      code: a.code,
      nameEn: a.name_en,
      nameZh: a.name_zh,
      category: a.category,
      tagline: a.tagline,
      pricePerRun: a.price_per_run,
      priceSubscribed: a.price_subscribed,
      subscriptionMonthly: a.subscription_monthly,
      subscriptionIncluded: a.subscription_included,
      runs: a.runs,
      avgLatencyMs: a.avg_latency_ms,
      cover: a.cover || '',
      photo: a.photo || '',
      photoCredit: a.photo_credit || '',
      accent: a.accent || '#FF5A1F',
      inputType: a.input_type || 'prompt',
      sampleQuestions: a.sample_questions || [],
      sampleAnswer: a.sample_answer || '',
      capabilities: a.capabilities || [],
      glyph: window.AGENT_GLYPHS[a.id] || null
    }));
  },

  // Parse a single agent from API row
  parseAgent: (a) => ({
    id: a.id,
    code: a.code,
    nameEn: a.name_en,
    nameZh: a.name_zh,
    category: a.category,
    tagline: a.tagline,
    pricePerRun: a.price_per_run,
    priceSubscribed: a.price_subscribed,
    subscriptionMonthly: a.subscription_monthly,
    subscriptionIncluded: a.subscription_included,
    runs: a.runs,
    avgLatencyMs: a.avg_latency_ms,
    cover: a.cover || '',
    photo: a.photo || '',
    photoCredit: a.photo_credit || '',
    accent: a.accent || '#FF5A1F',
    inputType: a.input_type || 'prompt',
    sampleQuestions: a.sample_questions || [],
    sampleAnswer: a.sample_answer || '',
    capabilities: a.capabilities || [],
    glyph: window.AGENT_GLYPHS[a.id] || null
  })
};

Object.assign(window, { api });
