import Link from "next/link";
export function Footer() {
  return (
    <footer className="mt-16 border-t border-line px-4 pb-28 pt-8 text-center text-xs text-white/70 md:pb-8">
      <p className="font-bold text-white/85">시민권력 OS (가칭) · 프로토타입</p>
      <p className="mt-2 flex flex-wrap justify-center gap-4"><Link href="/about" className="underline-offset-2 hover:underline">시민권력이란</Link><Link href="/principles" className="hover:underline">운영 원칙·검토 기준</Link><Link href="/privacy" className="hover:underline">개인정보 처리 안내</Link><Link href="/principles#correction" className="hover:underline">정정·이의 제기</Link></p>
      <p className="mx-auto mt-3 max-w-xl leading-5">특정 정당·후보를 지지하지 않으며 후보 지지·모금·토큰 기능이 없습니다. 참여 수와 합의율은 참고 정보이며 전체 시민의 여론이나 법적 투표·서명·청원을 대표하지 않습니다. 이 플랫폼은 정당이나 행정기관을 대신하지 않습니다. 모든 데이터는 예시입니다.</p>
    </footer>
  );
}
