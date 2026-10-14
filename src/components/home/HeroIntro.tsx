"use client";
import { useCallback, useEffect, useRef, useState } from "react";
/*
  히어로 인트로 v2 — "빛이 모인다"
  0–4.0s  사방·하단 군중에서 금빛 입자가 곡선 궤적(easeInOutCubic + 감쇠 스프링 정착)으로 흘러와 모임.
          도착 시점을 1.2s~4.0s로 엇갈려 주먹 윤곽이 점점 드러나고, 도착할수록 느려지고 밝아짐.
          저알파 지우기로 빛 꼬리(모션 블러), 2.4s부터 주먹 주변 금빛 글로우가 서서히 차오름.
  4.0s    부드러운 임팩트: 짧은 금빛 섬광(화이트아웃 없음), 충격파 링, 약한 흔들림, 입자 살짝 튐.
  3.4–5.6s 같은 cover 변환으로 AI 주먹 이미지를 캔버스 안에서 서서히 겹쳐 그림 → 입자는 이미지 속으로 녹아듦.
  6.2s    캔버스(=이미지와 동일한 화면)를 DOM 이미지 위에서 페이드아웃 → 끊김 없음.
*/
export const INTRO_KEY = "cos.introSeen";
const GATHER = 4000, END = 6200, IMG_IN = 3400, IMG_FULL = 5600;
type P = { sx: number; sy: number; tx: number; ty: number; c1x: number; c1y: number; c2x: number; c2y: number; st: number; du: number; s: number; a: number; ph: number };
type Win = Window & { __introT?: number; __introFps?: number };

function coverMap(iw: number, ih: number, W: number, H: number, px: number, py: number) {
  const k = Math.max(W / iw, H / ih); const dw = iw * k, dh = ih * k;
  const ox = (W - dw) * px, oy = (H - dh) * py;
  return { k, ox, oy, dw, dh, map: (x: number, y: number) => [ox + x * k, oy + y * k] as const };
}
function sampleMask(img: HTMLImageElement, desktop: boolean) {
  const w = 320, h = Math.round((img.naturalHeight / img.naturalWidth) * w);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!; g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data; const pts: [number, number, number][] = [];
  const yMax = h * (desktop ? 0.8 : 0.74), xMin = desktop ? w * 0.6 : w * 0.3, xMax = desktop ? w * 0.98 : w * 0.7;
  for (let y = 0; y < yMax; y++) for (let x = Math.floor(xMin); x < xMax; x++) {
    const i = (y * w + x) * 4; const l = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
    if (l > 90) pts.push([(x / w) * img.naturalWidth, (y / h) * img.naturalHeight, l / 255]);
  }
  return pts;
}
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const PAL = Array.from({ length: 8 }, (_, i) => `rgb(255,${175 + i * 6},${70 + i * 6})`);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, t: number) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };

