// AGENT-0 — 屏幕 1 (Login + Home)

// ── 登录 / OTP ─────────────────────────────────────────────
const LoginScreen = ({ onLogin, embedded }) => {
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneErr, setPhoneErr] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const sendOtp = async () => {
    if (phone.length !== 11) { setPhoneErr(true); return; }
    setPhoneErr(false);
    setLoading(true);
    setError("");
    try {
      await api.post('/auth/send-otp', { phone });
      setStep("otp");
      setCountdown(60);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (val) => {
    setOtp(val);
    if (val.length === 6) {
      setLoading(true);
      setError("");
      try {
        const data = await api.post('/auth/verify-otp', { phone, code: val });
        localStorage.setItem('token', data.token);
        onLogin(phone);
      } catch (e) {
        setError(e.message);
        setOtp("");
        setLoading(false);
      }
    }
  };

  const formCard = (
    <div style={embedded ? {} : { padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#121318" }}>
      {step === "phone" ? (
        <>
          <SectionLabel num="01." en="AUTHENTICATION" zh="身份认证" />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "#E3E1E9", marginTop: 16, marginBottom: 6, letterSpacing: "-0.5px" }}>
            Operator Sign-in
          </h2>
          <div style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 18, color: "#E4BEB3", opacity: 0.7, marginBottom: 32 }}>操作员登录</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="MOBILE NUMBER" labelZh="手机号码" error={phoneErr} errorMsg="请输入有效的 11 位手机号">
              <div style={{ display: "grid", gridTemplateColumns: "76px 1fr", gap: 8 }}>
                <div style={{
                  background: "#1F1F24", border: "1px solid #34343A",
                  fontFamily: "'Inter', sans-serif", fontSize: 15,
                  color: "#E3E1E9", display: "flex", alignItems: "center",
                  justifyContent: "center", height: 48,
                }}>+86</div>
                <Input value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,"").slice(0,11)); setPhoneErr(false); }} placeholder="138 0000 0000" maxLength={11} autoFocus error={phoneErr} style={{ height: 48 }} />
              </div>
            </Field>

            {error && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#FFB4AB", padding: "8px 12px", border: "1px solid #FFB4AB", background: "rgba(255,180,171,0.08)" }}>
                ● {error}
              </div>
            )}

            <Btn variant="primary" onClick={sendOtp} disabled={loading} style={{ width: "100%", height: 48 }}>
              {loading ? "SENDING..." : "SEND VERIFICATION CODE / 获取验证码 →"}
            </Btn>

            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.6, lineHeight: 1.6, paddingTop: 12, borderTop: "1px solid #292A2F" }}>
              注册即代表你同意《用户协议》与《隐私政策》。新用户可获得 ¥10.00 初始体验额度。
            </div>
          </div>
        </>
      ) : (
        <>
          <SectionLabel num="02." en="VERIFICATION CODE" zh="验证码确认" />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "#E3E1E9", marginTop: 16, marginBottom: 6, letterSpacing: "-0.5px" }}>
            Enter the 6-digit code
          </h2>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E4BEB3", marginBottom: 32 }}>
            已发送至 +86 {phone.slice(0,3)} {phone.slice(3,7)} {phone.slice(7)}
          </div>

          <OtpInput value={otp} length={6} onChange={verifyOtp} />

          {error && (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#FFB4AB", marginTop: 12, padding: "8px 12px", border: "1px solid #FFB4AB", background: "rgba(255,180,171,0.08)" }}>
              ● {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <button onClick={() => verifyOtp("123456")} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500,
              letterSpacing: "1.2px", color: "#FF5A1F", textTransform: "uppercase",
            }}>AUTOFILL DEMO CODE / 自动填入 123456 →</button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid #292A2F" }}>
            <button onClick={() => setStep("phone")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#E4BEB3", letterSpacing: "1px" }}>← CHANGE NUMBER 修改号码</button>
            {countdown > 0 ? (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", opacity: 0.7 }}>{countdown}s 后可重新发送</span>
            ) : (
              <button onClick={() => { if (!loading) sendOtp(); }} style={{ background: "none", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#FF5A1F", letterSpacing: "1px" }}>{loading ? "SENDING..." : "RESEND 重新发送"}</button>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (embedded) {
    return formCard;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0D0E13",
      display: "grid", gridTemplateColumns: "1fr 520px",
      position: "relative", overflow: "hidden",
    }}>
      {/* 左侧：品牌 + HUD 装饰 */}
      <div style={{ padding: "48px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #292A2F", position: "relative", overflow: "hidden",
        backgroundImage: "linear-gradient(135deg, rgba(13,14,19,0.85) 0%, rgba(13,14,19,0.7) 50%, rgba(13,14,19,0.92) 100%), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80&auto=format&fit=crop')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(#FF5A1F0a 1px, transparent 1px), linear-gradient(90deg, #FF5A1F0a 1px, transparent 1px)",
          backgroundSize: "48px 48px", opacity: 0.5, pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: 32, letterSpacing: "-1.4px", color: "#FF5A1F",
            }}>ACG / SYSTEM</span>
            <div style={{ width: 1, height: 24, background: "#34343A" }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#E4BEB3" }}>AGENT-0</span>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", opacity: 0.6, marginTop: 8 }}>
            Technical Performance Interface · 技术性能界面 · V.1.0.4
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
          <SectionLabel num="00." en="OPERATOR ACCESS" zh="操作员入口" />
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 64, lineHeight: 1.05, letterSpacing: "-1.8px",
            color: "#E3E1E9", marginTop: 24, marginBottom: 16,
          }}>
            Run agents.<br/>
            <span style={{ color: "#FF5A1F" }}>Spend energy.</span><br/>
            <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 36, opacity: 0.9, fontWeight: 500, letterSpacing: 0 }}>每个智能体，一次任务。</span>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#E4BEB3", lineHeight: 1.6, maxWidth: 480 }}>
            余额充能、智能体调度、订阅优化——一套操作员级别的 AI 工具控制台。注册即赠 ¥10 体验额度。
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 32, alignItems: "center", borderTop: "1px solid #292A2F", paddingTop: 20 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", marginBottom: 4 }}>SYSTEM STATUS</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9" }}>● ALL NODES NOMINAL</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", marginBottom: 4 }}>ACTIVE AGENTS</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E3E1E9" }}>32 / 32</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#FF5A1F", marginBottom: 4 }}>SESSION</div>
            <HudClock />
          </div>
        </div>
      </div>

      {/* 右侧：登录卡 */}
      {formCard}
    </div>
  );
};

