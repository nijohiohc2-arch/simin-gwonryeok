import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ISSUES, getIssue, stageHref, STAGE_CTA } from "@/lib/data";
import { IssueTop } from "@/components/common/IssueTop";
import { Section } from "@/components/common/Section";
export const dynamicParams = false;
export function generateStaticParams() { return ISSUES.map((i) => ({ id: i.id })); }
export function generateMetadata({ params }: { params: { id: string } }): Metadata { const it = getIssue(params.id); return { title: it?.title ?? "의제", description: it?.summary }; }
export default function Detail({ params }: { params: { id: string } }) {
  const it = getIssue(params.id); if (!it) notFound();
  return (
    <div>
      <IssueTop issue={it} viewing={it.stage === "접수" || it.stage === "공개 기준 검토" ? it.stage : "접수"} label={`별칭 ‘${it.proposer}’ 제안 · 업데이트 ${it.updated}`} />
      <div className="mx-auto max-w-4xl space-y-3 px-5 pt-4">
        {it.stage === "공개 기준 검토" && <p className="rounded-2xl border border-amber-300/40 bg-amber-300/10 p-4 text-sm">🔎 운영진이 <Link href="/principles#review" className="font-bold underline">공개 기준</Link>(구체성·공익성·근거·개인정보·정치 중립)으로 검토 중이에요. 결과와 사유는 이 페이지 변경 이력에 남아요.</p>}
        <Section icon="①" title="어떤 문제인가">{it.background}</Section>
        <Section icon="②" title="누구에게 어떤 영향을">{it.affected}</Section>
        <Section icon="③" title="확인된 사실 / 아직 모르는 점">{it.known.map((k) => <p key={k}>✅ {k}</p>)}{it.unknown.map((k) => <p key={k}>❓ {k}</p>)}</Section>
        <Section icon="④" title="제안 / 반대 의견"><p>💬 {it.summary}</p><p className="text-white/75">반대·우려: {it.opposition} — 소수 의견으로 기록 보존</p></Section>
        <Section icon="⑤" title="다음 의사결정과 마감">{it.nextDecision}</Section>
        <Section icon="⑥" title="참여 가능한 역할">🙋 {it.needs}</Section>
        <Section icon="⑦" title="변경 이력과 출처">{it.history.map((h) => <p key={h}>{h}</p>)}<Link href="/principles#correction" className="mt-1 inline-block text-amber-300 underline">⚑ 오류 신고·정정 요청</Link></Section>
        <Link href={stageHref(it)} className="sticky bottom-20 z-10 mt-5 block rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 py-4 text-center font-black text-black shadow-2xl md:bottom-4">▶ 지금 단계({it.stage}): {STAGE_CTA[it.stage]}</Link>
      </div>
    </div>);
}
