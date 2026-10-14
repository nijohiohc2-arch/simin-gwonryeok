import Link from "next/link";
import { PowerHero } from "@/components/home/PowerHero";
import { ImpactMetrics } from "@/components/home/ImpactMetrics";
import { IssueRow } from "@/components/home/IssueRow";
import { Stories } from "@/components/home/Stories";
import { ISSUES, STAGES } from "@/lib/data";
export default function Home() {
  const active = ISSUES.filter((i) => i.stage !== "결과 공개");
  return (<>
    <PowerHero />
    <div id="more" className="scroll-mt-20" />
    <section className="mx-auto max-w-6xl px-5 pt-8">
      <h2 className="text-xl font-black md:text-3xl">문제를 제안하고, <span className="grad-text">함께 실행하고, 결과를 검증합니다.</span></h2>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm font-bold">
        <Link href="/propose" className="rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 p-3 text-black"><span aria-hidden>✍️</span><br />의제 제안하기</Link>
        <Link href="/issues" className="rounded-2xl bg-white/10 p-3"><span aria-hidden>🔎</span><br />참여할 의제 찾기</Link>
        <Link href="/results/night-light" className="rounded-2xl bg-white/10 p-3"><span aria-hidden>📊</span><br />실행 결과 보기</Link>
      </div>
    </section>
    <div className="mt-6"><ImpactMetrics /></div>
    <section className="mx-auto mt-6 max-w-6xl px-5" aria-label="단계별 의제 수">
      <ul className="flex gap-2 overflow-x-auto no-scrollbar">{STAGES.map((s, i) => <li key={s}><Link href={`/issues?stage=${encodeURIComponent(s)}`} className="block shrink-0 whitespace-nowrap rounded-full border border-line bg-panel px-3 py-1.5 text-xs"><b className="text-amber-300">{i + 1}</b> {s} <span className="text-white/70">{ISSUES.filter((x) => x.stage === s).length}</span></Link></li>)}</ul>
    </section>
    <IssueRow title="🔥 지금 참여할 수 있는 의제" items={active} />
    <IssueRow title="📍 우리 동네 · ○○구" items={ISSUES.filter((i) => i.region === "○○구")} />
    <Stories />
    <section className="mx-auto mt-10 max-w-6xl px-5">
      <Link href="/about" className="block overflow-hidden rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent p-6">
        <p className="text-sm font-bold text-amber-200">시민권력이란?</p>
        <p className="mt-1 text-xl font-black md:text-2xl">맡겨 둔 힘이 작동하지 않을 때, 시민이 직접 문제를 정의하고 합의하고 실행하고 공개합니다.</p>
        <p className="mt-2 text-sm text-white/75">정당·후보·모금·토큰 없음 → 우리가 하는 일과 하지 않는 일 보기</p>
      </Link>
    </section>
  </>);
}
