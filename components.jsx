// AGENT-0 — 通用组件
const { useState, useEffect, useRef } = React;

// ── 基础按钮 ───────────────────────────────────────────────
const Btn = ({ variant = "primary", children, onClick, disabled, style = {}, type = "button" }) => {
  const base = {
    fontFamily: "'Space Grotesk', 'Noto Sans SC', sans-serif",
    fontWeight: 500, fontSize: 13, letterSpacing: "0.08em",
    textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer",
    border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.15s",
    height: 44, padding: "0 22px",
    opacity: disabled ? 0.4 : 1,
  };
  const variants = {
    primary:   { background: "#FF5A1F", color: "#000" },
    secondary: { background: "transparent", color: "#E3E1E9", border: "1px solid #34343A" },
    ghost:     { background: "transparent", color: "#E4BEB3", padding: "0 12px", height: 36 },
    dark:      { background: "#1F1F24", color: "#E3E1E9", border: "1px solid #34343A" },
    danger:    { background: "#DE0541", color: "#fff" },
  };
  return (
    <button type={type} onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

// ── 表单字段 ───────────────────────────────────────────────
const Field = ({ label, labelZh, children, error, errorMsg, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{
      fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700,
      letterSpacing: "1.2px", textTransform: "uppercase",
      color: error ? "#FFB4AB" : "#E4BEB3",
    }}>
      {label}
      {labelZh && <span style={{ fontFamily: "'Noto Sans SC', sans-serif", opacity: 0.5, marginLeft: 8, fontWeight: 400 }}>{labelZh}</span>}
    </label>
    {children}
    {hint && !error && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.6 }}>{hint}</span>}
    {error && errorMsg && (
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#FFB4AB" }}>● {errorMsg}</span>
    )}
  </div>
);

const Input = ({ value, onChange, placeholder, error, type = "text", maxLength, autoFocus, style = {} }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    maxLength={maxLength} autoFocus={autoFocus}
    style={{
      background: "#1F1F24",
      border: `1px solid ${error ? "#FFB4AB" : "#34343A"}`,
      color: error ? "#FFB4AB" : "#E3E1E9",
      fontFamily: "'Inter', sans-serif", fontSize: 15,
      padding: "13px 14px", outline: "none", width: "100%",
      ...style,
    }}
    onFocus={e => { if (!error) e.target.style.borderColor = "#FF5A1F"; }}
    onBlur={e => { if (!error) e.target.style.borderColor = "#34343A"; }}
  />
);

// ── 段落标题 ───────────────────────────────────────────────
const SectionLabel = ({ num, en, zh, accent = true, style = {} }) => (
  <div style={{
    fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700,
    letterSpacing: "1.4px", textTransform: "uppercase",
    color: accent ? "#FF5A1F" : "#E4BEB3",
    display: "flex", alignItems: "center", gap: 8, ...style,
  }}>
    {num && <span>{num}</span>}
    <span>{en}</span>
    {zh && <span style={{ fontFamily: "'Noto Sans SC', sans-serif", opacity: 0.55, fontWeight: 400 }}>{zh}</span>}
  </div>
);

