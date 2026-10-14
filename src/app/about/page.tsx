import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "시민권력이란", description: "위임한 힘을, 다시 시민에게. 시민이 직접 문제를 정의하고 합의하고 실행하고 공개합니다." };
const STEPS = [["정의", "내 삶에서 본 문제를 시민이 직접 정의해요.", "✍️"], ["합의", "댓글 싸움 대신 카드 공론장에서 서로 다른 사람들의 공통분모를 찾아요.", "🗳️"], ["실행", "합의안에 함께할 사람이 실행팀을 꾸려 조사하고 제안하고 실험해요.", "🤝"], ["공개", "결과·한계·소수 의견·기관 답변을 모두 공개하고 정정받아요.", "📊"]];
export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/fist-desktop.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-[70%_40%] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-16">
          <p className="text-sm font-bold text-amber-200">선언문 · 초안</p>
          <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">시민권력이란</h1>
          <p className="mt-4 text-xl font-black leading-snug md:text-3xl">위임한 힘을, <span className="grad-text">다시 시민에게.</span></p>
        </div>
      </section>
      <div className="mx-auto max-w-4xl space-y-8 px-5 py-8 text-[15px] leading-8 text-white/90">
        <section><h2 className="text-2xl font-black text-white">왜 필요한가</h2>
          <p className="mt-3">우리는 선거로 힘을 맡깁니다. 그런데 맡겨 둔 힘이 내 동네의 어두운 골목, 불투명한 관리비, 위험한 통학로에 닿지 않을 때가 많습니다. 기다리는 동안 문제는 그대로 남습니다.</p>
          <p className="mt-3">위임된 권력을 믿기 어려울 때, 시민이 할 수 있는 일은 불평이나 포기만이 아닙니다. <b className="text-amber-200">시민이 직접 문제를 정의하고, 합의하고, 실행하고, 그 과정을 공개하는 것</b>. 우리는 그것을 시민권력이라 부릅니다.</p></section>
        <section><h2 className="text-2xl font-black text-white">어떻게 작동하나</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">{STEPS.map(([t, d, e], i) => <li key={t} className="rounded-2xl border border-line bg-panel p-4 leading-6"><span aria-hidden className="text-2xl">{e}</span><b className="mt-1 block text-lg text-amber-200">{i + 1}. {t}</b><span className="text-sm text-white/80">{d}</span></li>)}</ol></section>
        <section><h2 className="text-2xl font-black text-white">우리가 하지 않는 일</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {["특정 정당·후보를 지지하거나 반대하지 않아요", "후원금·기부금을 모금하지 않아요", "토큰·코인·포인트 등 금전 가치를 발행하지 않아요", "참여 수를 전체 시민의 여론이나 법적 투표로 내세우지 않아요", "공식 청원·주민조례청구를 대신 접수하거나 서명을 모으지 않아요", "참여자 실명·지역 명단을 공개하지 않아요"].map((x) => <li key={x} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-6">🚫 {x}</li>)}
          </ul></section>
        <section><h2 className="text-2xl font-black text-white">우리가 지키는 약속</h2>
          <p className="mt-3">운영자도 통제 대상입니다. 돈으로 영향력을 살 수 없습니다. 근거와 의견을 구분하고, 소수 의견을 지우지 않고, 모든 변경에 사유를 남기고, 틀리면 고칩니다.</p>
          <Link href="/principles" className="mt-4 inline-block rounded-xl bg-white/10 px-5 py-3 text-sm font-bold">운영 원칙·검토 기준 전문 →</Link></section>
        <section className="rounded-3xl bg-gradient-to-br from-amber-400/25 to-transparent p-6 text-center">
          <p className="text-xl font-black text-white">당신이 본 문제에서 시작합니다.</p>
          <div className="mt-4 flex justify-center gap-2"><Link href="/propose" className="rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-5 py-3 font-black text-black">✍️ 문제 제안하기</Link><Link href="/issues" className="rounded-xl bg-white/10 px-5 py-3 font-bold">의제 둘러보기</Link></div>
        </section>
      </div>
    </div>
  );
}
