"use client";
// 옵시디언 그래프 뷰 스타일 '내 위치 · 내 정보'. 다른 참여자 점은 모두 예시 데이터이며 익명.
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BADGES, CATEGORIES, ISSUES } from "@/lib/data";
import { useMockAuth } from "@/hooks/useMockAuth";
import { getProfile, remoteLoad, updateProfile, type Profile } from "@/lib/remote";

type N = { x: number; y: number; vx: number; vy: number; c: number; ph: number; s: number };
type View = "overview" | "zooming" | "zoomed" | "leaving";
const ROLES = ["참여자", "실행팀", "조직자", "관찰자"];
const TAGS = [...CATEGORIES, "교육", "청년", "돌봄", "문화"];
const R = 300; // 클러스터 반지름(월드 좌표)
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hash(s: string) { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
const centers = ISSUES.map((_, i) => { const a = (i / ISSUES.length) * Math.PI * 2 - Math.PI / 2; return { x: Math.cos(a) * R, y: Math.sin(a) * R * 0.8 }; });

/** 예시 참여자 그래프: 8개 의제를 숨은 중심으로 하는 force-directed 배치(마운트 시 1회 계산) */
function buildGraph(count: number) {
  const r = rng(20261023); const nodes: N[] = []; const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) { const c = (r() * ISSUES.length) | 0; const a = r() * 6.28, d = r() * 120; nodes.push({ x: centers[c].x + Math.cos(a) * d, y: centers[c].y + Math.sin(a) * d, vx: 0, vy: 0, c, ph: r() * 6.28, s: 0.7 + r() * 0.9 }); }
  const by = ISSUES.map((_, c) => nodes.map((n, i) => (n.c === c ? i : -1)).filter((i) => i >= 0));
  nodes.forEach((n, i) => { const g = by[n.c]; for (let k = 0; k < 2; k++) { const j = g[(r() * g.length) | 0]; if (j !== i) edges.push([i, j]); } if (r() < 0.22) { const g2 = by[(r() * ISSUES.length) | 0]; edges.push([i, g2[(r() * g2.length) | 0]]); } });
  for (let it = 0; it < 220; it++) {
    const alpha = 1 - it / 220;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const a = nodes[i], b = nodes[j]; let dx = a.x - b.x, dy = a.y - b.y; const d2 = dx * dx + dy * dy + 0.01; if (d2 > 6400) continue; const f = (90 / d2) * alpha; dx *= f; dy *= f; a.vx += dx; a.vy += dy; b.vx -= dx; b.vy -= dy; }
    for (const [i, j] of edges) { const a = nodes[i], b = nodes[j]; const dx = b.x - a.x, dy = b.y - a.y; const d = Math.hypot(dx, dy) || 1; const f = ((d - 38) / d) * 0.04 * alpha; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f; }
    for (const n of nodes) { n.vx += (centers[n.c].x - n.x) * 0.006 * alpha; n.vy += (centers[n.c].y - n.y) * 0.006 * alpha; n.x += n.vx; n.y += n.vy; n.vx *= 0.6; n.vy *= 0.6; }
  }
  return { nodes, edges };
}

