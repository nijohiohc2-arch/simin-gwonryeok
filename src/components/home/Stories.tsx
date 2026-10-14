import Link from "next/link";
import { ISSUES } from "@/lib/data";
import { ExampleBadge } from "@/components/common/Badge";
export function Stories() {
  const done = ISSUES.filter((i) => i.result);
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <div className="flex items-end justify-between px-5"><h2 className="text-lg font-black md:text-2xl">✨ 해결된 이야기</h2><Link href="/issues?stage=결과 공개" className="text-sm text-white/70">전체 ›</Link></div>
      <ul className="mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-2 no-scrollbar md:grid md:grid-cols-2">
        {done.map((s) => s.result && (
          <li key={s.id} className="w-[85%] shrink-0 snap-start md:w-auto">
            <Link href={`/results/${s.id}`} className="block overflow-hidden rounded-3xl border border-line bg-panel">
              <div className="grid grid-cols-2">
                <div className="bg-white/5 p-4"><span className="text-[10px] font-black tracking-widest text-white/60">BEFORE</span><div className="text-3xl font-black text-white/75">{s.result.before[0]}</div><div className="text-xs text-white/70">{s.result.before[1]}</div></div>
                <div className={`bg-gradient-to-br ${s.gradient} p-4`}><span className="text-[10px] font-black tracking-widest">AFTER</span><div className="text-3xl font-black">{s.result.after[0]}</div><div className="text-xs">{s.result.after[1]}</div></div>
              </div>
              <div className="p-4"><b>{s.emoji} {s.title}</b> <ExampleBadge /><p className="mt-1 text-xs text-white/70">{s.summary} · {s.result.stats.map((x) => `${x[1]} ${x[0]}`).join(" · ")}</p></div>
            </Link>
          </li>))}
      </ul>
    </section>
  );
}
