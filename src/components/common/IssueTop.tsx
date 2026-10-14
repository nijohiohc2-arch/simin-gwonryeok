import Link from "next/link";
import type { Issue, Stage } from "@/lib/data";
import { ExampleBadge } from "./Badge";
import { Stepper } from "./Stepper";
/** 의제 화면 공통 상단: 배경 그라디언트 + 제목 + 현재 보는 단계 표시 */
export function IssueTop({ issue, viewing, label }: { issue: Issue; viewing: Stage; label?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${issue.gradient}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      <div aria-hidden className="absolute -right-2 top-0 text-[110px] leading-none opacity-40 md:text-[160px]">{issue.emoji}</div>
      <div className="relative mx-auto max-w-6xl px-5 pb-5 pt-4">
        <Link href={`/issues/${issue.id}`} className="text-sm text-white/80 hover:text-white">← 의제 상세</Link>
        <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-bold">{issue.category} · {issue.region}</span>{label && <span className="rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-bold">{label}</span>}<ExampleBadge /></div>
        <h1 className="mt-2 text-2xl font-black leading-tight md:text-4xl">{issue.title}</h1>
        <div className="mt-4"><Stepper current={issue.stage} viewing={viewing} id={issue.id} /></div>
      </div>
    </div>
  );
}
