"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isActive } from "./Header";
export function BottomTabs() {
  const path = usePathname();
  return (
    <nav aria-label="하단 메뉴" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {NAV.map((n) => { const on = isActive(path, n.href); return (
          <li key={n.href}><Link href={n.href} aria-current={on ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${on ? "font-bold text-amber-300" : "text-white/70"}`}>
            {n.href === "/propose" ? <span aria-hidden className="-mt-5 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-lg text-black shadow-[0_0_20px_rgba(255,180,60,.5)]">✍️</span> : <span aria-hidden className="text-lg leading-none">{n.icon}</span>}
            {n.href === "/about" ? "시민권력" : n.label}</Link></li>); })}
      </ul>
    </nav>
  );
}
