import Link from "next/link";
import { type Issue, type Stage, stageHref, STAGE_CTA } from "@/lib/data";
export function LockedStage({ issue, stage }: { issue: Issue; stage: Stage }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-14 text-center">
      <div className="text-5xl" aria-hidden>⏳</div>
      <h2 className="mt-3 text-xl font-black">아직 ‘{stage}’ 단계 전이에요</h2>
      <p className="mt-2 text-sm text-white/70">이 의제는 지금 <b className="text-amber-300">{issue.stage}</b> 단계예요. 단계는 공개 기준과 참여자 결정에 따라 넘어가고, 변경 사유가 모두 기록돼요.</p>
      <Link href={stageHref(issue)} className="mt-6 inline-block rounded-xl bg-amber-400 px-5 py-3 font-black text-black">지금 단계로: {STAGE_CTA[issue.stage]} →</Link>
    </div>
  );
}
