// AGENT-0 — 屏幕 2 (详情 / 运行 / 钱包 / 订阅 / 弹窗)

// ── Agent Detail ───────────────────────────────────────────
const AgentDetailScreen = ({ agentId, onRun, onSubscribe, subscriptions, balance, onTopUp }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [translateTo, setTranslateTo] = useState("zh");

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/agents/${agentId}`).then(data => {
      const a = api.parseAgent(data);
      setAgent(a);
      // Set default input based on agent type
      if (a.id === "jobs-qa") setInput("下一代消费电子产品最重要的是什么？");
      else if (a.id === "txt2img") setInput("A lone astronaut on a windswept dune at sunset, cinematic, 35mm film grain");
      else if (a.id === "translate") setInput("The quality of design lies in restraint.");
      else setInput("");
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  }, [agentId]);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ width: 24, height: 24, border: "2px solid #FF5A1F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
    </div>;
  }

  if (error || !agent) {
    return <div style={{ background: "#1B1B20", border: "1px solid #FFB4AB", padding: 40, textAlign: "center" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FFB4AB", marginBottom: 8 }}>● ERROR</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E4BEB3" }}>{error || "Agent not found"}</div>
    </div>;
  }

  // ── Canvas agent: render full-page iframe ──
  if (agent.inputType === 'canvas') {
    const canvasUrl = window.AGENT_X_CANVAS_URL || 'http://localhost:3010';
    return (
      <div style={{
        position: 'fixed', top: 60, left: 220, right: 0, bottom: 0,
        background: '#0A0B10', zIndex: 10,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Agent info bar */}
        <div style={{
          height: 40, flexShrink: 0,
          background: '#121318', borderBottom: '1px solid #292A2F',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
        }}>
          <span style={{
            width: 6, height: 6, background: agent.accent || '#60A5FA', flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: '1px', color: agent.accent || '#60A5FA',
          }}>{agent.code}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#E3E1E9' }}>
            {agent.nameEn}
            <span style={{ opacity: 0.6, marginLeft: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>{agent.nameZh}</span>
          </span>
          <div style={{ flex: 1 }} />
          <a href={canvasUrl} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: '1px', color: '#E4BEB3', textDecoration: 'none',
            padding: '4px 10px', border: '1px solid #34343A',
          }}>↗ OPEN IN NEW TAB</a>
        </div>
        <iframe
          src={canvasUrl}
          title="AI Canvas"
          style={{ width: '100%', flex: 1, border: 'none' }}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    );
  }

  const sub = subscriptions.find(s => s.agentId === agentId);
  const subscribed = !!sub;
  const effectivePrice = subscribed ? agent.priceSubscribed : agent.pricePerRun;
  const canRun = balance >= effectivePrice && input.trim().length > 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
      {/* 左 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Hero */}
        <div style={{ background: agent.cover, border: "1px solid #292A2F", padding: "32px 36px", position: "relative", overflow: "hidden", minHeight: 220 }}>
          <div style={{ position: "absolute", right: -30, top: "50%", transform: "translateY(-50%) scale(1.6)", opacity: 0.4 }}>{agent.glyph}</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", color: "#FF5A1F", marginBottom: 8 }}>
              {agent.code} · {agent.category}
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 48, fontWeight: 700, lineHeight: 1.05, color: "#E3E1E9", letterSpacing: "-1.4px" }}>
              {agent.nameEn}
            </h1>
            <div style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 24, color: "#E4BEB3", opacity: 0.85, marginTop: 4, marginBottom: 16 }}>
              {agent.nameZh}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E4BEB3", opacity: 0.85, lineHeight: 1.6, maxWidth: 580 }}>
              {agent.tagline}
            </p>
            <div style={{ display: "flex", gap: 24, marginTop: 20, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3" }}>
              <span>● {agent.runs.toLocaleString()} 次累计调用</span>
              <span>· 平均延迟 {(agent.avgLatencyMs/1000).toFixed(1)}s</span>
              <span>· 99.96% 可用率</span>
            </div>
          </div>
        </div>

        {/* Run console */}
        <div style={{ background: "#1B1B20", border: "1px solid #292A2F" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #292A2F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SectionLabel num="01." en="RUN CONSOLE" zh="运行控制台" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3" }}>
              单次预扣 <span style={{ color: "#FF5A1F", fontWeight: 600 }}>¥{effectivePrice.toFixed(2)}</span>
              {subscribed && <span style={{ marginLeft: 6, opacity: 0.6 }}>(订阅价 · 节省 {Math.round((1 - agent.priceSubscribed / agent.pricePerRun) * 100)}%)</span>}
            </span>
          </div>
          <div style={{ padding: 24 }}>
            {agent.inputType === "translate" ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="SOURCE" labelZh="原文 · EN">
                  <textarea value={input} onChange={e => setInput(e.target.value)} rows={6} style={{
                    background: "#1F1F24", border: "1px solid #34343A", color: "#E3E1E9",
                    fontFamily: "'Inter', sans-serif", fontSize: 14, padding: 12, outline: "none",
                    resize: "vertical", width: "100%",
                  }}/>
                </Field>
                <Field label="TARGET LANGUAGE" labelZh="目标语言">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {[{v:"zh",l:"中文"},{v:"ja",l:"日本語"},{v:"ko",l:"한국어"},{v:"fr",l:"Français"},{v:"de",l:"Deutsch"},{v:"es",l:"Español"}].map(o => (
                      <button key={o.v} onClick={() => setTranslateTo(o.v)} style={{
                        background: translateTo === o.v ? "#FF5A1F" : "#1F1F24",
                        border: `1px solid ${translateTo === o.v ? "#FF5A1F" : "#34343A"}`,
                        color: translateTo === o.v ? "#000" : "#E3E1E9",
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600,
                        padding: "10px 0", cursor: "pointer", letterSpacing: "0.5px",
                      }}>{o.l}</button>
                    ))}
                  </div>
                </Field>
              </div>
            ) : agent.inputType === "chat" ? (
              <div>
                <Field label="YOUR QUESTION" labelZh="你的提问">
                  <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} style={{
                    background: "#1F1F24", border: "1px solid #34343A", color: "#E3E1E9",
                    fontFamily: "'Inter', sans-serif", fontSize: 15, padding: 12, outline: "none",
                    resize: "vertical", width: "100%",
                  }}/>
                </Field>
                {agent.sampleQuestions && agent.sampleQuestions.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3", marginBottom: 8 }}>SUGGESTED · 推荐提问</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {agent.sampleQuestions.map(q => (
                        <button key={q} onClick={() => setInput(q)} style={{
                          background: "#1F1F24", border: "1px solid #34343A", color: "#E4BEB3",
                          fontFamily: "'Inter', sans-serif", fontSize: 12, padding: "6px 10px", cursor: "pointer",
                        }}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Field label="PROMPT" labelZh="提示词">
                <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} style={{
                  background: "#1F1F24", border: "1px solid #34343A", color: "#E3E1E9",
                  fontFamily: "'Inter', sans-serif", fontSize: 14, padding: 12, outline: "none",
                  resize: "vertical", width: "100%",
                }}/>
              </Field>
            )}

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #292A2F", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3" }}>
                当前余额 <span style={{ color: "#E3E1E9", fontWeight: 600 }}>¥{balance.toFixed(2)}</span>
                {balance < effectivePrice && (
                  <span style={{ color: "#FFB4AB", marginLeft: 12 }}>● 余额不足 · 需充值</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {balance < effectivePrice ? (
                  <Btn variant="primary" onClick={onTopUp}>TOP-UP NOW 立即充值 →</Btn>
                ) : (
                  <Btn variant="primary" disabled={!canRun} onClick={() => onRun(input, translateTo)}>
                    {agent.inputType === "translate" ? "TRANSLATE 翻译" : agent.inputType === "chat" ? "ASK 提问" : "GENERATE 生成"} · ¥{effectivePrice.toFixed(2)} →
                  </Btn>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ background: "#1B1B20", border: "1px solid #292A2F" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #292A2F" }}>
            <SectionLabel num="02." en="PRICING COMPARISON" zh="价格对比" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: 24, borderRight: "1px solid #292A2F" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3", marginBottom: 8 }}>PAY-AS-YOU-GO 按次计费</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "#E3E1E9" }}>¥{agent.pricePerRun.toFixed(2)}<span style={{ fontSize: 14, fontWeight: 400, color: "#E4BEB3", opacity: 0.7, marginLeft: 4 }}>/ 次</span></div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", lineHeight: 1.6, marginTop: 12 }}>
                · 从余额扣费<br/>
                · 不限次数<br/>
                · 无月度承诺
              </div>
            </div>
            <div style={{ padding: 24, background: subscribed ? "rgba(255,90,31,0.04)" : "transparent", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F" }}>SUBSCRIPTION 月度订阅</div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1px", background: "#FF5A1F", color: "#000", padding: "2px 6px" }}>SAVE {Math.round((1 - agent.priceSubscribed / agent.pricePerRun) * 100)}%</span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "#FF5A1F" }}>¥{agent.subscriptionMonthly}<span style={{ fontSize: 14, fontWeight: 400, color: "#E4BEB3", opacity: 0.7, marginLeft: 4 }}>/ 月</span></div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", lineHeight: 1.6, marginTop: 12 }}>
                · 含 {agent.subscriptionIncluded} 次免费额度<br/>
                · 超出按 ¥{agent.priceSubscribed.toFixed(2)} / 次<br/>
                · 优先通道 + 长上下文
              </div>
              <div style={{ marginTop: 16 }}>
                {subscribed ? (
                  <Btn variant="secondary" disabled style={{ width: "100%" }}>● ACTIVE 已订阅</Btn>
                ) : (
                  <Btn variant="primary" onClick={() => onSubscribe(agent.id)} style={{ width: "100%" }}>SUBSCRIBE 开通订阅 →</Btn>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!subscribed && (
          <div style={{ background: "#1A1A1C", border: "1px solid #FF5A1F", padding: 20 }}>
            <SectionLabel en="UPSELL" zh="订阅更划算" />
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "#E3E1E9", marginTop: 10, lineHeight: 1.3 }}>
              月用 {Math.ceil(agent.subscriptionMonthly / agent.pricePerRun)}+ 次？订阅更省。
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", lineHeight: 1.6, marginTop: 8, marginBottom: 14 }}>
              开通月度订阅后，相同用量可大幅节省费用。
            </div>
            <Btn variant="primary" style={{ width: "100%" }} onClick={() => onSubscribe(agent.id)}>
              SUBSCRIBE ¥{agent.subscriptionMonthly}/月 →
            </Btn>
          </div>
        )}

        {subscribed && sub && (
          <div style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 20 }}>
            <SectionLabel en="MY SUBSCRIPTION" zh="我的订阅" />
            <div style={{ marginTop: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", marginBottom: 6 }}>
                <span>已用 {sub.used} / {sub.included}</span>
                <span>{Math.round(sub.used / sub.included * 100)}%</span>
              </div>
              <EnergyBar value={sub.used} max={sub.included} height={6} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.7 }}>
              下次续费 {sub.renewsOn} · ¥{sub.monthly}
            </div>
          </div>
        )}

        <div style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 20 }}>
          <SectionLabel num="" en="CAPABILITIES" zh="能力清单" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {(agent.capabilities && agent.capabilities.length > 0 ? agent.capabilities : ["功能 1", "功能 2", "功能 3", "功能 4"]).map(c => (
              <div key={c} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E3E1E9", lineHeight: 1.5 }}>
                <span style={{ color: "#FF5A1F", marginTop: 1, flexShrink: 0 }}>▸</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 20 }}>
          <SectionLabel en="OPERATIONAL DATA" zh="运行数据" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            {[
              { l: "AVG LATENCY", v: `${(agent.avgLatencyMs/1000).toFixed(1)}s` },
              { l: "SUCCESS RATE", v: "99.7%" },
              { l: "CALLS / DAY", v: "2.8K" },
              { l: "MODEL VER.", v: "v3.2.1" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3" }}>{s.l}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "#E3E1E9", marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Run / 生成中 / 结果 ──────────────────────────────────
const RunScreen = ({ agentId, prompt, translateTo, balance, onComplete, onCancel }) => {
  const [agent, setAgent] = useState(null);
  const [agentLoading, setAgentLoading] = useState(true);
  const [phase, setPhase] = useState("preflight"); // preflight | running | done | failed
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [runInfo, setRunInfo] = useState(null);
  const [runError, setRunError] = useState(null);

  // Fetch agent data
  useEffect(() => {
    api.get(`/agents/${agentId}`).then(data => {
      setAgent(api.parseAgent(data));
      setAgentLoading(false);
    }).catch(() => setAgentLoading(false));
  }, [agentId]);

  // Execute run via API
  useEffect(() => {
    if (agentLoading) return;
    api.post('/runs', { agentId, prompt, translateTo: translateTo || undefined }).then(data => {
      setRunInfo(data);
      startSimulation(data);
    }).catch(e => {
      setRunError(e.message);
      setPhase("failed");
    });
  }, [agentLoading]);

  const startSimulation = (info) => {
    const stages = [
      { ms: 400, msg: "VALIDATING PARAMETERS · 校验参数" },
      { ms: 600, msg: "PRE-AUTHORIZE BALANCE · 预扣余额" },
      { ms: 700, msg: "ROUTING TO AGENT POOL · 路由至智能体" },
      { ms: 900, msg: "INITIALIZING CONTEXT · 初始化上下文" },
      { ms: 1100, msg: "STREAMING RESPONSE · 流式输出中" },
      { ms: 700, msg: "VERIFYING OUTPUT · 验证输出" },
      { ms: 400, msg: "COMMITTING CHARGE · 提交扣费" },
    ];
    let i = 0;
    const total = stages.reduce((s, x) => s + x.ms, 0);
    let elapsed = 0;
    const next = () => {
      if (i >= stages.length) { setPhase("done"); setProgress(100); return; }
      const s = stages[i];
      setLogs(l => [...l, { ts: new Date().toLocaleTimeString("en-GB"), msg: s.msg }]);
      if (i === 1) setPhase("running");
      i++;
      elapsed += s.ms;
      setProgress(Math.min(99, (elapsed / total) * 100));
      setTimeout(next, s.ms);
    };
    next();
  };

  if (agentLoading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ width: 24, height: 24, border: "2px solid #FF5A1F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
    </div>;
  }

  // Use a fallback agent for display if fetch failed
  const displayAgent = agent || { code: "AGT-000", nameEn: "Agent", nameZh: "智能体", avgLatencyMs: 2000 };

  // Mock results for different agent types
  const result = phase === "done" ? (
    agentId === "jobs-qa" ? "Focus and simplicity. 简单比复杂更难——你必须努力让你的思考变得清晰，从而让它变得简单。但最终是值得的，因为一旦你做到了，你就能撼动山岳。"
    : agentId === "translate" ? (translateTo === "zh" ? "设计的品质在于克制。" : translateTo === "ja" ? "デザインの品質は抑制にあります。" : translateTo === "ko" ? "디자인의 품질은 절제에 있습니다." : translateTo === "fr" ? "La qualité du design réside dans la retenue." : translateTo === "de" ? "Die Qualität des Designs liegt in der Zurückhaltung." : "La calidad del diseño reside en la moderación.")
    : null
  ) : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#1B1B20", border: `1px solid ${phase === "done" ? "#FF5A1F" : "#292A2F"}` }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #292A2F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SectionLabel en={phase === "done" ? "RESULT · COMPLETE" : "EXECUTION · IN PROGRESS"} zh={phase === "done" ? "运行完成" : "运行中"} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3" }}>
              {displayAgent.code} · {displayAgent.nameEn}
            </span>
          </div>
          <div style={{ padding: 28 }}>
            {/* Error state */}
            {phase === "failed" && (
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#FFB4AB', marginBottom: 16 }}>
                  ● {runError || "运行失败"}
                </div>
                <Btn variant="secondary" onClick={onCancel}>← BACK 返回</Btn>
              </div>
            )}

            {/* Progress */}
            {phase !== "done" && phase !== "failed" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F" }}>● {phase === "preflight" ? "PRE-FLIGHT CHECKS" : "GENERATING"}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3" }}>{Math.round(progress)}%</span>
                </div>
                <EnergyBar value={progress} max={100} height={4} />
              </div>
            )}

            {phase === "done" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ width: 8, height: 8, background: "#FF5A1F" }} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F" }}>OK · 任务完成</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", marginLeft: "auto" }}>耗时 {(displayAgent.avgLatencyMs/1000).toFixed(1)}s · 已扣费 ¥{(runInfo ? runInfo.charge : 0).toFixed(2)}</span>
                </div>

                {agentId === "txt2img" ? (
                  <div>
                    <div style={{
                      width: "100%", aspectRatio: "1",
                      backgroundImage: "linear-gradient(180deg, rgba(13,14,19,0) 60%, rgba(13,14,19,0.4) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop')",
                      backgroundSize: "cover", backgroundPosition: "center",
                      border: "1px solid #292A2F", position: "relative",
                      maxWidth: 480, margin: "0 auto",
                    }}>
                      <div style={{ position: "absolute", bottom: 12, left: 12, fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(0,0,0,0.85)", background: "#FF5A1F", padding: "3px 8px" }}>1024 × 1024 · SEED 8821</div>
                      <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", background: "rgba(13,14,19,0.7)", padding: "3px 6px", border: "1px solid rgba(255,90,31,0.4)" }}>● GENERATED</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
                      <Btn variant="secondary">DOWNLOAD 下载</Btn>
                      <Btn variant="secondary">VARIATIONS 变体</Btn>
                      <Btn variant="ghost">SHARE 分享</Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#0D0E13", border: "1px solid #292A2F", padding: 24 }}>
                    <div style={{ fontFamily: "'Inter', 'Noto Sans SC', sans-serif", fontSize: agentId === "jobs-qa" ? 17 : 22, color: "#E3E1E9", lineHeight: 1.7 }}>
                      {result}
                    </div>
                    {agentId === "jobs-qa" && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #292A2F", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.6 }}>
                        — Steve Jobs · D5 Conference, 2007 (paraphrased)
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: "1px solid #292A2F" }}>
                  <Btn variant="ghost" onClick={onCancel}>← BACK 返回</Btn>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="secondary" onClick={onCancel}>NEW PROMPT 新提问</Btn>
                    <Btn variant="primary" onClick={onComplete}>CONFIRM 确认结果 →</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prompt echo */}
        <div style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 20 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3", marginBottom: 8 }}>INPUT · 你的输入</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E3E1E9", lineHeight: 1.5 }}>{prompt}</div>
        </div>
      </div>

      {/* Right log */}
      <div style={{ background: "#0D0E13", border: "1px solid #292A2F", padding: 20, display: "flex", flexDirection: "column", height: "fit-content" }}>
        <SectionLabel en="EXECUTION LOG" zh="执行日志" />
        <div style={{ marginTop: 14, fontFamily: "'Inter', monospace", fontSize: 11, color: "#E4BEB3", display: "flex", flexDirection: "column", gap: 6, maxHeight: 380, overflow: "auto" }}>
          {logs.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#FF5A1F", flexShrink: 0 }}>{l.ts}</span>
              <span>{l.msg}</span>
            </div>
          ))}
          {phase !== "done" && phase !== "failed" && <div style={{ display: "flex", gap: 8 }}><span style={{ color: "#FF5A1F" }}>···</span><span style={{ opacity: 0.5 }}>working...</span></div>}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #292A2F", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 11 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3" }}>PRE-AUTH</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9", marginTop: 2 }}>¥{runInfo ? runInfo.charge.toFixed(2) : "0.00"}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3" }}>BAL. AFTER</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9", marginTop: 2 }}>¥{(runInfo ? runInfo.balanceAfter : balance).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Wallet ────────────────────────────────────────────────
const WalletScreen = ({ balance, onTopUp }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/transactions?limit=50'),
      api.get('/wallet/stats')
    ]).then(([txData, statsData]) => {
      setTransactions(txData.transactions);
      setStats(statsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#1B1B20", border: "1px solid #FF5A1F", padding: "28px 32px", position: "relative", overflow: "hidden",
          backgroundImage: "linear-gradient(135deg, rgba(27,27,32,0.92) 0%, rgba(27,27,32,0.7) 50%, rgba(27,27,32,0.55) 100%), url('https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&q=80&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center right",
        }}>
          <SectionLabel en="WALLET BALANCE" zh="钱包余额" />
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 14, marginBottom: 14 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, color: "#E4BEB3", fontWeight: 500 }}>¥</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 64, fontWeight: 700, color: "#E3E1E9", lineHeight: 1, letterSpacing: "-2px" }}>{balance.toFixed(2)}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", marginLeft: 12 }}>CNY</span>
          </div>
          <EnergyBar value={balance} max={1000} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3" }}>
            <span>0</span><span>500</span><span>1000+</span>
          </div>
          <Btn variant="primary" onClick={onTopUp} style={{ marginTop: 20, width: "100%" }}>TOP-UP 充值 →</Btn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { l: "30D SPENT", lZh: "30 天消耗", v: stats ? `¥${stats.spent30d.toFixed(2)}` : "—", sub: stats ? `${stats.runCount30d} 次调用` : "..." },
            { l: "30D TOPUPS", lZh: "30 天充值", v: stats ? `¥${stats.topups30d.toFixed(2)}` : "—", sub: stats ? `${stats.topupCount} 次充值` : "..." },
            { l: "AVG / DAY", lZh: "日均消耗", v: stats ? stats.avgPerDay : "—", sub: stats ? `${Math.round(stats.runCount30d / 30)} 次 / 日` : "..." },
            { l: "FAVORITE", lZh: "最常用", v: stats ? stats.favoriteAgent : "—", sub: "本月" },
          ].map(s => (
            <div key={s.l} style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 20 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3" }}>{s.l} <span style={{ fontFamily: "'Noto Sans SC', sans-serif", opacity: 0.5, fontWeight: 400 }}>{s.lZh}</span></div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#E3E1E9", marginTop: 8 }}>{s.v}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#FF5A1F", marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction log */}
      <div style={{ background: "#1B1B20", border: "1px solid #292A2F" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #292A2F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionLabel num="03." en="TRANSACTION LOG" zh="交易日志" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3" }}>SHOWING {transactions.length} OF {transactions.length}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "200px 90px 1fr 100px 100px 80px", padding: "10px 20px", borderBottom: "1px solid #292A2F", fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3", textTransform: "uppercase" }}>
          <span>TXN ID / TIMESTAMP</span><span>TYPE</span><span>DESCRIPTION</span><span style={{ textAlign: "right" }}>AMOUNT</span><span style={{ textAlign: "right" }}>BALANCE</span><span style={{ textAlign: "right" }}>STATUS</span>
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3" }}>加载中...</div>
        ) : transactions.map(tx => (
          <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "200px 90px 1fr 100px 100px 80px", padding: "12px 20px", borderBottom: "1px solid #292A2F", fontFamily: "'Inter', sans-serif", fontSize: 12, alignItems: "center" }}>
            <div>
              <div style={{ color: "#E3E1E9" }}>{tx.id}</div>
              <div style={{ color: "#E4BEB3", opacity: 0.6, fontSize: 11, marginTop: 2 }}>{tx.created_at}</div>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: tx.type === "TOPUP" ? "#FF5A1F" : tx.type === "SUB" ? "#E3E1E9" : "#E4BEB3" }}>{tx.type}</span>
            <span style={{ color: "#E3E1E9" }}>{tx.agent_name}</span>
            <span style={{ textAlign: "right", color: tx.amount >= 0 ? "#FF5A1F" : "#E3E1E9", fontWeight: 500 }}>{tx.amount >= 0 ? "+" : ""}¥{tx.amount.toFixed(2)}</span>
            <span style={{ textAlign: "right", color: "#E4BEB3" }}>¥{tx.balance_after.toFixed(2)}</span>
            <span style={{ textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: tx.status === "OK" ? "#E4BEB3" : "#FFB4AB" }}>● {tx.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Subscriptions ─────────────────────────────────────────
const SubscriptionsScreen = ({ subscriptions, onOpen }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchAgents().then(data => {
      setAgents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const subbed = subscriptions.map(s => ({ ...s, agent: agents.find(a => a.id === s.agentId) })).filter(s => s.agent);
  const recommendable = agents.filter(a => !subscriptions.find(s => s.agentId === a.id)).slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <SectionLabel num="04." en="ACTIVE SUBSCRIPTIONS" zh="进行中的订阅" />
        {subbed.length === 0 ? (
          <div style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 32, marginTop: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 500, color: "#E3E1E9" }}>暂无订阅</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3", opacity: 0.7, marginTop: 6 }}>从下方智能体中选择一个开始</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 16 }}>
            {subbed.map(s => (
              <div key={s.agentId} style={{ background: "#1B1B20", border: "1px solid #292A2F", padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F" }}>{s.agent.code} · {s.agent.category}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#E3E1E9", marginTop: 6 }}>{s.agent.nameEn}</div>
                    <div style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 14, color: "#E4BEB3", opacity: 0.7 }}>{s.agent.nameZh}</div>
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1px", background: "#FF5A1F", color: "#000", padding: "3px 8px" }}>● ACTIVE</span>
                </div>
                <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3" }}>
                  <span>本月用量 {s.used} / {s.included}</span>
                  <span>{Math.round(s.used / s.included * 100)}% 已使用</span>
                </div>
                <EnergyBar value={s.used} max={s.included} height={6} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16, paddingTop: 16, borderTop: "1px solid #292A2F" }}>
                  <div><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1px", color: "#E4BEB3" }}>STARTED 起始</div><div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9", marginTop: 4 }}>{s.since}</div></div>
                  <div><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1px", color: "#E4BEB3" }}>RENEWS 续费</div><div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9", marginTop: 4 }}>{s.renewsOn}</div></div>
                  <div><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1px", color: "#E4BEB3" }}>MONTHLY</div><div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9", marginTop: 4 }}>¥{s.monthly}</div></div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Btn variant="secondary" onClick={() => onOpen(s.agentId)}>OPEN AGENT</Btn>
                  <Btn variant="ghost">MANAGE 管理</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {recommendable.length > 0 && (
        <div>
          <SectionLabel num="05." en="RECOMMENDED FOR YOU" zh="推荐订阅" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
            {recommendable.map(a => (
              <AgentCard key={a.id} agent={a} onOpen={onOpen} subscribed={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Top-up constants (unchanged from data.jsx) ────────────
const TOPUP_PACKAGES = [
  { id: "t10",  amount: 10,   bonus: 0,   tag: null },
  { id: "t50",  amount: 50,   bonus: 2,   tag: null },
  { id: "t100", amount: 100,  bonus: 8,   tag: "POPULAR 推荐" },
  { id: "t300", amount: 300,  bonus: 36,  tag: "BEST VALUE 划算" },
  { id: "t500", amount: 500,  bonus: 80,  tag: null },
  { id: "t1000",amount: 1000, bonus: 200, tag: "TIER UP 升级" },
];

// ── Top-up Modal ─────────────────────────────────────────
const TopUpModal = ({ open, onClose, onConfirm }) => {
  const [pkg, setPkg] = useState("t100");
  const [method, setMethod] = useState("alipay");
  const [phase, setPhase] = useState("select"); // select | processing | done | error
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const selected = TOPUP_PACKAGES.find(p => p.id === pkg);

  useEffect(() => { if (open) { setPhase("select"); setPkg("t100"); setError(null); } }, [open]);

  if (!open) return null;

  const handlePay = async () => {
    setPhase("processing");
    setError(null);
    try {
      const data = await api.post('/wallet/topup', { packageId: pkg });
      setResult(data);
      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase("error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="WALLET TOP-UP" titleZh="余额充值" width={640}>
      {phase === "select" && (
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3", marginBottom: 20 }}>选择充值金额。每笔充值奖励将立即到账。</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {TOPUP_PACKAGES.map(p => (
              <button key={p.id} onClick={() => setPkg(p.id)} style={{
                background: pkg === p.id ? "rgba(255,90,31,0.08)" : "#1F1F24",
                border: `1px solid ${pkg === p.id ? "#FF5A1F" : "#34343A"}`,
                padding: "16px 14px", textAlign: "left", cursor: "pointer", position: "relative",
              }}>
                {p.tag && <span style={{ position: "absolute", top: -1, right: -1, background: "#FF5A1F", color: "#000", fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "1px", padding: "2px 6px" }}>{p.tag}</span>}
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#E3E1E9" }}>¥{p.amount}</div>
                {p.bonus > 0 && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#FF5A1F", marginTop: 4 }}>+ ¥{p.bonus} 赠送</div>}
                {p.bonus === 0 && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.5, marginTop: 4 }}>无赠送</div>}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3", marginBottom: 8 }}>PAYMENT METHOD 支付方式</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ id: "alipay", name: "ALIPAY 支付宝" }, { id: "wechat", name: "WECHAT PAY 微信支付" }].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  background: method === m.id ? "rgba(255,90,31,0.08)" : "#1F1F24",
                  border: `1px solid ${method === m.id ? "#FF5A1F" : "#34343A"}`,
                  padding: "12px", cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.5px",
                  color: method === m.id ? "#FF5A1F" : "#E3E1E9",
                }}>{m.name}</button>
              ))}
            </div>
          </div>
          <div style={{ background: "#0D0E13", border: "1px solid #292A2F", padding: 16, marginBottom: 20, fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#E4BEB3", marginBottom: 4 }}><span>充值金额</span><span style={{ color: "#E3E1E9" }}>¥{selected.amount.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#E4BEB3", marginBottom: 4 }}><span>赠送额度</span><span style={{ color: "#FF5A1F" }}>+ ¥{selected.bonus.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #292A2F", marginTop: 8 }}>
              <span style={{ color: "#E4BEB3", fontWeight: 600 }}>到账金额</span>
              <span style={{ color: "#E3E1E9", fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700 }}>¥{(selected.amount + selected.bonus).toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={onClose} style={{ flex: 0 }}>CANCEL</Btn>
            <Btn variant="primary" onClick={handlePay} style={{ flex: 1 }}>
              CONFIRM PAYMENT 确认支付 ¥{selected.amount.toFixed(2)} →
            </Btn>
          </div>
        </div>
      )}

      {phase === "processing" && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 24px", border: "1px solid #FF5A1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 32, height: 32, border: "2px solid #FF5A1F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", marginBottom: 8 }}>● PROCESSING PAYMENT</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3" }}>请在 {method === "alipay" ? "支付宝" : "微信"} 完成支付。等待回调中...</div>
        </div>
      )}

      {phase === "error" && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FFB4AB", marginBottom: 10 }}>● PAYMENT FAILED</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3", marginBottom: 16 }}>{error}</div>
          <Btn variant="primary" onClick={() => setPhase("select")}>TRY AGAIN 重试 →</Btn>
        </div>
      )}

      {phase === "done" && result && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 20px", background: "#FF5A1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none"><path d="M2 11 L11 19 L26 3" stroke="#000" strokeWidth="3"/></svg>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", marginBottom: 6 }}>● PAYMENT CONFIRMED</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#E3E1E9", marginBottom: 6 }}>+ ¥{(result.amount + result.bonus).toFixed(2)}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3" }}>已到账 · 订单号 {result.transactionId}</div>
          <Btn variant="primary" onClick={onConfirm} style={{ marginTop: 24 }}>CONTINUE 继续 →</Btn>
        </div>
      )}
    </Modal>
  );
};

// ── Subscribe Modal ──────────────────────────────────────
const SubscribeModal = ({ open, agentId, onClose, onConfirm }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("select"); // select | processing | done | error
  const [error, setError] = useState(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open && agentId) {
      setPhase("select");
      setError(null);
      setLoading(true);
      api.get(`/agents/${agentId}`).then(data => {
        setAgent(api.parseAgent(data));
        setLoading(false);
      }).catch(e => {
        setError(e.message);
        setLoading(false);
      });
    }
  }, [open, agentId]);

  if (!open || !agentId) return null;

  const handleActivate = async () => {
    setPhase("processing");
    setError(null);
    try {
      const data = await api.post('/subscriptions', { agentId });
      setResult(data);
      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase("error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="ACTIVATE SUBSCRIPTION" titleZh="开通订阅" width={560}>
      {loading && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 24, height: 24, margin: "0 auto 16px", border: "2px solid #FF5A1F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        </div>
      )}

      {!loading && phase === "select" && agent && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #292A2F" }}>
            <div style={{ width: 64, height: 64, background: agent.cover, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {agent.glyph && <div style={{ transform: "scale(0.5)" }}>{agent.glyph}</div>}
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F" }}>{agent.code}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#E3E1E9" }}>{agent.nameEn} <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 16, opacity: 0.7, fontWeight: 400 }}>{agent.nameZh}</span></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              `每月含 ${agent.subscriptionIncluded} 次免费调用`,
              `超出后按 ¥${agent.priceSubscribed.toFixed(2)} / 次（节省 ${Math.round((1 - agent.priceSubscribed / agent.pricePerRun) * 100)}%）`,
              "优先调度通道 · 长上下文",
              "随时可取消，下个周期生效",
            ].map(b => (
              <div key={b} style={{ display: "flex", gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9" }}>
                <span style={{ color: "#FF5A1F" }}>▸</span><span>{b}</span>
              </div>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 20 }}>
            <div onClick={() => setAutoRenew(!autoRenew)} style={{ width: 18, height: 18, border: `1px solid ${autoRenew ? "#FF5A1F" : "#34343A"}`, background: autoRenew ? "#FF5A1F" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {autoRenew && <svg width="10" height="8" viewBox="0 0 11 9"><path d="M10.87 0.37C11.36 0.85 11.36 1.65 10.87 2.13L4.62 8.38C4.13 8.87 3.34 8.87 2.85 8.38L0.35 5.88C-0.12 5.39 -0.12 4.61 0.37 4.13C0.85 3.65 1.63 3.64 2.12 4.12L3.74 5.73L9.1 0.37C9.59 -0.12 10.38 -0.12 10.87 0.37Z" fill="#000"/></svg>}
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9" }}>到期自动续费 · ¥{agent.subscriptionMonthly} / 月</span>
          </label>
          <div style={{ background: "#0D0E13", border: "1px solid #292A2F", padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3" }}>本次扣款</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#E3E1E9" }}>¥{agent.subscriptionMonthly.toFixed(2)}</span>
          </div>
          {error && (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#FFB4AB", marginBottom: 12, padding: "8px 12px", border: "1px solid #FFB4AB", background: "rgba(255,180,171,0.08)" }}>
              ● {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={onClose}>CANCEL</Btn>
            <Btn variant="primary" onClick={handleActivate} style={{ flex: 1 }}>
              ACTIVATE 立即开通 →
            </Btn>
          </div>
        </div>
      )}

      {!loading && phase === "select" && error && !agent && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#FFB4AB" }}>{error}</div>
        </div>
      )}

      {phase === "processing" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 32, height: 32, margin: "0 auto 16px", border: "2px solid #FF5A1F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3" }}>正在开通订阅...</div>
        </div>
      )}

      {phase === "error" && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FFB4AB", marginBottom: 10 }}>● SUBSCRIPTION FAILED</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3", marginBottom: 16 }}>{error}</div>
          <Btn variant="primary" onClick={() => setPhase("select")}>TRY AGAIN 重试 →</Btn>
        </div>
      )}

      {phase === "done" && result && agent && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", marginBottom: 10 }}>● SUBSCRIPTION ACTIVE</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#E3E1E9", marginBottom: 6 }}>{agent.nameEn} 已开通</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E4BEB3" }}>含 {agent.subscriptionIncluded} 次免费额度，立即生效。</div>
          <Btn variant="primary" onClick={onConfirm} style={{ marginTop: 24 }}>USE NOW 现在使用 →</Btn>
        </div>
      )}
    </Modal>
  );
};

Object.assign(window, { AgentDetailScreen, RunScreen, WalletScreen, SubscriptionsScreen, TopUpModal, SubscribeModal });
