import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ProtoBanner } from "@/components/common/ProtoBanner";
import { Header } from "@/components/common/Header";
import { BottomTabs } from "@/components/common/BottomTabs";
import { Footer } from "@/components/common/Footer";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESC = "위임한 힘을, 다시 시민에게. 시민이 문제를 제안하고, 카드 공론장에서 합의하고, 함께 실행하고, 결과를 공개합니다. (프로토타입 · 예시 데이터)";
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "시민권력 OS (가칭) — 위임한 힘을, 다시 시민에게", template: "%s · 시민권력 OS (가칭)" },
  description: DESC,
  openGraph: { type: "website", locale: "ko_KR", siteName: "시민권력 OS (가칭)", title: "시민권력 — 위임한 힘을, 다시 시민에게", description: DESC, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "수많은 빛이 모여 하나의 주먹을 이루는 상징 이미지" }] },
  twitter: { card: "summary_large_image", title: "시민권력 — 위임한 힘을, 다시 시민에게", description: DESC, images: ["/og.jpg"] },
  robots: { index: false, follow: false }, // 프로토타입: 검색 노출 차단
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#07070c" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning><body className="min-h-screen">
      <script dangerouslySetInnerHTML={{ __html: `try{if(location.pathname==="/"&&!sessionStorage.getItem("cos.introSeen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="1"}catch(e){}` }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">본문 바로가기</a>
      <ProtoBanner /><Header /><main id="main">{children}</main><Footer /><BottomTabs />
    </body></html>
  );
}
