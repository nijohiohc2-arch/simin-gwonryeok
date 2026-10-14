"use client";
import { useState } from "react";
import Link from "next/link";
import { Stepper } from "@/components/common/Stepper";
import { useLocal } from "@/hooks/useLocal";
const F = "w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-vio";
function Chips({ opts }: { opts: string[] }) { const [s, setS] = useState<string[]>([]); return <div className="flex flex-wrap gap-2">{opts.map((o) => <button type="button" key={o} onClick={() => setS(s.includes(o) ? s.filter((x) => x !== o) : [...s, o])} className={`rounded-full px-3 py-1.5 text-sm ${s.includes(o) ? "bg-white font-bold text-black" : "bg-white/10"}`}>{o}</button>)}</div>; }
export default function Propose() {
  const [done, setDone] = useState(false); const [agree, setAgree] = useState(false); const [title, setTitle] = useState("");
  const [proposals, setProposals] = useLocal<{ title: string; date: string }[]>("cos.proposals", []);
  if (done) return (
    <div className="mx-auto max-w-2xl px-5 py-10 text-center">
      <div className="text-6xl">🌱</div><h1 className="mt-3 text-2xl font-black">접수되었어요 <span className="text-amber-200 text-sm">(예시)</span></h1>
      <p className="mt-2 text-sm text-white/75">‘접수’는 정책으로 채택되었다는 뜻이 아니에요.</p>
      <div className="mt-6 text-left"><Stepper current="접수" /></div>
      <div className="mt-5 rounded-2xl border border-line bg-panel p-4 text-left text-sm"><b>다음: <Link href="/principles#review" className="underline">공개 기준 검토</Link> (7일 이내)</b><ul className="mt-2 list-disc space-y-1 pl-5 text-white/70"><li>구체성 — 문제와 장소·대상이 분명한가</li><li>공익성 — 특정 개인·업체의 이익이 아닌가</li><li>근거 — 사실과 추정이 구분되었는가</li><li>개인정보 보호 — 특정인을 식별·비방하지 않는가</li><li>정치 중립 — 특정 정당·후보 지지/반대가 아닌가</li></ul><p className="mt-2 text-white/70">통과하지 못해도 사유와 이의 제기 경로를 공개해요.</p></div>
      <div className="mt-6 flex justify-center gap-2"><Link href="/me" className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-black">내 참여에서 보기</Link><Link href="/issues" className="rounded-xl bg-white/10 px-5 py-3 font-bold">다른 의제 둘러보기</Link></div>
    </div>);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setProposals([...proposals, { title, date: new Date().toLocaleDateString("ko-KR") }]); setDone(true); }} className="mx-auto max-w-2xl px-5 py-6">
      <h1 className="text-2xl font-black">당신이 본 문제, <span className="grad-text">여기서 시작돼요</span> ✍️</h1>
      <p className="mt-2 rounded-xl bg-amber-300/10 p-3 text-xs text-amber-200">제출하면 상태는 ‘접수’예요. 운영진이 공개 기준(구체성·공익성·근거·개인정보·정치 중립)으로 7일 안에 검토 결과와 사유를 알려드려요. 통과하면 카드 공론장이 열려요.</p>
      <div className="mt-5 space-y-4 text-sm">
        <label className="block"><b>의제 제목 *</b><input required value={title} onChange={(e) => setTitle(e.target.value)} className={F + " mt-1"} placeholder="예: 학교 앞 300m 불법 주정차 해소" /></label>
        <label className="block"><b>문제 설명 *</b><textarea required rows={3} className={F + " mt-1"} /></label>
        <label className="block"><b>영향을 받는 사람/지역 *</b><input required className={F + " mt-1"} /></label>
        <label className="block"><b>왜 지금 다뤄야 하나요? *</b><input required className={F + " mt-1"} /></label>
        <label className="block"><b>근거·출처 / 추가 조사 필요 부분 *</b> <span className="text-white/70">사실과 추정을 구분해 주세요</span><textarea required rows={2} className={F + " mt-1"} /></label>
        <div><b>원하는 다음 단계</b><div className="mt-2"><Chips opts={["카드 공론장", "현장 조사", "기관 질의", "공동 실험"]} /></div></div>
        <div><b>필요한 협력</b><div className="mt-2"><Chips opts={["시민", "전문가", "기업·민간", "행정·공공기관"]} /></div></div>
        <div><b>공개 이름</b><div className="mt-2 flex gap-4"><label><input type="radio" name="n" defaultChecked /> 별칭</label><label><input type="radio" name="n" /> 실명</label></div></div>
        <label className="flex items-start gap-2"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" /> 개인정보 최소 수집·공개 범위에 동의합니다. 연락처는 공개되지 않습니다.</label>
      </div>
      <button disabled={!agree} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 text-black py-4 font-black disabled:opacity-40">제안 제출하기 (예시)</button>
    </form>);
}
