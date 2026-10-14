import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getIssue, ISSUES, reached } from "@/lib/data";
import { IssueTop } from "@/components/common/IssueTop";
import { LockedStage } from "@/components/common/LockedStage";
import { DeliberateClient } from "@/components/deliberate/DeliberateClient";
export const dynamicParams = false;
export function generateStaticParams() { return ISSUES.map((i) => ({ issueId: i.id })); }
export function generateMetadata({ params }: { params: { issueId: string } }): Metadata { return { title: `카드 공론장 · ${getIssue(params.issueId)?.title ?? ""}` }; }
export default function Page({ params }: { params: { issueId: string } }) {
  const issue = getIssue(params.issueId); if (!issue) notFound();
  const open = reached(issue, "카드 공론장") && issue.statements.length > 0;
  return (<>
    <IssueTop issue={issue} viewing="카드 공론장" label={issue.stage === "카드 공론장" ? `진행 중 · ${issue.nextDecision}` : "공론장 기록"} />
    {open ? <><p className="mx-auto max-w-6xl px-5 pt-3 text-[11px] text-white/70">카드 응답은 참고용 숙의 데이터예요. 투표나 여론조사가 아니고, 응답은 이 브라우저에만 저장돼요 (예시).</p><DeliberateClient issue={issue} /></> : <LockedStage issue={issue} stage="카드 공론장" />}
  </>);
}
