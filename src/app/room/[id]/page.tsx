import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ISSUES, getIssue, reached } from "@/lib/data";
import { IssueTop } from "@/components/common/IssueTop";
import { LockedStage } from "@/components/common/LockedStage";
import { RoomClient } from "@/components/room/RoomClient";
export const dynamicParams = false;
export function generateStaticParams() { return ISSUES.map((i) => ({ id: i.id })); }
export function generateMetadata({ params }: { params: { id: string } }): Metadata { return { title: `공동 실행실 · ${getIssue(params.id)?.title ?? ""}` }; }
export default function Page({ params }: { params: { id: string } }) {
  const issue = getIssue(params.id); if (!issue) notFound();
  const ok = issue.room && reached(issue, "함께하기·실행팀");
  return (<><IssueTop issue={issue} viewing="공동 실행실" label="🤝 공동 실행실" />{ok && issue.room ? <RoomClient issue={issue} room={issue.room} /> : <LockedStage issue={issue} stage="공동 실행실" />}</>);
}
