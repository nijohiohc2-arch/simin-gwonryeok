import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { IssueFeed } from "@/components/home/IssueFeed";
import Loading from "../loading";
export const metadata: Metadata = { title: "의제 탐색" };
export default function Issues() {
  return (<>
    <Suspense fallback={<Loading />}><IssueFeed /></Suspense>
    <div className="mx-auto mt-8 max-w-6xl px-5"><div className="rounded-2xl border border-dashed border-white/25 p-5 text-sm">찾는 의제가 없나요? 직접 제안하면 운영진이 7일 안에 공개 기준 검토 결과와 사유를 알려드려요. <Link href="/propose" className="font-bold text-amber-300">의제 제안하기 →</Link></div></div>
  </>);
}
