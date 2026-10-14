"use client";
import { useState } from "react";
export function StatementSubmitModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (t: string) => void }) {
  const [t, setT] = useState(""); if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/70 backdrop-blur-sm md:place-items-center" onClick={onClose}>
      <div className="w-full animate-rise rounded-t-3xl border border-line bg-panel p-5 md:max-w-lg md:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <b className="text-lg">✍️ 새 문장 제안하기</b>
        <p className="mt-1 text-sm text-white/75">대댓글이 아닌 독립 문장으로 다른 시민들의 투표에 올라가요.</p>
        <textarea value={t} maxLength={140} onChange={(e) => setT(e.target.value)} rows={4} placeholder="예: 관리비 공개 자료는 모바일에서도 쉽게 볼 수 있어야 한다."
          className="mt-4 w-full resize-none rounded-xl border border-line bg-ink p-3 outline-none focus:border-vio" />
        <div className="mt-1 text-right text-xs text-white/70"><span className={t.length > 120 ? "text-hot" : ""}>{t.length}</span> / 140</div>
        <div className="mt-3 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl bg-white/10 py-3 font-bold">취소</button>
          <button disabled={!t.trim()} onClick={() => { onSubmit(t.trim()); setT(""); onClose(); }} className="flex-1 rounded-xl bg-gradient-to-r from-hot to-vio py-3 font-bold disabled:opacity-40">제출 (예시)</button>
        </div>
      </div>
    </div>
  );
}
