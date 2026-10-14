"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { issueCounts } from "@/lib/remote";
import type { Issue, Agreement } from "@/lib/data";
import { reached } from "@/lib/data";
import { useMockAuth } from "@/hooks/useMockAuth";
import { useLocal } from "@/hooks/useLocal";
import { ProgressBar } from "@/components/common/ProgressBar";
import { IdentityBadge } from "@/components/common/IdentityBadge";
import { ShareCard } from "./ShareCard";
export type JoinState = { supported: boolean; role?: string; n?: number };
export function JoinPanel({ issue, a }: { issue: Issue; a: Agreement }) {
  const { authenticated, login } = useMockAuth();
  const [mine, setMine, loaded] = useLocal<JoinState>(`cos.join.${issue.id}`, { supported: false });
  const [role, setRole] = useState(a.roles[0]); const [card, setCard] = useState(false);
  const close = useCallback(() => setCard(false), []);
  const [real, setReal] = useState<{ supporters: number; team: number } | null>(null);
  useEffect(() => { issueCounts(issue.id).then((c) => c && setReal({ supporters: Number(c.supporters), team: Number(c.team) })); }, [issue.id, mine]);
  const myN = mine.n && mine.n > 0 ? mine.n : a.team + (real?.team ?? 0) + 1;
  const recruiting = issue.stage === "시민 합의안" || issue.stage === "함께하기·실행팀" || issue.stage === "공동 실행실";
  const support = a.supporters + (real ? real.supporters : mine.supported ? 1 : 0); const team = a.team + (real ? real.team : mine.n ? 1 : 0);
  const short = issue.title.length > 14 ? issue.title.slice(0, 14) + "… 합의안" : issue.title + " 합의안";
  return (
    <aside className="space-y-4 rounded-3xl border border-line bg-panel p-5 md:sticky md:top-20 md:self-start" aria-label="함께하기">
      <h2 className="text-lg font-black">🤝 함께하기</h2>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-black tabular-nums grad-text">{support.toLocaleString()}</div><div className="text-[11px] text-white/75">공감</div></div>
        <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-black tabular-nums text-mint">{team.toLocaleString()}</div><div className="text-[11px] text-white/75">실행팀 참여</div></div>
      </div>
      <div><div className="mb-1 flex justify-between text-xs text-white/75"><span>공감 목표 {a.goal.toLocaleString()}</span><span className="text-amber-200">{real ? `예시 기준값 + 실제 ${real.supporters}` : "예시 · 숫자만 공개"}</span></div><ProgressBar value={support} max={a.goal} /></div>
      {!loaded ? <div className="h-40 animate-pulse rounded-2xl bg-white/5" aria-label="불러오는 중" /> : !recruiting ? (
        <p className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">이 합의안의 실행은 끝났어요. <Link href={`/results/${issue.id}`} className="font-bold text-amber-300 underline">결과 공개 보기 →</Link></p>
      ) : (<>
        <IdentityBadge />
        <button onClick={() => (authenticated ? setMine({ ...mine, supported: !mine.supported }) : login())} aria-pressed={mine.supported} className={`w-full rounded-2xl py-3 font-bold transition active:scale-[.98] ${mine.supported ? "border border-mint/60 bg-mint/10 text-mint" : "bg-white/10"}`}>{mine.supported ? "💚 공감했어요 · 다시 누르면 철회" : authenticated ? "💚 이 합의안에 공감해요" : "카카오로 시작하고 함께하기"}</button>
        <fieldset className="rounded-2xl border border-line p-3">
          <legend className="px-1 text-sm font-bold">실행팀에 합류하기 · 역할 선택</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">{a.roles.map((r) => <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(r)} className={`min-h-[44px] rounded-xl px-2 py-2 text-left text-xs leading-tight ${role === r ? "bg-white font-bold text-black" : "bg-white/5 text-white/90"}`}>{r}</button>)}</div>
          <button onClick={() => { if (!authenticated) return login(); const n = myN; setMine({ ...mine, supported: true, role: mine.role ?? role, n }); setCard(true); }} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 py-3.5 font-black text-black shadow-[0_0_30px_rgba(245,158,11,.4)] active:scale-[.98]">{mine.n ? "내 참여 카드 다시 보기" : "🙋 실행팀 합류하기"}</button>
          {mine.n && <button onClick={() => setMine({ supported: mine.supported })} className="mt-2 w-full text-xs text-white/70 underline">실행팀 참여 철회</button>}
        </fieldset>
        {mine.n && reached(issue, "함께하기·실행팀") && <Link href={`/room/${issue.id}`} className="block rounded-xl bg-mint py-3 text-center font-bold text-black">공동 실행실로 이동 →</Link>}
      </>)}
      <p className="text-[11px] leading-5 text-white/70">공감·합류는 서명이나 투표가 아니에요. 이름·지역 명단은 공개하지 않고 숫자만 보여줘요. 언제든 철회할 수 있어요. 지갑·전자서명 없음.</p>
      <ShareCard open={card} n={myN} role={mine.role ?? role} short={short} onClose={close} />
    </aside>
  );
}