// ── Home ────────────────────────────────────────────────────
const HomeScreen = ({ onOpen, subscriptions }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.fetchAgents().then(data => {
      setAgents(data);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  }, []);

  const subbedIds = subscriptions.map(s => s.agentId);
  const categories = ["ALL 全部", "GENERATION 生成", "DIALOGUE 对话", "LANGUAGE 语言", "ANALYSIS 分析", "DEVELOPER 开发", "AUDIO 音频"];
  const [activeCat, setActiveCat] = useState("ALL 全部");

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80, flexDirection: "column", gap: 12 }}>
        <div style={{ width: 24, height: 24, border: "2px solid #FF5A1F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3" }}>LOADING AGENTS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#1B1B20", border: "1px solid #FFB4AB", padding: 40, textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#FFB4AB", marginBottom: 8 }}>● ERROR</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E4BEB3", marginBottom: 16 }}>{error}</div>
        <Btn variant="secondary" onClick={() => { setLoading(true); setError(null); api.fetchAgents().then(d => { setAgents(d); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); }); }}>RETRY 重试</Btn>
      </div>
    );
  }

  const featured = agents[0];
  if (!featured || agents.length === 0) {
    return <div style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E4BEB3" }}>暂无可用智能体</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {false && (
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 360px", gap: 0, border: "1px solid #292A2F", background: "#1B1B20" }}>
        <div style={{ padding: "40px 48px", position: "relative", overflow: "hidden",
          background: featured.cover,
          backgroundImage: featured.photo
            ? `linear-gradient(90deg, #0D0E13 0%, rgba(13,14,19,0.85) 35%, rgba(13,14,19,0.45) 65%, rgba(13,14,19,0.15) 100%), url(${featured.photo})`
            : undefined,
          backgroundSize: featured.photo ? "cover" : undefined,
          backgroundPosition: featured.photo ? "center right" : undefined,
          borderRight: "1px solid #292A2F",
          minHeight: 460,
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,90,31,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,31,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px", pointerEvents: "none",
          }} />
          {!featured.photo && featured.glyph && (
            <div style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%) scale(1.6)", transformOrigin: "center right", opacity: 0.95, pointerEvents: "none" }}>
              {featured.glyph}
            </div>
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, #0D0E13 0%, rgba(13,14,19,0.85) 35%, rgba(13,14,19,0.4) 60%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 540 }}>
            <SectionLabel en="DAILY FEATURE" zh="每日精选" style={{ marginBottom: 20 }} />
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", color: "#E4BEB3", marginBottom: 8 }}>
              {featured.code} · {featured.category}
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 56, fontWeight: 700, lineHeight: 1.05, color: "#E3E1E9", letterSpacing: "-1.6px", marginBottom: 6 }}>
              {featured.nameEn}
            </h1>
            <div style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 28, color: "#E4BEB3", opacity: 0.85, marginBottom: 20 }}>
              {featured.nameZh}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#E4BEB3", opacity: 0.85, lineHeight: 1.6, maxWidth: 460, marginBottom: 28 }}>
              {featured.tagline}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="primary" onClick={() => onOpen(featured.id)}>
                LAUNCH AGENT 启动智能体 →
              </Btn>
              <Btn variant="secondary" onClick={() => onOpen(featured.id)}>
                VIEW DETAILS 查看详情
              </Btn>
            </div>
          </div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, background: "#0D0E13" }}>
          <SectionLabel en="LIVE METRICS" zh="实时指标" />
          {[
            { label: "PRICE PER RUN", labelZh: "单次价格", value: `¥${featured.pricePerRun.toFixed(2)}`, sub: `订阅 ¥${featured.priceSubscribed.toFixed(2)}` },
            { label: "TOTAL CALLS", labelZh: "累计调用", value: featured.runs.toLocaleString(), sub: "+ 2,841 今日" },
            { label: "AVG LATENCY", labelZh: "平均延迟", value: `${(featured.avgLatencyMs/1000).toFixed(1)}s`, sub: "P95 < 4.2s" },
            { label: "UPTIME 30D", labelZh: "30天可用率", value: "99.96%", sub: "● NOMINAL" },
          ].map(m => (
            <div key={m.label} style={{ borderBottom: "1px solid #292A2F", paddingBottom: 12 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#E4BEB3", marginBottom: 4 }}>
                {m.label} <span style={{ fontFamily: "'Noto Sans SC', sans-serif", opacity: 0.5, fontWeight: 400 }}>{m.labelZh}</span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#E3E1E9" }}>{m.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#FF5A1F", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Section: Browse */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <SectionLabel num="03." en="AGENT REGISTRY" zh="智能体目录" style={{ marginBottom: 8 }} />
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#E3E1E9" }}>
              Browse all agents
              <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 18, opacity: 0.6, fontWeight: 400, marginLeft: 12 }}>浏览所有智能体</span>
            </h3>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3" }}>
            {agents.length} agents · sorted by usage
          </span>
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #292A2F", marginBottom: 20 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{
              background: "none", border: "none", padding: "10px 18px", cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: "1.2px", textTransform: "uppercase",
              color: activeCat === c ? "#FF5A1F" : "#E4BEB3",
              borderBottom: activeCat === c ? "1px solid #FF5A1F" : "1px solid transparent",
              marginBottom: -1,
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {agents.map(a => (
            <AgentCard key={a.id} agent={a} onOpen={onOpen} subscribed={subbedIds.includes(a.id)} featured={a.id === "jobs-qa"} />
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { LoginScreen, HomeScreen });
