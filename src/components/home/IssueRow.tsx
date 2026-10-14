import Link from "next/link";
import type { Issue } from "@/lib/data";
import { stageHref, STAGE_CTA } from "@/lib/data";
import { ExampleBadge } from "@/components/common/Badge";
export function IssueRow({ title, items, more = "/issues" }: { title: string; items: Issue[]; more?: string }) {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <div className="flex items-end justify-between px-5"><h2 className="text-lg font-black md:text-2xl">{title}</h2><Link href={more} className="text-sm text-white/70">전체 ›</Link></div>
      <ul className="mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
        {items.map((it) => (
          <li key={it.id} className="w-[150px] shrink-0 snap-start md:w-[210px]">
            <Link href={stageHref(it)} className="group block">
              <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${it.gradient} p-2.5 transition group-hover:scale-[1.03]`}>
                <div aria-hidden className="absolute -bottom-3 -right-2 text-[90px] leading-none md:text-[120px]">{it.emoji}</div>
                <div className="flex flex-wrap gap-1"><span className="rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold">{it.stage}</span><ExampleBadge /></div>
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold">▶ {STAGE_CTA[it.stage]}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug">{it.title}</p>
              <p className="text-[11px] text-white/70">{it.region} · {it.needs}</p>
            </Link>
          </li>))}
      </ul>
    </section>
  );
}
