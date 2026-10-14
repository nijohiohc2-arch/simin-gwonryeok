import Link from "next/link";
import { STAGES, type Stage, stageIdx } from "@/lib/data";
const HREF: Record<Stage, string> = { "접수": "/issues/", "공개 기준 검토": "/issues/", "카드 공론장": "/deliberate/", "시민 합의안": "/agreement/", "함께하기·실행팀": "/agreement/", "공동 실행실": "/room/", "결과 공개": "/results/" };
/** 단계 표시줄. id가 있으면 도달한 단계는 링크가 된다. */
export function Stepper({ current, viewing, id }: { current: Stage; viewing?: Stage; id?: string }) {
  const k = stageIdx(current);
  return (
    <ol className="flex gap-1 overflow-x-auto pb-1 no-scrollbar" aria-label="진행 단계">
      {STAGES.map((s, i) => {
        const cls = `block rounded-full px-2.5 py-1 text-[11px] font-bold ${s === viewing ? "ring-2 ring-white " : ""}${i < k ? "bg-white/85 text-black" : i === k ? "bg-amber-400 text-black" : "border border-white/25 text-white/60"}`;
        const body = <>{i < k ? "✓ " : ""}{s}</>;
        return (
          <li key={s} className="flex shrink-0 items-center gap-1" aria-current={i === k ? "step" : undefined}>
            {id && i <= k ? <Link href={HREF[s] + id} className={cls}>{body}</Link> : <span className={cls}>{body}</span>}
            {i < STAGES.length - 1 && <span aria-hidden className="text-white/40">›</span>}
          </li>);
      })}
    </ol>
  );
}