export function GraphClient() {
  const { user, login, real, loaded } = useMockAuth();
  const cvs = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<View>("overview");
  const viewRef = useRef<View>("overview"); viewRef.current = view;
  const zoom = useRef({ from: 0, to: 0, t0: 0, dur: 1800, p: 0 }); // p: 0=전체, 1=내 점
  const [joined, setJoined] = useState<{ id: string; title: string; acts: string[] }[]>([]);
  const [prof, setProf] = useState<Profile>({ nickname: "", neighborhood: "", interests: [], role: "참여자" });
  const [msg, setMsg] = useState(""); const [saving, setSaving] = useState(false);
  const reduce = useRef(false);
  const graph = useMemo(() => buildGraph(typeof window !== "undefined" && window.innerWidth < 768 ? 170 : 240), []);

  // 내 참여 기록 + 프로필 불러오기
  useEffect(() => {
    if (!loaded || !user) return;
    const local = <T,>(k: string, d: T): T => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; } };
    (async () => {
      const read = async <T,>(k: string, d: T): Promise<T> => ((real ? ((await remoteLoad(k).catch(() => undefined)) as T | undefined) : undefined) ?? local(k, d));
      const rows = await Promise.all(ISSUES.map(async (i) => {
        const acts: string[] = [];
        const v = await read<Record<string, string>>(`cos.votes.${i.id}`, {}); if (Object.keys(v ?? {}).length) acts.push(`카드 ${Object.keys(v).length}장 응답`);
        const j = await read<{ supported?: boolean; n?: number; role?: string }>(`cos.join.${i.id}`, {}); if (j?.supported) acts.push("공감"); if (j?.n) acts.push(`실행팀${j.role ? ` · ${j.role}` : ""}`);
        const t = await read<string | null>(`cos.task.${i.id}`, null); if (t) acts.push(`작업: ${t}`);
        return { id: i.id, title: i.title, acts };
      }));
      setJoined(rows.filter((r) => r.acts.length));
      const base = local<Partial<Profile>>("cos.profile", {});
      const srv = real ? await getProfile().catch(() => null) : null;
      setProf({ nickname: srv?.nickname || base.nickname || user.nickname, neighborhood: srv?.neighborhood ?? base.neighborhood ?? "", interests: srv?.interests ?? base.interests ?? [], role: srv?.role ?? base.role ?? "참여자" });
    })();
  }, [loaded, user, real]);

  // 내 점: 참여한 의제 중심들의 평균 위치(참여 기록이 없으면 그래프 가운데 근처)
  const self = useMemo(() => {
    const cs = joined.map((j) => ISSUES.findIndex((i) => i.id === j.id)).filter((c) => c >= 0);
    const pts = cs.length ? cs.map((c) => centers[c]) : [{ x: 0, y: 0 }];
    const x = pts.reduce((s, p) => s + p.x, 0) / pts.length * (cs.length ? 0.75 : 1), y = pts.reduce((s, p) => s + p.y, 0) / pts.length * (cs.length ? 0.75 : 1) + (cs.length ? 0 : 20);
    const links = (cs.length ? cs : [0, 4]).flatMap((c) => graph.nodes.map((n, i) => [n, i] as const).filter(([n]) => n.c === c).sort((a, b) => Math.hypot(a[0].x - x, a[0].y - y) - Math.hypot(b[0].x - x, b[0].y - y)).slice(0, 2).map(([, i]) => i));
    return { x, y, links };
  }, [joined, graph]);
  const selfRef = useRef(self); selfRef.current = self;
  const hasUser = !!user; const userRef = useRef(hasUser); userRef.current = hasUser;

  // 렌더 루프
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = cvs.current!; const g = c.getContext("2d")!; let W = 0, H = 0, raf = 0;
    const size = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); window.addEventListener("resize", size);
    const drift = reduce.current ? 0.8 : 3;
    const frame = (now: number) => {
      const z = zoom.current; if (z.t0) { const k = Math.min(1, (now - z.t0) / z.dur); z.p = z.from + (z.to - z.from) * ease(k); if (k >= 1) { z.t0 = 0; if (z.to === 1) setView("zoomed"); else setView("overview"); } }
      const p = z.p; const s = selfRef.current; const mobile = W < 768;
      const k0 = Math.min(W, H) / (2 * (R + 140)) * (mobile ? 1.05 : 1); const k1 = k0 * (mobile ? 7 : 6);
      const k = k0 + (k1 - k0) * p; const cx = s.x * p, cy = s.y * p;
      const ox = W / 2 + (mobile ? 0 : -W * 0.22 * p), oy = H / 2 + (mobile ? -H * 0.22 * p : 0);
      const T = (x: number, y: number) => [ox + (x - cx) * k, oy + (y - cy) * k] as const;
      const t = now / 1000;
      g.fillStyle = "#05050a"; g.fillRect(0, 0, W, H);
      const pos = graph.nodes.map((n) => T(n.x + Math.sin(t * 0.4 + n.ph) * drift, n.y + Math.cos(t * 0.33 + n.ph) * drift));
      const fade = 1 - 0.65 * p;
      g.lineWidth = 0.6; g.strokeStyle = `rgba(255,190,90,${0.14 * fade})`; g.beginPath();
      for (const [i, j] of graph.edges) { g.moveTo(pos[i][0], pos[i][1]); g.lineTo(pos[j][0], pos[j][1]); } g.stroke();
      g.globalCompositeOperation = "lighter";
      const nr = Math.max(1.4, Math.sqrt(k / k0) * 1.8);
      graph.nodes.forEach((n, i) => { const [x, y] = pos[i]; if (x < -20 || y < -20 || x > W + 20 || y > H + 20) return; const tw = 0.75 + 0.25 * Math.sin(t * 1.3 + n.ph);
        const rr = nr * n.s * (1 + p * 1.6); // 확대될수록 초점이 흐려진 듯 번지게
        g.globalAlpha = 0.55 * tw * fade; g.fillStyle = "#ffb347"; g.beginPath(); g.arc(x, y, rr, 0, 6.29); g.fill();
        g.globalAlpha = 0.12 * tw * fade; g.beginPath(); g.arc(x, y, rr * 3, 0, 6.29); g.fill(); });
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
      if (userRef.current) {
        const [sx, sy] = T(s.x, s.y);
        g.strokeStyle = "rgba(255,230,160,0.55)"; g.lineWidth = 1.2; g.beginPath(); for (const i of s.links) { g.moveTo(sx, sy); g.lineTo(pos[i][0], pos[i][1]); } g.stroke();
        const base = 5 + p * 22; const pulse = (t % 2) / 2; const core = 1 - Math.max(0, (p - 0.8) / 0.2); // 다 확대되면 아바타가 자리를 이어받음
        g.globalAlpha = core;
        const gr = g.createRadialGradient(sx, sy, 0, sx, sy, base * 5); gr.addColorStop(0, "rgba(255,240,200,0.9)"); gr.addColorStop(0.25, "rgba(255,190,80,0.35)"); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, base * 5, 0, 6.29); g.fill();
        g.fillStyle = "#fff6dc"; g.beginPath(); g.arc(sx, sy, base, 0, 6.29); g.fill();
        if (!reduce.current || p < 0.01) { g.strokeStyle = `rgba(255,220,140,${0.8 * (1 - pulse)})`; g.lineWidth = 2; g.beginPath(); g.arc(sx, sy, base + 4 + pulse * 26, 0, 6.29); g.stroke(); }
        g.globalAlpha = 1;
        if (p < 0.2) { g.globalAlpha = 1 - p * 5; g.fillStyle = "#fff"; g.font = "bold 12px system-ui, sans-serif"; g.textAlign = "center"; g.fillText("나", sx, sy - base - 10); g.globalAlpha = 1; }
      }
      (window as unknown as { __graphP: number }).__graphP = p;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); };
    document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); document.removeEventListener("visibilitychange", vis); };
  }, [graph]);

  const go = useCallback((to: 0 | 1) => { const z = zoom.current; z.from = z.p; z.to = to; z.dur = reduce.current ? 450 : 1800; z.t0 = performance.now(); setView(to ? "zooming" : "leaving"); }, []);
  const toMe = () => { if (!user) { login(); return; } go(1); };

  const save = async () => {
    setSaving(true); setMsg("");
    const p = { ...prof, nickname: prof.nickname.trim().slice(0, 30), neighborhood: prof.neighborhood.trim().slice(0, 30) };
    if (!p.nickname) { setMsg("닉네임을 입력해 주세요."); setSaving(false); return; }
    try {
      const where = await updateProfile(p);
      if (!real) { try { localStorage.setItem("cos.user", JSON.stringify({ nickname: p.nickname })); window.dispatchEvent(new CustomEvent("cos-storage", { detail: "cos.user" })); } catch { /* 무시 */ } }
      setMsg(where === "server" ? "저장했어요." : "이 브라우저에 저장했어요.");
    } catch { setMsg("서버 저장에 실패해 이 브라우저에만 저장했어요. 잠시 후 다시 시도해 주세요."); }
    setSaving(false);
  };
  const cards = joined.reduce((n, j) => n + j.acts.filter((a) => a.startsWith("카드")).reduce((m, a) => m + (parseInt(a.replace(/\D+/g, "")) || 0), 0), 0);
  const earned = { deliberate: cards >= 5, support: joined.some((j) => j.acts.includes("공감")), team: joined.some((j) => j.acts.some((a) => a.startsWith("실행팀"))), task: joined.some((j) => j.acts.some((a) => a.startsWith("작업"))) } as Record<string, boolean>;
  const showPanel = view === "zoomed";
  const hue = hash(prof.nickname || "시민") % 50 + 20; // 금색~주황 계열

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-[#05050a] text-white">
      <canvas ref={cvs} aria-hidden className="absolute inset-0 h-full w-full" />
      <h1 className="sr-only">내 위치 · 내 정보</h1>
      {/* 상단 바 */}
      <div className={`absolute inset-x-0 top-0 flex items-center gap-2 p-4 transition-opacity duration-500 ${showPanel ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <Link href="/me" className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-bold backdrop-blur">← 내 참여</Link>
        <span className="text-sm font-black">시민권력 지도</span>
        <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-black text-black">예시 데이터</span>
      </div>
      <p className={`absolute inset-x-0 top-14 px-4 text-[11px] text-white/70 transition-opacity duration-500 ${view === "overview" ? "opacity-100" : "opacity-0"}`}>점 하나가 참여자 한 명(익명 · 예시)이에요. 같은 의제·실행팀에 함께한 사람끼리 이어져 있어요.</p>
      {/* 하단 CTA */}
      <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-6 pb-10 transition-opacity duration-500 ${view === "overview" ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {loaded && !user && <p className="rounded-full bg-black/50 px-4 py-2 text-center text-sm backdrop-blur">카카오로 시작하면 내 점이 생겨요</p>}
        <button onClick={toMe} className="rounded-full bg-gradient-to-r from-amber-200 to-amber-500 px-8 py-4 text-lg font-black text-black shadow-[0_0_40px_rgba(255,180,60,0.5)]">{user ? "◎ 내 위치" : "카카오로 시작하고 내 위치 보기"}</button>
      </div>
      {/* 확대 후: 자신의 모습 + 내 정보 */}
      <div className={`absolute inset-0 overflow-y-auto transition-all duration-700 ${showPanel ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!showPanel}>
        <button onClick={() => go(0)} className="fixed right-4 top-4 z-10 rounded-full border border-white/25 bg-black/50 px-4 py-2 text-sm font-bold backdrop-blur">⤢ 전체 보기</button>
        <div className="grid min-h-full md:grid-cols-2">
          <section className={`flex flex-col items-center justify-center px-6 pb-4 pt-16 transition-transform duration-700 md:py-10 ${showPanel ? "scale-100" : "scale-75"}`} aria-label="자신의 모습">
            <Avatar hue={hue} n={prof.interests.length} seed={hash(prof.nickname || "시민")} />
            <p className="mt-2 text-2xl font-black">{prof.nickname || user?.nickname}</p>
            <p className="text-sm text-amber-200">{prof.role}{prof.neighborhood ? ` · ${prof.neighborhood}` : ""}</p>
          </section>
          <section className={`m-3 rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-md transition-all duration-700 md:m-8 md:self-center ${showPanel ? "translate-y-0" : "translate-y-8"}`} aria-label="내 정보">
            <h2 className="text-lg font-black">내 정보</h2>
            <p className="mt-1 text-[11px] text-white/65">{real && user ? "카카오 계정에 저장 · 본인만 볼 수 있어요" : "이 브라우저에만 저장돼요"} · 전화번호·상세 주소·사진은 받지 않아요.</p>
            <label className="mt-4 block text-xs font-bold text-white/80">닉네임<input value={prof.nickname} maxLength={30} onChange={(e) => setProf({ ...prof, nickname: e.target.value })} className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-normal" /></label>
            <label className="mt-3 block text-xs font-bold text-white/80">동네 <span className="font-normal text-white/55">(동 단위까지만)</span><input value={prof.neighborhood} maxLength={30} placeholder="예: 망원동" onChange={(e) => setProf({ ...prof, neighborhood: e.target.value })} className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-normal" /></label>
            <fieldset className="mt-3"><legend className="text-xs font-bold text-white/80">관심 분야</legend><div className="mt-1 flex flex-wrap gap-1.5">{TAGS.map((t) => { const on = prof.interests.includes(t); return <button key={t} type="button" aria-pressed={on} onClick={() => setProf({ ...prof, interests: on ? prof.interests.filter((x) => x !== t) : [...prof.interests, t].slice(0, 8) })} className={`rounded-full px-3 py-1 text-xs ${on ? "bg-amber-300 font-bold text-black" : "border border-white/20 text-white/80"}`}>{t}</button>; })}</div></fieldset>
            <fieldset className="mt-3"><legend className="text-xs font-bold text-white/80">역할</legend><div className="mt-1 grid grid-cols-4 gap-1.5">{ROLES.map((r) => <button key={r} type="button" aria-pressed={prof.role === r} onClick={() => setProf({ ...prof, role: r })} className={`rounded-xl py-2 text-xs ${prof.role === r ? "bg-amber-300 font-bold text-black" : "border border-white/20"}`}>{r}</button>)}</div></fieldset>
            <button onClick={save} disabled={saving} className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-200 to-amber-500 py-3 font-black text-black disabled:opacity-60">{saving ? "저장 중…" : "저장"}</button>
            <p role="status" className="mt-2 min-h-[1rem] text-center text-xs text-amber-200">{msg}</p>
            <h3 className="mt-4 text-sm font-black">참여 기록</h3>
            {joined.length ? <ul className="mt-2 space-y-1.5">{joined.map((j) => <li key={j.id}><Link href={`/issues/${j.id}`} className="block rounded-xl bg-white/5 px-3 py-2"><b className="block text-xs">{j.title}</b><span className="text-[11px] text-white/70">{j.acts.join(" · ")}</span></Link></li>)}</ul> : <p className="mt-1 text-xs text-white/65">아직 기록이 없어요. <Link href="/deliberate/night-bus" className="underline">1분 카드 숙의</Link>로 첫 연결선을 만들어 보세요.</p>}
            <h3 className="mt-4 text-sm font-black">배지</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">{BADGES.filter((b) => b.key in earned).map((b) => <li key={b.key} className={`rounded-full px-2.5 py-1 text-[11px] ${earned[b.key] ? "border border-amber-300/60 bg-amber-300/10" : "bg-white/5 text-white/50"}`}>{b.emoji} {b.label}</li>)}</ul>
            <p className="mt-3 text-[10px] text-white/55">배지는 활동 기록일 뿐 의결권·금전 가치가 없어요. 지도 속 다른 점은 예시 데이터예요.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

/** 닉네임으로 만든 빛나는 실루엣(실제 사진 아님) */
function Avatar({ hue, n, seed }: { hue: number; n: number; seed: number }) {
  const r = rng(seed); const stars = Array.from({ length: 14 }, () => [40 + r() * 160, 30 + r() * 200, 0.6 + r() * 1.6]);
  return (
    <svg viewBox="0 0 240 260" className="h-56 w-56 md:h-80 md:w-80" role="img" aria-label="닉네임으로 만든 빛의 형상">
      <defs>
        <radialGradient id="av-g" cx="50%" cy="45%" r="55%"><stop offset="0" stopColor={`hsl(${hue} 100% 85%)`} stopOpacity=".95" /><stop offset=".5" stopColor={`hsl(${hue} 95% 55%)`} stopOpacity=".55" /><stop offset="1" stopColor={`hsl(${hue} 90% 40%)`} stopOpacity="0" /></radialGradient>
        <linearGradient id="av-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`hsl(${hue} 100% 80%)`} /><stop offset="1" stopColor={`hsl(${hue} 90% 45%)`} stopOpacity=".2" /></linearGradient>
        <filter id="av-f"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <circle cx="120" cy="120" r="115" fill="url(#av-g)" opacity=".5" />
      <g filter="url(#av-f)" opacity=".8"><circle cx="120" cy="92" r="34" fill={`hsl(${hue} 100% 70%)`} /><path d="M50 250 C55 175 85 145 120 145 C155 145 185 175 190 250 Z" fill={`hsl(${hue} 100% 60%)`} /></g>
      <circle cx="120" cy="92" r="30" fill="url(#av-b)" /><path d="M58 250 C62 180 90 152 120 152 C150 152 178 180 182 250 Z" fill="url(#av-b)" />
      {stars.map(([x, y, s], i) => <circle key={i} cx={x} cy={y} r={s} fill="#fff6dc" opacity=".7"><animate attributeName="opacity" values=".2;.9;.2" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" /></circle>)}
      <ellipse cx="120" cy="120" rx="108" ry="40" fill="none" stroke={`hsl(${hue} 100% 75%)`} strokeOpacity=".35" transform="rotate(-18 120 120)" />
      {Array.from({ length: n }, (_, i) => { const a = (i / Math.max(1, n)) * 6.283; return <circle key={i} cx={120 + Math.cos(a) * 108 * Math.cos(-0.314) - Math.sin(a) * 40 * Math.sin(-0.314)} cy={120 + Math.cos(a) * 108 * Math.sin(-0.314) + Math.sin(a) * 40 * Math.cos(-0.314)} r="4" fill="#fff2c4" />; })}
    </svg>
  );
}
