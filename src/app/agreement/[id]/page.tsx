import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ISSUES, getIssue } from "@/lib/data";
import { AgreementViewer } from "@/components/agreement/AgreementViewer";
import { JoinPanel } from "@/components/agreement/JoinPanel";
import { IssueTop } from "@/components/common/IssueTop";
import { LockedStage } from "@/components/common/LockedStage";
export const dynamicParams = false;
export function generateStaticParams() { return ISSUES.map((i) => ({ id: i.id })); }
export function generateMetadata({ params }: { params: { id: string } }): Metadata { return { title: getIssue(params.id)?.agreement?.title ?? "시민 합의안" }; }
export default function Page({ params }: { params: { id: string } }) {
  const issue = getIssue(params.id); if (!issue) notFound();
  const a = issue.agreement;
  return (<>
    <IssueTop issue={issue} viewing="시민 합의안" label={a?.number} />
    {a ? <div className="mx-auto mt-5 grid max-w-6xl gap-6 px-5 md:grid-cols-[1fr_380px]"><AgreementViewer issue={issue} a={a} /><JoinPanel issue={issue} a={a} /></div> : <LockedStage issue={issue} stage="시민 합의안" />}
  </>);
}
