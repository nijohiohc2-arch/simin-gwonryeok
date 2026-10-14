"use client";
import Link from "next/link";
import type { Issue, Statement } from "@/lib/data";
import { reached } from "@/lib/data";
import { isConsensus, isDivisive } from "@/lib/data";
import { ExampleBadge } from "@/components/common/Badge";
export function ConsensusRadar({ issue, statements, currentId }: { issue: Issue; statements: Statement[]; currentId?: number }) {
  const cons = statements.filter(isConsensus); const div = statements.filter(isDivisive);
  return (
    <aside className="rounded-3xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between"><b>📡 실시간 합의 레이더</b><ExampleBadge /></div>
      <p className="mt-1 text-xs text-white/70">A그룹(관리 주체 입장) × B그룹(입주민 입장) 찬성률</p>
      <div className="relative mt-4 aspect-square w-full rounded-2xl border border-line bg-ink">
        <div className="absolute right-0 top-0 h-1/4 w-1/4 rounded-tr-2xl bg-mint/15 ring-1 ring-mint/40" />
        <span className="absolute right-2 top-2 text-[10px] font-bold text-mint">공통 합의 구역</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/65">A그룹 찬성률 →</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/65">B그룹 →</span>
        {statements.map((s) => (
          <div key={s.id} title={s.text}
            className={`absolute grid h-5 w-5 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full text-[9px] font-bold transition-all duration-500 ${isConsensus(s) ? "bg-mint text-black" : isDivisive(s) ? "bg-hot" : "bg-vio/80"} ${s.id === currentId ? "z-10 scale-150 ring-2 ring-white" : ""}`}
            style={{ left: `${s.groupA}%`, bottom: `${s.groupB}%` }}>{s.id}</div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-mint/10 p-3"><div className="text-2xl font-black text-mint">{cons.length}</div><div className="text-xs text-white/75">합의 문장</div></div>
        <div className="rounded-xl bg-hot/10 p-3"><div className="text-2xl font-black text-hot">{div.length}</div><div className="text-xs text-white/75">대립 문장</div></div>
      </div>
      <div className="mt-4 space-y-2">
        <b className="text-sm">🟢 합의안 초안에 자동 등록 (양 그룹 75%↑)</b>
        {cons.slice(0, 4).map((s) => (
          <div key={s.id} className="rounded-xl border border-mint/30 p-2.5 text-xs">
            <div className="mb-1 flex gap-1"><span className="rounded bg-mint px-1.5 text-[10px] font-bold text-black">합의안 초안</span><span className="text-white/65">A {s.groupA}% · B {s.groupB}%</span></div>
            <div className="mb-1.5 flex gap-1"><div className="h-1 rounded bg-sky-400" style={{ width: `${s.groupA / 2}%` }} /><div className="h-1 rounded bg-pink-400" style={{ width: `${s.groupB / 2}%` }} /></div>
            {s.text}
          </div>
        ))}
      </div>
      {reached(issue, "시민 합의안") ? <Link href={`/agreement/${issue.id}`} className="mt-4 block rounded-xl bg-gradient-to-r from-mint to-sky-500 py-3 text-center font-bold text-black">시민 합의안 보기 →</Link> : <p className="mt-4 rounded-xl bg-white/5 p-3 text-center text-xs text-white/70">공론장 마감 후 양 그룹 75%↑ 문장으로 시민 합의안이 정리돼요 · {issue.nextDecision}</p>}
    </aside>
  );
}
