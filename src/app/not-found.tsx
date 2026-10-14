import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="text-7xl font-black grad-text">404</p>
      <h1 className="mt-3 text-2xl font-black">찾는 페이지가 없어요</h1>
      <p className="mt-2 text-sm text-white/75">주소가 바뀌었거나, 아직 공개되지 않은 의제일 수 있어요. 직접 문제를 제안해 보는 건 어때요?</p>
      <div className="mt-6 flex justify-center gap-2"><Link href="/" className="rounded-xl bg-white px-5 py-3 font-bold text-black">홈으로</Link><Link href="/issues" className="rounded-xl bg-white/10 px-5 py-3 font-bold">의제 둘러보기</Link></div>
    </div>
  );
}
