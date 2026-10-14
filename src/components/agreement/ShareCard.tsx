"use client";
import { useEffect, useRef } from "react";
export function ShareCard({ open, n, role, short, onClose }: { open: boolean; n: number; role: string; short: string; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; ref.current?.focus(); const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="실행팀 참여 카드" className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-5 backdrop-blur" onClick={onClose}>
      <div className="w-full max-w-sm animate-rise" onClick={(e) => e.stopPropagation()}>
        <div data-testid="share-card" className="relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_70%_20%,#f59e0b,#78350f_55%,#0b0b12)] p-6 shadow-[0_0_60px_rgba(245,158,11,.45)]">
          <div aria-hidden className="absolute -right-4 -top-2 text-[120px] opacity-30">✊</div>
          <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold">예시 · 서명·투표 아님</span>
          <p className="mt-6 text-sm text-white/85">시민권력 OS (가칭)</p>
          <p className="mt-2 text-2xl font-black leading-snug">나는 {short} 실행팀의 <span className="block text-5xl text-amber-200">{n.toLocaleString()}</span>번째 참여자입니다</p>
          <p className="mt-4 text-sm text-white/90">맡은 역할: {role}</p>
          <p className="mt-6 text-[10px] text-white/75">이름·지역은 카드에 표시되지 않아요</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-[#FEE500] py-3 font-bold text-black">카카오톡 공유</button>
          <button className="rounded-xl bg-white/15 py-3 font-bold">이미지 저장</button>
        </div>
        <p className="mt-2 text-center text-[11px] text-white/70">프로토타입: 실제로 공유·저장되지 않아요</p>
        <button ref={ref} onClick={onClose} className="mt-1 w-full py-2 text-sm text-white/80">닫기</button>
      </div>
    </div>
  );
}
