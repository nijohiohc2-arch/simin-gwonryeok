import Link from "next/link";
import { HeroIntro } from "./HeroIntro";
/** 첫 화면 풀스크린 히어로 — 텍스트는 항상 DOM에 있고(SEO·접근성), 인트로는 캔버스 + CSS로만 연출 */
export function PowerHero() {
  return (
    <section id="hero" className="relative h-[calc(100svh-104px)] min-h-[600px] overflow-hidden md:h-[calc(100vh-82px)]">
      <div className="hero-shake absolute inset-0 flex items-end md:items-center">
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero/fist-desktop.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/hero/fist-desktop.jpg" />
          <source srcSet="/hero/fist-mobile.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/fist-mobile.jpg" alt="수많은 작은 금빛이 모여 하나의 들어 올린 주먹을 이루는 상징 이미지" fetchPriority="high"
            className="hero-img absolute inset-0 h-full w-full object-cover object-[50%_18%] md:object-[70%_40%]" />
        </picture>
        <HeroIntro />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/70 md:to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 md:pb-0">
          <div className="md:max-w-xl">
            <p className="hero-fade text-sm font-bold tracking-wide text-amber-200 md:text-lg" style={{ ["--d" as string]: ".35s" }}>수많은 작은 빛이 모이면</p>
            <h1 className="hero-title mt-1 origin-left bg-gradient-to-b from-white via-amber-100 to-amber-400 bg-clip-text text-[22vw] font-black leading-[.95] tracking-tighter text-transparent drop-shadow-[0_6px_40px_rgba(255,170,60,.35)] md:text-[140px]">시민권력</h1>
            <p className="hero-fade mt-4 text-2xl font-black leading-snug md:text-4xl" style={{ ["--d" as string]: ".6s" }}>위임한 힘을,<br className="md:hidden" /> 다시 시민에게.</p>
            <p className="hero-fade mt-2 max-w-md text-sm text-white/85 md:text-base" style={{ ["--d" as string]: ".75s" }}>문제를 제안하고, 함께 합의하고, 실행하고, 결과를 공개합니다. 정당도 후보도 아닌 시민의 문제 해결 인프라.</p>
            <div className="hero-fade mt-6 flex flex-wrap gap-2" style={{ ["--d" as string]: ".9s" }}>
              <Link href="/propose" className="pointer-events-auto rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3.5 font-black text-black shadow-[0_0_40px_rgba(255,180,60,.45)] transition active:scale-95">✍️ 문제 제안하기</Link>
              <Link href="/issues" className="pointer-events-auto rounded-xl border border-white/40 bg-black/30 px-6 py-3.5 font-bold backdrop-blur">의제 둘러보기</Link>
            </div>
            <p className="hero-fade mt-3 text-[11px] text-white/70" style={{ ["--d" as string]: "1s" }}>AI로 만든 상징 이미지 · 실제 집회·인물 아님</p>
          </div>
        </div>
        <a href="#more" className="hero-fade absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center text-[11px] text-white/75" style={{ ["--d" as string]: "1.1s" }} aria-label="아래로 스크롤"><span>아래로</span><span aria-hidden className="animate-bounce text-xl leading-none">⌄</span></a>
      </div>
    </section>
  );
}