// ── 能量条 / 余额条 ───────────────────────────────────────
const EnergyBar = ({ value, max = 1000, height = 6, showSegments = true }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const segments = 20;
  return (
    <div style={{ width: "100%" }}>
      {showSegments ? (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${segments}, 1fr)`, gap: 2, height }}>
          {Array.from({ length: segments }).map((_, i) => {
            const filled = (i + 1) / segments * 100 <= pct;
            const partial = !filled && i / segments * 100 < pct;
            return <div key={i} style={{
              background: filled ? "#FF5A1F" : (partial ? "#FF5A1F" : "#292A2F"),
              opacity: filled ? 1 : (partial ? 0.4 : 1),
              transition: "all 0.4s",
            }} />;
          })}
        </div>
      ) : (
        <div style={{ width: "100%", height, background: "#292A2F", position: "relative", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#FF5A1F", transition: "width 0.4s" }} />
        </div>
      )}
    </div>
  );
};

// ── 状态点 ─────────────────────────────────────────────────
const StatusDot = ({ color = "#FF5A1F", pulse = false, size = 8 }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    background: color, marginRight: 8, flexShrink: 0,
    animation: pulse ? "pulse 1.6s ease-in-out infinite" : "none",
  }} />
);

// ── Agent 卡片 ─────────────────────────────────────────────
const AgentCard = ({ agent, onOpen, subscribed, featured, large }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen && onOpen(agent.id)}
      style={{
        background: "#1B1B20",
        border: `1px solid ${hover ? "#FF5A1F" : "#292A2F"}`,
        cursor: "pointer", transition: "border-color 0.2s",
        display: "flex", flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Cover */}
      <div style={{
        height: large ? 240 : 180,
        background: agent.cover,
        backgroundImage: agent.photo
          ? `linear-gradient(180deg, rgba(13,14,19,0.15) 0%, rgba(13,14,19,0.55) 60%, rgba(13,14,19,0.92) 100%), url(${agent.photo})`
          : undefined,
        backgroundSize: agent.photo ? "cover" : undefined,
        backgroundPosition: agent.photo ? "center" : undefined,
        borderBottom: "1px solid #292A2F",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "flex-end", padding: 14,
      }}>
        {/* Decorative SVG glyph (only when no photo) */}
        {!agent.photo && agent.glyph && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1, pointerEvents: "none" }}>
            {agent.glyph}
          </div>
        )}
        {/* HUD grid overlay (subtle, only when photo absent) */}
        {!agent.photo && <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,90,31,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,31,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px", pointerEvents: "none",
        }} />}
        {/* Code tag */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: "1.2px", color: "#FF5A1F",
          background: "rgba(13,14,19,0.7)", padding: "3px 6px",
          border: "1px solid rgba(255,90,31,0.3)",
        }}>{agent.code}</div>
        {/* Badges */}
        <div style={{ display: "flex", gap: 6, position: "relative", zIndex: 2 }}>
          {subscribed && (
            <span style={{
              background: "#FF5A1F", color: "#000",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "1px", padding: "3px 8px", textTransform: "uppercase",
            }}>● SUBSCRIBED</span>
          )}
          {featured && (
            <span style={{
              background: "rgba(0,0,0,0.7)", color: "#FF5A1F",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "1px", padding: "3px 8px", textTransform: "uppercase",
              border: "1px solid #FF5A1F",
            }}>FEATURED 精选</span>
          )}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: "1.2px", color: "#FF5A1F",
          }}>{agent.category}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.6 }}>
            {agent.runs.toLocaleString()} 次调用
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "#E3E1E9" }}>
            {agent.nameEn}
          </div>
          <div style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 14, color: "#E4BEB3", opacity: 0.8 }}>
            {agent.nameZh}
          </div>
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3", opacity: 0.7, lineHeight: 1.5, minHeight: 36 }}>
          {agent.tagline}
        </div>
        <div style={{ borderTop: "1px solid #292A2F", paddingTop: 12, marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 500, color: "#E3E1E9" }}>
              ¥{agent.pricePerRun}
              <span style={{ fontSize: 11, color: "#E4BEB3", opacity: 0.7, marginLeft: 4 }}>/ 次</span>
            </div>
            {subscribed && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#FF5A1F", marginTop: 2 }}>
                订阅价 ¥{agent.priceSubscribed}
              </div>
            )}
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: "1.2px", color: hover ? "#FF5A1F" : "#E4BEB3",
            transition: "color 0.2s",
          }}>OPEN →</span>
        </div>
      </div>
    </div>
  );
};

// ── 行小卡（紧凑） ────────────────────────────────────────
const AgentRow = ({ agent, onOpen, subscribed }) => {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={() => onOpen && onOpen(agent.id)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "44px 1fr 100px 100px 80px",
        gap: 16, padding: "12px 16px",
        background: hover ? "#1F1F24" : "#1B1B20",
        border: "1px solid #292A2F", borderTop: "none",
        cursor: "pointer", alignItems: "center",
      }}>
      <div style={{ width: 44, height: 44, background: agent.cover, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {agent.glyph && <div style={{ transform: "scale(0.45)" }}>{agent.glyph}</div>}
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "#E3E1E9" }}>{agent.nameEn} <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, opacity: 0.6, fontWeight: 400 }}>{agent.nameZh}</span></div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.7, marginTop: 2 }}>{agent.code} · {agent.category}</div>
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E4BEB3" }}>{agent.runs.toLocaleString()} 次</span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E3E1E9" }}>¥{agent.pricePerRun}/次</span>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: subscribed ? "#FF5A1F" : "#E4BEB3" }}>
        {subscribed ? "● SUBBED" : "OPEN →"}
      </span>
    </div>
  );
};

// ── HUD 框（带角装饰） ────────────────────────────────────
const HudFrame = ({ children, style = {}, padding = 24 }) => (
  <div style={{ position: "relative", background: "#1B1B20", border: "1px solid #292A2F", padding, ...style }}>
    {[
      { top: -1, left: -1, borderTop: "1px solid #FF5A1F", borderLeft: "1px solid #FF5A1F" },
      { top: -1, right: -1, borderTop: "1px solid #FF5A1F", borderRight: "1px solid #FF5A1F" },
      { bottom: -1, left: -1, borderBottom: "1px solid #FF5A1F", borderLeft: "1px solid #FF5A1F" },
      { bottom: -1, right: -1, borderBottom: "1px solid #FF5A1F", borderRight: "1px solid #FF5A1F" },
    ].map((s, i) => (
      <span key={i} style={{ position: "absolute", width: 10, height: 10, ...s }} />
    ))}
    {children}
  </div>
);

// ── Modal ──────────────────────────────────────────────────
const Modal = ({ open, onClose, title, titleZh, children, width = 480 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(13, 14, 19, 0.85)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 32,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#1B1B20", border: "1px solid #FF5A1F",
        width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto",
        position: "relative",
      }}>
        {/* HUD corners */}
        {[
          { top: -1, left: -1, borderTop: "1px solid #FF5A1F", borderLeft: "1px solid #FF5A1F" },
          { top: -1, right: -1, borderTop: "1px solid #FF5A1F", borderRight: "1px solid #FF5A1F" },
          { bottom: -1, left: -1, borderBottom: "1px solid #FF5A1F", borderLeft: "1px solid #FF5A1F" },
          { bottom: -1, right: -1, borderBottom: "1px solid #FF5A1F", borderRight: "1px solid #FF5A1F" },
        ].map((s, i) => (
          <span key={i} style={{ position: "absolute", width: 12, height: 12, background: "#FF5A1F", ...s }} />
        ))}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #292A2F", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <SectionLabel en={title} zh={titleZh} />
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: "#E4BEB3",
            lineHeight: 1, padding: 0,
          }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

// ── Numpad-Free OTP 输入 ──────────────────────────────────
const OtpInput = ({ value, onChange, length = 6 }) => {
  const inputRef = useRef(null);
  return (
    <div onClick={() => inputRef.current?.focus()} style={{ cursor: "text", position: "relative" }}>
      <input ref={inputRef} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={length}
        value={value}
        onChange={e => {
          const v = e.target.value.replace(/\D/g, "").slice(0, length);
          onChange && onChange(v);
        }}
        autoFocus
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "text", fontSize: 16 }}
      />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${length}, 1fr)`, gap: 8 }}>
        {Array.from({ length }).map((_, i) => {
          const ch = value[i] || "";
          const active = i === value.length;
          return (
            <div key={i} style={{
              height: 56, background: "#1F1F24",
              border: `1px solid ${active ? "#FF5A1F" : "#34343A"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700,
              color: "#E3E1E9", position: "relative",
            }}>
              {ch}
              {active && !ch && <span style={{ width: 1, height: 24, background: "#FF5A1F", animation: "blink 1s steps(1) infinite" }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── 顶部时钟（装饰） ──────────────────────────────────────
const HudClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  return (
    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#E4BEB3", opacity: 0.7 }}>
      {now.getFullYear()}.{pad(now.getMonth()+1)}.{pad(now.getDate())} · {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())} UTC+8
    </span>
  );
};

Object.assign(window, {
  Btn, Field, Input, SectionLabel, EnergyBar, StatusDot,
  AgentCard, AgentRow, HudFrame, Modal, OtpInput, HudClock,
});
