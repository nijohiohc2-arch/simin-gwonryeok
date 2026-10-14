"use client";
import { useMemo, useState } from "react";
import { type Issue, type Statement } from "@/lib/data";
import { usePolisVoting } from "@/hooks/usePolisVoting";
import { StatementSwiper } from "./StatementSwiper";
import { StatementSubmitModal } from "./StatementSubmitModal";
import { ConsensusRadar } from "./ConsensusRadar";
import { ProgressBar } from "@/components/common/ProgressBar";
export function DeliberateClient({ issue }: { issue: Issue }) {
  const STATEMENTS = issue.statements;
  const { votes, vote, reset, myStatements, submit, loaded } = usePolisVoting(issue.id);
  const [open, setOpen] = useState(false); const [toast, setToast] = useState("");
  const stmts: Statement[] = useMemo(() => STATEMENTS.map((s) => {
    const v = votes[s.id]; if (!v || v === "pass") return s;
    const d = v === "agree" ? 2 : -2; return { ...s, groupA: Math.max(0, Math.min(100, s.groupA + d)), groupB: Math.max(0, Math.min(100, s.groupB + d)) };
  }), [votes, STATEMENTS]);
  const index = STATEMENTS.findIndex((s) => !votes[s.id]); const idx = index === -1 ? STATEMENTS.length : index;
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 md:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-4 flex items-center gap-3"><ProgressBar value={idx} max={STATEMENTS.length} tone="vio" thin /><span className="shrink-0 text-xs text-white/70">{idx}/{STATEMENTS.length} 응답</span></div>
        {!loaded ? <div className="h-[380px] animate-pulse rounded-3xl bg-white/5" aria-label="불러오는 중" /> : <StatementSwiper statements={STATEMENTS} index={idx} onVote={(v) => STATEMENTS[idx] && vote(STATEMENTS[idx].id, v)} />}
        <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-4">
          <p className="text-sm">✍️ 이 문장에 빠진 점이 있나요? 새 의견을 제안하세요</p>
          <button onClick={() => setOpen(true)} className="mt-3 w-full rounded-xl bg-white/10 py-3 text-sm font-bold hover:bg-white/20">한 줄 의견 제출하기 (최대 140자)</button>
          {myStatements.length > 0 && <ul className="mt-3 space-y-1 text-xs text-white/75">{myStatements.map((m, i) => <li key={i}>• {m} <span className="text-sun">(검토 대기 · 예시)</span></li>)}</ul>}
        </div>
        {idx > 0 && <button onClick={reset} className="mt-3 text-xs text-white/65 underline">내 응답 초기화</button>}
      </div>
      <ConsensusRadar issue={issue} statements={stmts} currentId={STATEMENTS[idx]?.id} />
      <StatementSubmitModal open={open} onClose={() => setOpen(false)} onSubmit={(t) => { submit(t); setToast("제안이 등록됐어요 (예시)"); setTimeout(() => setToast(""), 2000); }} />
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black">{toast}</div>}
    </div>
  );
}
