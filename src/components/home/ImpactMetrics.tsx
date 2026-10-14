"use client";
import { useEffect, useRef, useState } from "react";
import { METRICS } from "@/lib/data";
import { ExampleBadge } from "@/components/common/Badge";
function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0); const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0; const start = performance.now(); const d = 1600;
    const tick = (t: number) => { const p = Math.min(1, (t - start) / d); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span ref={ref}>{v.toLocaleString()}</span>;
}
export function ImpactMetrics() {
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-line bg-panel p-3 md:gap-4 md:p-6">
        {METRICS.map((m, i) => (
          <div key={m.label} className={`text-center ${i ? "border-l border-line" : ""}`}>
            <div className="text-[22px] font-black tabular-nums md:text-5xl"><span className={i === 0 ? "grad-text" : i === 1 ? "text-mint" : "text-sun"}><CountUp to={m.value} /></span><span className="text-sm text-white/70 md:text-xl">{m.suffix}</span></div>
            <div className="mt-1 text-[11px] text-white/75 md:text-sm">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-right"><ExampleBadge /> <span className="text-[10px] text-white/65">가상 수치 · 참여 수는 참고 정보이며 여론을 대표하지 않아요</span></div>
    </section>
  );
}
