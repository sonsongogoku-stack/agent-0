// AGENT-0 — SVG glyphs (extracted from data.jsx, pure JSX)
const AGENT_GLYPHS = {
  "jobs-qa": (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <defs>
        <linearGradient id="jobs-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="68" stroke="#FF5A1F" strokeWidth="0.5" opacity="0.3"/>
      <circle cx="80" cy="80" r="54" stroke="#FF5A1F" strokeWidth="0.5" opacity="0.5"/>
      <ellipse cx="80" cy="62" rx="22" ry="26" fill="url(#jobs-grad)"/>
      <circle cx="71" cy="60" r="6" stroke="#0D0E13" strokeWidth="1.5" fill="none"/>
      <circle cx="89" cy="60" r="6" stroke="#0D0E13" strokeWidth="1.5" fill="none"/>
      <line x1="77" y1="60" x2="83" y2="60" stroke="#0D0E13" strokeWidth="1.5"/>
      <path d="M66 76 Q80 84 94 76 Q92 86 80 88 Q68 86 66 76" fill="#0D0E13" opacity="0.6"/>
      <path d="M52 102 Q80 92 108 102 L114 140 L46 140 Z" fill="#0D0E13"/>
      <path d="M58 100 Q80 96 102 100 L102 108 Q80 104 58 108 Z" fill="#FF5A1F" opacity="0.4"/>
      <g opacity="0.6">
        {Array.from({length: 24}).map((_,i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 68, r2 = 72;
          return <line key={i} x1={80 + Math.cos(a)*r1} y1={80 + Math.sin(a)*r1} x2={80 + Math.cos(a)*r2} y2={80 + Math.sin(a)*r2} stroke="#FF5A1F" strokeWidth="0.6"/>;
        })}
      </g>
    </svg>
  ),
  "txt2img": (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#DE0541" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#1F1F24" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D0E13" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#0D0E13"/>
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="140" height="120" fill="url(#sky)"/>
      <circle cx="118" cy="68" r="14" fill="#FFD9C2" opacity="0.95"/>
      <circle cx="118" cy="68" r="22" fill="#FF5A1F" opacity="0.3"/>
      <path d="M20 110 L50 80 L75 95 L100 70 L130 88 L160 78 L160 140 L20 140 Z" fill="#1F1F24" opacity="0.7"/>
      <path d="M20 125 L40 100 L70 115 L90 95 L120 110 L160 100 L160 140 L20 140 Z" fill="url(#mtn)"/>
      <rect x="20" y="20" width="140" height="120" stroke="#FF5A1F" strokeWidth="1" fill="none"/>
      {[[20,20],[160,20],[20,140],[160,140]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x-3} y1={y} x2={x+3} y2={y} stroke="#FF5A1F" strokeWidth="1.5"/>
          <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="#FF5A1F" strokeWidth="1.5"/>
        </g>
      ))}
      <text x="26" y="34" fontFamily="Inter" fontSize="7" fill="#FF5A1F" opacity="0.8">1024 × 1024</text>
    </svg>
  ),
  "translate": (
    <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
      <path d="M20 30 Q20 20 30 20 L90 20 Q100 20 100 30 L100 60 Q100 70 90 70 L40 70 L30 82 L30 70 Q20 70 20 60 Z" fill="#FF5A1F" opacity="0.85"/>
      <text x="38" y="52" fontFamily="Space Grotesk" fontSize="22" fontWeight="700" fill="#0D0E13">Hello</text>
      <path d="M100 70 Q100 60 110 60 L170 60 Q180 60 180 70 L180 100 Q180 110 170 110 L130 110 L120 122 L120 110 Q100 110 100 100 Z" fill="#1B1B20" stroke="#FF5A1F" strokeWidth="1"/>
      <text x="118" y="92" fontFamily="Noto Sans SC" fontSize="22" fontWeight="700" fill="#FF5A1F">你好</text>
      <path d="M92 64 L108 76" stroke="#FF5A1F" strokeWidth="1" strokeDasharray="2 2"/>
      <path d="M104 72 L108 76 L106 72" stroke="#FF5A1F" strokeWidth="1" fill="#FF5A1F"/>
      <g fontFamily="Inter" fontSize="6" fill="#E4BEB3" opacity="0.6">
        <text x="22" y="15">EN-US</text>
        <text x="152" y="55">ZH-CN</text>
      </g>
    </svg>
  ),
  "code-asst": (
    <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
      <rect x="20" y="20" width="160" height="100" fill="#0A0B10" stroke="#FF5A1F" strokeWidth="1"/>
      <rect x="20" y="20" width="160" height="14" fill="#1F1F24"/>
      <circle cx="28" cy="27" r="2" fill="#FF5A1F"/>
      <circle cx="36" cy="27" r="2" fill="#FFD9C2" opacity="0.5"/>
      <circle cx="44" cy="27" r="2" fill="#3FB950" opacity="0.5"/>
      <text x="54" y="30" fontFamily="Space Grotesk" fontSize="7" fill="#E4BEB3" opacity="0.5">app.tsx</text>
      {[44,54,64,74,84,94,104].map((y,i)=>(
        <text key={i} x="26" y={y} fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3" opacity="0.4">{i+1}</text>
      ))}
      <text x="38" y="44" fontFamily="Space Grotesk" fontSize="7" fill="#FF5A1F">const</text>
      <text x="60" y="44" fontFamily="Space Grotesk" fontSize="7" fill="#E3E1E9">agent</text>
      <text x="82" y="44" fontFamily="Space Grotesk" fontSize="7" fill="#E4BEB3" opacity="0.6">=</text>
      <text x="90" y="44" fontFamily="Space Grotesk" fontSize="7" fill="#FFD9C2">await</text>
      <text x="114" y="44" fontFamily="Space Grotesk" fontSize="7" fill="#E3E1E9">spawn(</text>
      <text x="38" y="54" fontFamily="Space Grotesk" fontSize="7" fill="#3FB950">  "x.dev"</text>
      <text x="38" y="64" fontFamily="Space Grotesk" fontSize="7" fill="#E3E1E9">);</text>
      <text x="38" y="78" fontFamily="Space Grotesk" fontSize="7" fill="#FF5A1F">return</text>
      <text x="66" y="78" fontFamily="Space Grotesk" fontSize="7" fill="#E3E1E9">agent.run(</text>
      <text x="38" y="88" fontFamily="Space Grotesk" fontSize="7" fill="#FFD9C2" opacity="0.6">  prompt</text>
      <text x="38" y="98" fontFamily="Space Grotesk" fontSize="7" fill="#E3E1E9">);</text>
      <rect x="56" y="92" width="1" height="7" fill="#FF5A1F"/>
    </svg>
  ),
  "doc-summ": (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
      <rect x="32" y="24" width="70" height="96" fill="#FFD9C2" opacity="0.08" transform="rotate(-4 67 72)"/>
      <rect x="38" y="22" width="70" height="96" fill="#FFD9C2" opacity="0.12" transform="rotate(2 73 70)"/>
      <rect x="44" y="20" width="70" height="96" fill="#1B1B20" stroke="#FF5A1F" strokeWidth="1"/>
      <text x="50" y="32" fontFamily="Space Grotesk" fontSize="6" fill="#FF5A1F" opacity="0.7">DOC.PDF</text>
      <line x1="50" y1="40" x2="108" y2="40" stroke="#E4BEB3" strokeWidth="1" opacity="0.7"/>
      <line x1="50" y1="46" x2="104" y2="46" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <line x1="50" y1="52" x2="108" y2="52" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <rect x="50" y="56" width="58" height="5" fill="#FF5A1F" opacity="0.3"/>
      <line x1="50" y1="58" x2="108" y2="58" stroke="#FF5A1F" strokeWidth="0.6"/>
      <line x1="50" y1="66" x2="100" y2="66" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <rect x="50" y="72" width="40" height="5" fill="#FF5A1F" opacity="0.3"/>
      <line x1="50" y1="74" x2="90" y2="74" stroke="#FF5A1F" strokeWidth="0.6"/>
      <line x1="50" y1="82" x2="108" y2="82" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <line x1="50" y1="88" x2="104" y2="88" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <line x1="50" y1="94" x2="96" y2="94" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <path d="M118 70 L132 70 M128 66 L132 70 L128 74" stroke="#FF5A1F" strokeWidth="1.2" fill="none"/>
      <rect x="136" y="42" width="36" height="56" fill="#FF5A1F"/>
      <text x="140" y="54" fontFamily="Space Grotesk" fontSize="6" fontWeight="700" fill="#0D0E13">TL;DR</text>
      <line x1="140" y1="62" x2="168" y2="62" stroke="#0D0E13" strokeWidth="0.6"/>
      <line x1="140" y1="68" x2="164" y2="68" stroke="#0D0E13" strokeWidth="0.6" opacity="0.7"/>
      <line x1="140" y1="74" x2="168" y2="74" stroke="#0D0E13" strokeWidth="0.6" opacity="0.7"/>
      <line x1="140" y1="80" x2="160" y2="80" stroke="#0D0E13" strokeWidth="0.6" opacity="0.7"/>
      <line x1="140" y1="86" x2="168" y2="86" stroke="#0D0E13" strokeWidth="0.6" opacity="0.7"/>
      <line x1="140" y1="92" x2="156" y2="92" stroke="#0D0E13" strokeWidth="0.6" opacity="0.7"/>
    </svg>
  ),
  "voice-clone": (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <rect x="100" y="36" width="20" height="36" rx="10" fill="#FF5A1F"/>
      <path d="M92 64 Q92 84 110 84 Q128 84 128 64" stroke="#FF5A1F" strokeWidth="2" fill="none"/>
      <line x1="110" y1="84" x2="110" y2="96" stroke="#FF5A1F" strokeWidth="2"/>
      <line x1="100" y1="96" x2="120" y2="96" stroke="#FF5A1F" strokeWidth="2"/>
      {[6,14,22,30,38,46,54,62,70,78,86].map((i,idx)=>{
        const heights = [12,24,40,18,52,30,46,22,38,16,28];
        const h = heights[idx];
        return <g key={idx}>
          <rect x={i} y={70-h/2} width="3" height={h} fill="#FF5A1F" opacity={0.3 + idx*0.06}/>
          <rect x={220-i-3} y={70-h/2} width="3" height={h} fill="#FFD9C2" opacity={0.3 + idx*0.06}/>
        </g>;
      })}
      <text x="30" y="110" fontFamily="Space Grotesk" fontSize="7" fontWeight="700" fill="#FF5A1F" letterSpacing="1">SAMPLE</text>
      <text x="170" y="110" fontFamily="Space Grotesk" fontSize="7" fontWeight="700" fill="#FFD9C2" letterSpacing="1">CLONE</text>
      <text x="30" y="120" fontFamily="Inter" fontSize="6" fill="#E4BEB3" opacity="0.6">30s reference</text>
      <text x="170" y="120" fontFamily="Inter" fontSize="6" fill="#E4BEB3" opacity="0.6">your voice</text>
    </svg>
  ),
  "video-gen": (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {[0,1,2,3].map(i => {
        const x = 16 + i * 48;
        const offsets = [0, 2, -1, 3];
        return (
          <g key={i}>
            <rect x={x} y={28 + offsets[i]} width="40" height="52" fill="#0D0E13" stroke="#FF5A1F" strokeWidth="1"/>
            <rect x={x+1} y={29 + offsets[i]} width="38" height="24" fill={["#FF5A1F","#DE0541","#FFD9C2","#FF8050"][i]} opacity="0.6"/>
            <path d={`M${x+1} ${52+offsets[i]} L${x+12} ${44+offsets[i]} L${x+22} ${48+offsets[i]} L${x+39} ${42+offsets[i]} L${x+39} ${79+offsets[i]} L${x+1} ${79+offsets[i]} Z`} fill="#0D0E13" opacity="0.85"/>
            <rect x={x+4} y={20 + offsets[i]} width="6" height="4" fill="#1F1F24" stroke="#FF5A1F" strokeWidth="0.5"/>
            <rect x={x+30} y={20 + offsets[i]} width="6" height="4" fill="#1F1F24" stroke="#FF5A1F" strokeWidth="0.5"/>
            <rect x={x+4} y={84 + offsets[i]} width="6" height="4" fill="#1F1F24" stroke="#FF5A1F" strokeWidth="0.5"/>
            <rect x={x+30} y={84 + offsets[i]} width="6" height="4" fill="#1F1F24" stroke="#FF5A1F" strokeWidth="0.5"/>
            <text x={x+2} y={37 + offsets[i]} fontFamily="Space Grotesk" fontSize="5" fill="#0D0E13" fontWeight="700">F.{i+1}</text>
          </g>
        );
      })}
      <circle cx="110" cy="110" r="14" fill="#FF5A1F"/>
      <polygon points="105,104 119,110 105,116" fill="#0D0E13"/>
    </svg>
  ),
  "ai-canvas": (
    <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
      <defs>
        <linearGradient id="canvas-grid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.08"/>
        </linearGradient>
      </defs>
      <rect x="24" y="20" width="156" height="100" fill="#0A0B10" stroke="#60A5FA" strokeWidth="1"/>
      <rect x="24" y="20" width="156" height="100" fill="url(#canvas-grid)"/>
      {Array.from({length: 8}).map((_,i)=>(
        <line key={`h${i}`} x1="24" y1={32 + i*11} x2="180" y2={32 + i*11} stroke="#60A5FA" strokeWidth="0.3" opacity="0.15"/>
      ))}
      {Array.from({length: 12}).map((_,i)=>(
        <line key={`v${i}`} x1={36 + i*11} y1="20" x2={36 + i*11} y2="120" stroke="#60A5FA" strokeWidth="0.3" opacity="0.15"/>
      ))}
      {/* Nodes */}
      <rect x="44" y="50" width="44" height="32" rx="4" fill="#1B1B20" stroke="#60A5FA" strokeWidth="1"/>
      <text x="52" y="62" fontFamily="Space Grotesk" fontSize="6" fill="#60A5FA" fontWeight="700">PROMPT</text>
      <text x="52" y="72" fontFamily="Inter" fontSize="5" fill="#E4BEB3" opacity="0.6">text input</text>
      <rect x="108" y="42" width="44" height="32" rx="4" fill="#1B1B20" stroke="#60A5FA" strokeWidth="1" opacity="0.6"/>
      <text x="116" y="54" fontFamily="Space Grotesk" fontSize="6" fill="#60A5FA" fontWeight="700" opacity="0.6">MODEL</text>
      <text x="116" y="64" fontFamily="Inter" fontSize="5" fill="#E4BEB3" opacity="0.5">openrouter</text>
      <rect x="108" y="84" width="44" height="24" rx="3" fill="#1B1B20" stroke="#60A5FA" strokeWidth="1" opacity="0.4"/>
      <text x="116" y="97" fontFamily="Space Grotesk" fontSize="6" fill="#60A5FA" fontWeight="700" opacity="0.4">OUTPUT</text>
      {/* Connector lines */}
      <line x1="88" y1="66" x2="108" y2="58" stroke="#60A5FA" strokeWidth="0.8" opacity="0.5"/>
      <line x1="152" y1="58" x2="166" y2="58" stroke="#60A5FA" strokeWidth="0.8" opacity="0.5"/>
      <line x1="166" y1="58" x2="166" y2="96" stroke="#60A5FA" strokeWidth="0.8" opacity="0.5"/>
      <line x1="166" y1="96" x2="152" y2="96" stroke="#60A5FA" strokeWidth="0.8" opacity="0.5"/>
      {/* Plus */}
      <circle cx="126" cy="74" r="4" fill="#60A5FA" opacity="0.3"/>
      <line x1="124" y1="74" x2="128" y2="74" stroke="#60A5FA" strokeWidth="1"/>
      <line x1="126" y1="72" x2="126" y2="76" stroke="#60A5FA" strokeWidth="1"/>
      <text x="28" y="131" fontFamily="Space Grotesk" fontSize="6" fill="#60A5FA" opacity="0.4">AI-CANVAS</text>
    </svg>
  ),
  "data-viz": (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <line x1="30" y1="110" x2="200" y2="110" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      <line x1="30" y1="30" x2="30" y2="110" stroke="#E4BEB3" strokeWidth="0.5" opacity="0.4"/>
      {[50,70,90].map((y,i)=>(<line key={i} x1="30" y1={y} x2="200" y2={y} stroke="#E4BEB3" strokeWidth="0.3" opacity="0.15" strokeDasharray="2 2"/>))}
      {[[44,78],[62,60],[80,90],[98,50],[116,72],[134,40],[152,64],[170,32]].map(([x,h],i)=>(
        <rect key={i} x={x} y={110-h} width="12" height={h} fill="#FF5A1F" opacity={0.5 + i*0.06}/>
      ))}
      <polyline points="50,42 68,52 86,28 104,46 122,38 140,58 158,30 176,48" stroke="#FFD9C2" strokeWidth="1.2" fill="none"/>
      {[50,68,86,104,122,140,158,176].map((x,i)=>{
        const ys = [42,52,28,46,38,58,30,48];
        return <circle key={i} cx={x} cy={ys[i]} r="2" fill="#FFD9C2"/>;
      })}
      <text x="30" y="125" fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3" opacity="0.5">JAN</text>
      <text x="100" y="125" fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3" opacity="0.5">APR</text>
      <text x="175" y="125" fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3" opacity="0.5">JUL</text>
      <text x="14" y="34" fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3" opacity="0.5">100</text>
      <text x="18" y="112" fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3" opacity="0.5">0</text>
      <rect x="160" y="22" width="6" height="6" fill="#FF5A1F"/>
      <text x="168" y="27" fontFamily="Space Grotesk" fontSize="6" fill="#E4BEB3">REVENUE</text>
    </svg>
  )
};

Object.assign(window, { AGENT_GLYPHS });
