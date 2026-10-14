"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMockAuth } from "@/hooks/useMockAuth";
export const NAV = [
  { href: "/", label: "홈", icon: "🏠" }, { href: "/issues", label: "의제", icon: "🔎" }, { href: "/propose", label: "제안", icon: "✍️" },
  { href: "/about", label: "시민권력이란", icon: "✊" }, { href: "/me", label: "내 참여", icon: "🙋" },
];
export const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href));
export function Header() {
  const { user, login, logout } = useMockAuth(); const path = usePathname();
  return (
    <header className="sticky top-0 z-40 glass border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2" aria-label="시민권력 OS 홈">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-black text-black">✊</span>
          <span className="leading-tight"><b className="block text-[15px]">시민권력 OS</b><span className="block text-[10px] text-white/60">가칭 · 프로토타입</span></span>
        </Link>
        <nav className="ml-auto hidden gap-6 text-sm md:flex" aria-label="주 메뉴">
          {[...NAV.slice(1), { href: "/principles", label: "운영 원칙", icon: "" }].map((n) => <Link key={n.href} href={n.href} aria-current={isActive(path, n.href) ? "page" : undefined} className={isActive(path, n.href) ? "font-bold text-amber-300" : "text-white/75 hover:text-white"}>{n.label}</Link>)}
        </nav>
        <button onClick={user ? logout : login} className={`ml-auto rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 md:ml-4 ${user ? "bg-white/10" : "bg-[#FEE500] text-black"}`}>{user ? `${user.nickname} · 로그아웃` : "카카오로 시작"}</button>
      </div>
    </header>
  );
}
