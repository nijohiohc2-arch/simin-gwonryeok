"use client";
import { useRef, useState } from "react";
import type { Statement } from "@/lib/data";
import type { Vote } from "@/hooks/usePolisVoting";
export function StatementSwiper({ statements, index, onVote }: { statements: Statement[]; index: number; onVote: (v: Vote) => void }) {
  const [dx, setDx] = useState(0); const [fly, setFly] = useState<Vote | null>(null);
  const start = useRef<number | null>(null);
  const s = statements[index]; const next = statements[index + 1];
  const commit = (v: Vote) => { setFly(v); setTimeout(() => { setFly(null); setDx(0); onVote(v); }, 280); };
  if (!s) return (
    <div className="grid h-[300px] place-items-center rounded-3xl border border-mint/40 bg-mint/10 p-6 text-center">
      <div><div className="text-5xl">🎉</div><b className="mt-2 block text-lg">모든 문장에 응답했어요!</b><p className="text-sm text-white/75">오른쪽 합의 레이더에서 결과를 확인하세요.</p></div>
    </div>);
  const tx = fly === "agree" ? 600 : fly === "disagree" ? -600 : dx;
  const ty = fly === "pass" ? -500 : 0;
  const hint = dx > 40 ? "agree" : dx < -40 ? "disagree" : null;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm"><b>문장 {index + 1} / {statements.length}</b><span className="text-white/70">← 반대 · 찬성 →</span></div>
      <div className="relative h-[300px] select-none">
        {next && <div className="absolute inset-0 translate-y-3 scale-[.95] rounded-3xl border border-line bg-panel/80" />}
        <div
          data-testid="swipe-card"
          onPointerDown={(e) => { start.current = e.clientX; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
          onPointerMove={(e) => { if (start.current !== null) setDx(e.clientX - start.current); }}
          onPointerUp={() => { start.current = null; if (dx > 100) commit("agree"); else if (dx < -100) commit("disagree"); else setDx(0); }}
          className={`absolute inset-0 flex cursor-grab touch-pan-y flex-col justify-between rounded-3xl border p-6 shadow-2xl ${hint === "agree" ? "border-mint bg-gradient-to-br from-mint/25 to-panel" : hint === "disagree" ? "border-hot bg-gradient-to-br from-hot/25 to-panel" : "border-line bg-gradient-to-br from-[#1d1b33] to-panel"}`}
          style={{ transform: `translate(${tx}px, ${ty}px) rotate(${tx / 18}deg)`, transition: start.current !== null ? "none" : "transform .28s ease-out", opacity: fly ? 0 : 1 }}>
          <span className="text-4xl text-white/20">“</span>
          <p className="text-lg font-bold leading-relaxed md:text-xl">{s.text}</p>
          <div className="flex justify-between text-xs text-white/65"><span>#{s.id} · 예시 문장</span></div>
          {hint && <div className={`absolute left-1/2 top-6 -translate-x-1/2 rotate-[-8deg] rounded-lg border-4 px-4 py-1 text-2xl font-black ${hint === "agree" ? "border-mint text-mint" : "border-hot text-hot"}`}>{hint === "agree" ? "찬성" : "반대"}</div>}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={() => commit("disagree")} className="rounded-2xl border border-hot/50 bg-hot/10 py-3 font-bold text-hot transition active:scale-95 hover:bg-hot/20">❌ 반대</button>
        <button onClick={() => commit("pass")} className="rounded-2xl border border-white/20 bg-white/5 py-3 font-bold text-white/70 transition active:scale-95 hover:bg-white/10">⏭️ 건너뛰기</button>
        <button onClick={() => commit("agree")} className="rounded-2xl border border-mint/50 bg-mint/10 py-3 font-bold text-mint transition active:scale-95 hover:bg-mint/20">⭕ 찬성</button>
      </div>
      <p className="mt-3 text-center text-[11px] text-white/65">💬 댓글은 없어요. 대신 새 문장을 제안할 수 있어요.</p>
    </div>
  );
}
