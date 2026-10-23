import type { Metadata } from "next";
import { GraphClient } from "@/components/graph/GraphClient";
export const metadata: Metadata = { title: "내 위치 · 내 정보", description: "참여자 전체를 그래프로 보고, 내 점으로 들어가 내 정보를 수정해요." };
export default function Page() { return <GraphClient />; }
