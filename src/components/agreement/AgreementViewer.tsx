import type { Issue, Agreement } from "@/lib/data";
export function AgreementViewer({ issue, a }: { issue: Issue; a: Agreement }) {
  return (
    <article className="paper relative overflow-hidden rounded-2xl p-6 shadow-2xl md:p-10">
      <div className="absolute right-4 top-14 grid h-28 w-28 animate-stamp place-items-center rounded-full border-4 border-amber-700/80 text-center text-amber-800" style={{ animationDelay: ".3s" }} aria-label={`양 그룹 공통 합의 ${issue.consensus}%, ${issue.participants}명 참여`}>
        <div className="leading-tight"><b className="block text-sm">시민 숙의</b><b className="block text-xl">{issue.consensus}%</b><span className="block text-[10px]">{issue.participants.toLocaleString()}명 참여</span><span className="block text-[9px]">양 그룹 공통 합의</span></div>
      </div>
      <p className="text-xs tracking-widest text-black/60">{a.number} · 예시 문서</p>
      <h2 className="mt-2 pr-28 text-xl font-bold leading-snug md:text-2xl">{a.title}</h2>
      <p className="mt-3 rounded bg-black/5 p-2 text-[12px] leading-5 text-black/75">이 문서는 온라인 카드 공론장 참여자들의 공통분모를 정리한 <b>시민 합의안</b>이며, 법적 효력이 있는 의결·입법·청원·주민조례청구가 아닙니다. 참여자 수는 전체 주민 여론을 대표하지 않습니다.</p>
      <hr className="my-5 border-black/20" />
      <h3 className="font-bold">전문(前文)</h3>
      <p className="mt-1 text-[15px] leading-7">{a.preamble}</p>
      {a.articles.map(([h, b]) => <section key={h} className="mt-5"><h3 className="font-bold">{h}</h3><p className="mt-1 text-[15px] leading-7">{b}</p></section>)}
      <section className="mt-6 rounded-lg border border-black/20 p-3 text-sm"><b>소수 의견 (기록 보존)</b><p className="mt-1 text-black/75">{a.minority}</p></section>
    </article>
  );
}
