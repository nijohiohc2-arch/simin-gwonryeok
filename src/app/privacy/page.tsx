import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "개인정보 처리 안내" };
export default function Privacy() {
  const row = "border-t border-line"; const td = "p-3 align-top";
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 text-[15px] leading-7">
      <h1 className="text-3xl font-black">개인정보 처리 안내</h1>
      <p className="mt-2 text-sm text-white/75">프로토타입 초안 · 2026.10.12 · 정식 서비스 전 법률 검토 후 개정 예정</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line"><table className="w-full text-sm"><thead className="bg-white/5 text-left"><tr><th className="p-3">항목</th><th className="p-3">내용</th></tr></thead><tbody>
        <tr className={row}><td className={`${td} font-bold`}>수집 항목</td><td className={td}>카카오 로그인 시: 카카오 회원 고유 ID(인증 처리용), 카카오 닉네임(공개 별칭). 실명·전화번호·이메일·주소는 요청하지 않아요.</td></tr>
        <tr className={row}><td className={`${td} font-bold`}>참여 기록</td><td className={td}>카드 응답, 제안한 문장, 공감·실행팀 참여(역할), 의제 제안, 맡은 작업</td></tr>
        <tr className={row}><td className={`${td} font-bold`}>목적</td><td className={td}>로그인 유지, 내 참여 기록 저장·조회, 의제별 참여 숫자 집계</td></tr>
        <tr className={row}><td className={`${td} font-bold`}>공개 범위</td><td className={td}>개인별 기록은 본인만 볼 수 있어요. 다른 사람에게는 의제별 숫자(공감 수·실행팀 수·응답자 수)만 공개되고, 이름·지역 명단은 공개하지 않아요.</td></tr>
        <tr className={row}><td className={`${td} font-bold`}>보관·삭제</td><td className={td}>탈퇴할 때까지 보관해요. <Link href="/me" className="underline">내 참여 → 탈퇴하고 기록 삭제</Link>를 누르면 계정과 모든 기록이 즉시 삭제돼요.</td></tr>
        <tr className={row}><td className={`${td} font-bold`}>처리 위탁·저장 위치</td><td className={td}>Supabase(데이터베이스·인증, 서울 리전 예정), Netlify(웹 호스팅), 카카오(로그인)</td></tr>
        <tr className={row}><td className={`${td} font-bold`}>로그인하지 않으면</td><td className={td}>기록은 이 브라우저(localStorage)에만 남고 서버로 보내지 않아요.</td></tr>
      </tbody></table></div>
      <p className="mt-6 text-sm text-white/80">정치적 견해는 민감할 수 있어 최소한만 수집하고, 개인별 응답을 공개하거나 다른 목적으로 쓰지 않아요. 문의·정정 요청은 <Link href="/principles#correction" className="underline">정정·이의 제기 절차</Link>를 따라요.</p>
    </div>
  );
}
