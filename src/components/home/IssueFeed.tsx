"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, ISSUES, STAGES, stageHref, STAGE_CTA, type Stage } from "@/lib/data";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ExampleBadge } from "@/components/common/Badge";
export function IssueFeed() {
  const sp = useSearchParams();
  const [cat, setCat] = useState<string>("전체"); const [stage, setStage] = useState<string>("전체");
  useEffect(() => { const s = sp.get("stage"); if (s && (STAGES as readonly string[]).includes(s)) setStage(s); }, [sp]);
  const list = ISSUES.filter((i) => (cat === "전체" || i.category === cat) && (stage === "전체" || i.stage === stage));
  const chip = (on: boolean) => `shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition ${on ? "bg-white text-black" : "bg-white/10 text-white/80 hover:bg-white/20"}`;
  return (
    <section className="mx-auto mt-6 max-w-6xl px-5">
      <h1 className="text-2xl font-black md:text-3xl">의제 탐색</h1>
      <p className="mt-1 text-xs text-white/70">최근 업데이트순 · 참여 수는 참고 정보이며 순위나 정당성이 아니에요</p>
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label="분야">{["전체", ...CATEGORIES].map((x) => <button key={x} aria-pressed={cat === x} onClick={() => setCat(x)} className={chip(cat === x)}>{x}</button>)}</div>
      <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label="단계">{["전체", ...STAGES].map((x) => <button key={x} aria-pressed={stage === x} onClick={() => setStage(x)} className={`${chip(stage === x)} !text-xs`}>{x === "전체" ? "모든 단계" : x}</button>)}</div>
      {list.length === 0 && <p className="mt-8 rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-white/75">조건에 맞는 의제가 없어요.</p>}
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {list.map((it, idx) => (
          <li key={it.id} className="animate-rise overflow-hidden rounded-3xl border border-line bg-panel" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className={`relative h-24 bg-gradient-to-br ${it.gradient} p-3`}>
              <div aria-hidden className="absolute -bottom-2 right-2 text-[76px] leading-none">{it.emoji}</div>
              <div className="flex gap-1.5"><span className="rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-bold">{it.category}</span><span className="rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-bold">{it.stage}</span><ExampleBadge /></div>
            </div>
            <div className="p-4">
              <h2 className="font-bold leading-snug">{it.title}</h2>
              <p className="mt-1 text-xs text-white/70">{it.region} · {it.summary} · 업데이트 {it.updated}</p>
              <p className="mt-1 text-xs text-amber-200">🙋 필요: {it.needs}</p>
              {it.consensus > 0 && <><div className="mt-3 flex justify-between text-xs"><span>양 그룹 공통 합의 <b className={it.consensus >= 75 ? "text-mint" : "text-amber-300"}>{it.consensus}%</b></span><span className="text-white/70">{it.participants.toLocaleString()}명 참여</span></div><div className="mt-1.5"><ProgressBar value={it.consensus} tone={it.consensus >= 75 ? "mint" : "hot"} thin /></div></>}
              <div className="mt-4 flex gap-2">
                <Link href={`/issues/${it.id}`} className="flex-1 rounded-xl bg-white/10 py-2.5 text-center text-sm font-bold hover:bg-white/20">자세히</Link>
                <Link href={stageHref(it)} className="flex-1 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 py-2.5 text-center text-sm font-bold text-black">{STAGE_CTA[it.stage as Stage]}</Link>
              </div>
            </div>
          </li>))}
      </ul>
    </section>
  );
}
