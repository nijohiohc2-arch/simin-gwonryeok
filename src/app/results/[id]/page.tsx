import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ISSUES, getIssue } from "@/lib/data";
import { IssueTop } from "@/components/common/IssueTop";
import { LockedStage } from "@/components/common/LockedStage";
import { Section } from "@/components/common/Section";
export const dynamicParams = false;
export function generateStaticParams() { return ISSUES.map((i) => ({ id: i.id })); }
export function generateMetadata({ params }: { params: { id: string } }): Metadata { return { title: `결과 공개 · ${getIssue(params.id)?.title ?? ""}` }; }
export default function Results({ params }: { params: { id: string } }) {
  const it = getIssue(params.id); if (!it) notFound();
  const r = it.result;
  if (!r) return (<><IssueTop issue={it} viewing="결과 공개" /><LockedStage issue={it} stage="결과 공개" /></>);
  return (<>
    <IssueTop issue={it} viewing="결과 공개" label={`📊 결과 공개 · ${r.date}`} />
    <div className="mx-auto max-w-4xl px-5 py-5">
      <div className="grid grid-cols-2 overflow-hidden rounded-3xl">
        <div className="bg-white/5 p-5"><span className="text-[10px] font-black tracking-widest text-white/65">BEFORE</span><div className="text-4xl font-black text-white/80">{r.before[0]}</div><div className="text-xs text-white/75">{r.before[1]}</div></div>
        <div className={`bg-gradient-to-br ${it.gradient} p-5`}><span className="text-[10px] font-black tracking-widest">AFTER</span><div className="text-4xl font-black">{r.after[0]}</div><div className="text-xs">{r.after[1]}</div></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">{r.stats.map(([v, l]) => <div key={l} className="rounded-2xl bg-panel p-3"><div className="text-2xl font-black">{v}</div><div className="text-[11px] text-white/75">{l}</div></div>)}</div>
      <div className="mt-4 space-y-3">
        <Section icon="🎯" title="초기 문제와 목표"><p>{r.problem}</p></Section>
        <Section icon="🛠️" title="실제 수행한 활동"><p>{r.activities}</p></Section>
        <Section icon="📊" title="결과 지표와 한계"><p>{r.before[1]} {r.before[0]} → {r.after[1]} {r.after[0]}</p><p className="text-white/75">한계: {r.limits}</p></Section>
        <Section icon="🗣️" title="소수 의견"><p>{r.minority}</p></Section>
        <Section icon="🏛️" title="기관 제안 · 공식 답변 · 후속">{r.responses.map((x) => <p key={x}>{x}</p>)}</Section>
        <Section icon="🔁" title="미완료 사유와 다음 단계"><p>{r.unfinished}</p></Section>
        <Section icon="🧾" title="변경 이력">{r.history.map((x) => <p key={x}>{x}</p>)}</Section>
        <Section icon="⚑" title="정정 요청 경로"><p>오류를 발견했나요? 근거와 함께 정정을 요청하면 7일 안에 처리 결과와 사유를 이 페이지 변경 이력에 남겨요.</p><Link href="/principles#correction" className="mt-2 inline-block rounded-xl border border-amber-300/60 px-4 py-2 font-bold text-amber-200">⚑ 정정 절차 보기</Link></Section>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2"><Link href={`/room/${it.id}`} className="rounded-2xl bg-white/10 py-4 text-center font-bold">실행 기록 보기</Link><Link href="/propose" className="rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 py-4 text-center font-black text-black">후속 의제 제안</Link></div>
    </div>
  </>);
}