export function HeroIntro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "play" | "done">("idle");
  const stopRef = useRef<() => void>(() => {});

  const finish = useCallback((instant = false) => {
    stopRef.current();
    const root = document.documentElement;
    if (instant) root.removeAttribute("data-intro");
    else if (root.dataset.intro === "1") root.dataset.intro = "stamp";
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* 무시 */ }
    setState("done");
  }, []);

  const play = useCallback(() => {
    const cvs = ref.current; if (!cvs) return;
    const root = document.documentElement; const hero = document.getElementById("hero")!;
    root.dataset.intro = "1"; setState("play"); cvs.style.transition = "none"; cvs.style.opacity = "1";
    const desktop = window.innerWidth >= 768;
    const img = new Image(); img.src = desktop ? "/hero/fist-desktop.jpg" : "/hero/fist-mobile.jpg";
    let raf = 0, stopped = false, t0 = 0, paused = 0, hiddenAt = 0, impacted = false, frames = 0;
    const g = cvs.getContext("2d")!;
    let parts: P[] = [], W = 0, H = 0, fx = 0, fy = 0, fr = 100;
    let cover = { k: 1, ox: 0, oy: 0, dw: 0, dh: 0 };
    const onVis = () => { if (document.hidden) { hiddenAt = performance.now(); cancelAnimationFrame(raf); } else if (hiddenAt) { paused += performance.now() - hiddenAt; hiddenAt = 0; raf = requestAnimationFrame(tick); } };
    const setup = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = cvs.getBoundingClientRect(); W = r.width; H = r.height;
      cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cm = coverMap(img.naturalWidth, img.naturalHeight, W, H, desktop ? 0.7 : 0.5, desktop ? 0.4 : 0.18); cover = cm;
      const pts = sampleMask(img, desktop); const N = desktop ? 6000 : 3000;
      const tgt = Array.from({ length: N }, () => { const p = pts[(Math.random() * pts.length) | 0] ?? [img.naturalWidth / 2, img.naturalHeight / 3, 1]; const [x, y] = cm.map(p[0], p[1]); return { x, y, l: p[2] }; });
      fx = tgt.reduce((s, p) => s + p.x, 0) / N; fy = tgt.reduce((s, p) => s + p.y, 0) / N;
      fr = Math.sqrt(tgt.reduce((s, p) => s + (p.x - fx) ** 2 + (p.y - fy) ** 2, 0) / N);
      parts = tgt.map(({ x: tx, y: ty, l }) => {
        // 밝은(윤곽) 점일수록 먼저 도착 → 윤곽이 먼저 떠오름
        const arrive = 1200 + (1 - l) * 1500 + Math.random() * 1300;          // 1.2s ~ 4.0s
        const du = 1700 + Math.random() * 1500; const st = Math.max(0, arrive - du);
        const crowd = Math.random() < 0.45; const ang = Math.random() * Math.PI * 2;
        const sx = crowd ? Math.random() * W : fx + Math.cos(ang) * Math.max(W, H) * (0.6 + Math.random() * 0.5);
        const sy = crowd ? H * (0.85 + Math.random() * 0.2) : fy + Math.sin(ang) * Math.max(W, H) * (0.6 + Math.random() * 0.5);
        // 소용돌이처럼 휘어 들어오는 3차 베지어 제어점
        const sw = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.35);
        const dx = tx - sx, dy = ty - sy;
        return { sx, sy, tx, ty, c1x: sx + dx * 0.3 - dy * sw, c1y: sy + dy * 0.3 + dx * sw - (crowd ? H * 0.12 : 0), c2x: sx + dx * 0.75 - dy * sw * 0.4, c2y: sy + dy * 0.75 + dx * sw * 0.4, st, du, s: 0.6 + Math.random() * 1.1 * l, a: 0.3 + 0.7 * l, ph: Math.random() * 6.28 };
      });
      g.fillStyle = "#05050a"; g.fillRect(0, 0, W, H);
    };
    const tick = (now: number) => {
      if (stopped) return; if (!t0) t0 = now; const t = now - t0 - paused; frames++; (window as Win).__introT = t;
      const imgA = smooth(IMG_IN, IMG_FULL, t);
      // 빛 꼬리: 저알파 지우기 (이미지가 들어오면 점점 완전히 지움)
      g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
      g.fillStyle = `rgba(5,5,10,${0.16 + 0.84 * imgA})`; g.fillRect(0, 0, W, H);
      if (imgA > 0) { g.globalAlpha = imgA; g.drawImage(img, cover.ox, cover.oy, cover.dw, cover.dh); g.globalAlpha = 1; }
      // 차오르는 글로우 (2.4s~4.0s), 임팩트 후 이미지로 넘어가며 사라짐
      const glow = smooth(2400, GATHER, t) * (1 - smooth(GATHER + 200, IMG_FULL, t));
      g.globalCompositeOperation = "lighter";
      if (glow > 0.01) { const gr = g.createRadialGradient(fx, fy, 0, fx, fy, fr * 2.2); gr.addColorStop(0, `rgba(255,170,60,${0.22 * glow})`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
      const kick = t > GATHER ? Math.exp(-(t - GATHER) / 320) * (1 - Math.exp(-(t - GATHER) / 60)) : 0;
      const pA = 1 - smooth(GATHER + 300, IMG_FULL, t); // 입자는 이미지 속으로 녹아듦
      if (pA > 0.01) for (const p of parts) {
        const raw = clamp((t - p.st) / p.du);
        const e = easeIO(raw); const ie = 1 - e;
        let x = ie * ie * ie * p.sx + 3 * ie * ie * e * p.c1x + 3 * ie * e * e * p.c2x + e * e * e * p.tx;
        let y = ie * ie * ie * p.sy + 3 * ie * ie * e * p.c1y + 3 * ie * e * e * p.c2y + e * e * e * p.ty;
        if (raw >= 1) { const since = t - (p.st + p.du); const w = Math.exp(-since / 260) * 2.2; x += Math.sin(since / 70 + p.ph) * w; y += Math.cos(since / 85 + p.ph) * w; } // 스프링 정착
        if (kick) { const dx = p.tx - fx, dy = p.ty - fy, L = Math.hypot(dx, dy) + 1; x += (dx / L) * 16 * kick; y += (dy / L) * 16 * kick; }
        const arrived = raw >= 1 ? 1 : e;
        const tw = 0.85 + 0.15 * Math.sin(t / 180 + p.ph);
        const al = Math.min(0.6, p.a * (0.32 + 0.28 * arrived) * tw + 0.08) * pA;   // 가산 밝기 상한 → 금색 유지
        if (al < 0.01) continue;
        g.globalAlpha = al; g.fillStyle = PAL[(arrived * 7) | 0];
        const r = p.s * (0.7 + 0.5 * arrived); g.fillRect(x - r, y - r, r * 2, r * 2);
      }
      g.globalAlpha = 1;
      if (t > GATHER) {
        if (!impacted) { impacted = true; hero.classList.remove("shake"); void hero.offsetWidth; hero.classList.add("shake"); root.dataset.intro = "stamp"; }
        const k = (t - GATHER) / 320;
        if (k < 1) { const f = Math.sin(Math.PI * Math.min(1, k * 1.6)) * (1 - k); const fl = g.createRadialGradient(fx, fy, 0, fx, fy, Math.max(W, H) * 0.7); fl.addColorStop(0, `rgba(255,205,110,${0.42 * f})`); fl.addColorStop(0.4, `rgba(255,150,40,${0.18 * f})`); fl.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = fl; g.fillRect(0, 0, W, H); }
        const rk = clamp((t - GATHER) / 1100);
        if (rk < 1) { const er = 1 - Math.pow(1 - rk, 3); g.strokeStyle = `rgba(255,200,110,${0.5 * (1 - rk)})`; g.lineWidth = 1.5 + 6 * (1 - rk); g.beginPath(); g.arc(fx, fy, fr * 0.8 + er * Math.max(W, H) * 0.7, 0, Math.PI * 2); g.stroke(); }
      }
      if (t >= END) {
        (window as Win).__introFps = Math.round((frames * 1000) / t);
        cvs.style.transition = "opacity .6s ease"; cvs.style.opacity = "0"; finish(); return;
      }
      raf = requestAnimationFrame(tick);
    };
    stopRef.current = () => { stopped = true; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVis); if (ref.current) { ref.current.style.transition = "opacity .6s ease"; ref.current.style.opacity = "0"; } };
    document.addEventListener("visibilitychange", onVis);
    const go = () => { setup(); raf = requestAnimationFrame(tick); };
    if (img.complete && img.naturalWidth) go(); else { img.onload = go; img.onerror = () => finish(true); }
  }, [finish]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false; try { seen = sessionStorage.getItem(INTRO_KEY) === "1"; } catch { /* 무시 */ }
    if (reduce || seen) { document.documentElement.removeAttribute("data-intro"); setState("done"); return; }
    play();
    return () => { stopRef.current(); document.documentElement.removeAttribute("data-intro"); };
  }, [play]);

  return (<>
    <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0 }} />
    {state === "play" && <button onClick={() => finish()} className="absolute right-4 top-4 z-20 rounded-full border border-white/30 bg-black/50 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur">건너뛰기 ›</button>}
    {state === "done" && <button onClick={() => { document.getElementById("hero")?.classList.remove("shake"); play(); }} className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur" aria-label="인트로 다시 보기">↻ 다시 보기</button>}
  </>);
}
