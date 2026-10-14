import type { Metadata } from "next";
export const metadata: Metadata = { title: "운영 원칙·검토 기준" };
const PRINCIPLES = ["운영자도 통제 대상: 창립자·운영진에게 무제한 결정권을 주지 않아요.", "돈으로 표를 사지 못함: 기부·후원과 의사결정 영향력을 분리해요. (현재 모금 기능 없음)", "근거와 의견을 구분: 사실 주장에는 출처, 불확실한 내용에는 불확실성을 표시해요.", "소수 의견 보존: 다수 결과만이 아니라 주요 반대 근거도 기록해요.", "위임은 추적·철회 가능: 향후 위임 기능을 도입하면 기간·범위·철회 절차를 명시해요.", "개인정보 최소 수집: 공개 프로필(별칭)과 신원 정보를 분리해요.", "참여와 대표성을 혼동하지 않음: 온라인 참여 결과를 여론이나 법적 투표로 과장하지 않아요.", "이해충돌 공개: 관련 사업·단체와 이해관계가 있으면 표시해요.", "정정 가능성: 오류 지적, 답변, 변경 이력을 남겨요.", "접근성: 모바일 우선, 쉬운 한국어, 저속 연결, 보조기술을 고려해요."];
const REVIEW = [["구체성", "문제·장소·대상이 분명한가"], ["공익성", "특정 개인·업체의 이익이 아닌가"], ["근거", "사실과 추정이 구분되었는가, 출처가 있는가"], ["개인정보 보호", "특정인을 식별·비방하지 않는가"], ["정치 중립", "특정 정당·후보의 지지·반대가 목적이 아닌가"]];
export default function Principles() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 text-[15px] leading-7">
      <h1 className="text-3xl font-black">운영 원칙·검토 기준</h1>
      <p className="mt-2 text-sm text-white/75">초안 · 파일럿 운영을 거치며 시민과 함께 고쳐 나갑니다.</p>
      <section className="mt-8"><h2 className="text-xl font-black">거버넌스 원칙 10</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-white/90">{PRINCIPLES.map((p) => <li key={p}>{p}</li>)}</ol></section>
      <section id="review" className="mt-10 scroll-mt-20"><h2 className="text-xl font-black">공개 기준 검토 (제안 → 공개)</h2>
        <p className="mt-2 text-white/85">제안은 ‘접수’ 후 7일 안에 아래 5가지 기준으로 검토하고, 통과 여부와 사유를 공개해요. 통과하면 카드 공론장이 열려요.</p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line"><table className="w-full text-sm"><thead className="bg-white/5 text-left"><tr><th className="p-3">기준</th><th className="p-3">확인하는 것</th></tr></thead><tbody>{REVIEW.map(([k, v]) => <tr key={k} className="border-t border-line"><td className="p-3 font-bold text-amber-200">{k}</td><td className="p-3 text-white/85">{v}</td></tr>)}</tbody></table></div></section>
      <section className="mt-10"><h2 className="text-xl font-black">합의안 기준</h2><p className="mt-2 text-white/85">카드 공론장에서 응답 패턴으로 나눈 의견 그룹 모두가 75% 이상 동의한 문장만 시민 합의안 초안이 돼요. 합의에 이르지 못한 주요 의견은 소수 의견으로 함께 실어요. 시민 합의안은 법적 효력이 있는 의결·청원이 아니에요.</p></section>
      <section id="privacy" className="mt-10 scroll-mt-20"><h2 className="text-xl font-black">데이터·개인정보</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-white/85"><li>공감·실행팀 참여는 숫자만 공개하고, 실명·지역 명단은 공개하지 않아요.</li><li>개인별 카드 응답은 공개하지 않고 그룹 집계만 보여줘요.</li><li>정치적 견해는 민감할 수 있어 최소 수집·별도 동의·보관 기간·삭제를 보장해요.</li><li>블록체인 등 지울 수 없는 저장소를 쓰지 않아요.</li><li>이 프로토타입은 모든 기록을 사용자의 브라우저(localStorage)에만 저장해요.</li></ul></section>
      <section id="correction" className="mt-10 scroll-mt-20"><h2 className="text-xl font-black">정정·이의 제기</h2><ol className="mt-2 list-decimal space-y-1 pl-5 text-white/85"><li>각 화면의 ‘⚑ 정정 요청’으로 근거와 함께 접수</li><li>7일 안에 운영진이 검토하고 처리 결과·사유를 공개</li><li>수정되면 변경 이력에 변경자·시각·사유를 기록</li><li>삭제·숨김 조치도 사유와 이의 제기 경로를 남김</li></ol></section>
      <section className="mt-10 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-4 text-sm"><b>법적 범위</b><p className="mt-1 text-white/85">공식 청원·주민조례청구는 법정 절차와 공식 시스템을 통해서만 가능해요. 이 플랫폼은 그것을 대신하지 않으며, 선거 관련 기능(후보 지지·모금·선거운동)이 없어요. 실서비스 전 법률 검토가 필요해요.</p></section>
    </div>
  );
}
