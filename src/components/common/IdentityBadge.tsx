"use client";
import { useMockAuth } from "@/hooks/useMockAuth";
export function IdentityBadge() {
  const { user, loaded, real } = useMockAuth();
  if (!loaded) return <div className="h-10 animate-pulse rounded-xl bg-white/5" />;
  return user ? (
    <div className="flex items-center gap-2 rounded-xl border border-mint/40 bg-mint/10 px-3 py-2 text-sm text-mint"><span className="h-2 w-2 rounded-full bg-mint" /> {real ? "카카오 로그인" : "로그인됨 (모의)"} · 공개 별칭 “{user.nickname}”</div>
  ) : (
    <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/80"><span className="h-2 w-2 rounded-full bg-white/50" /> {real ? "로그인하면 기록이 저장돼요 · 지금은 이 브라우저에만 남아요" : "로그인 전 · 별칭으로만 참여해요 (모의)"}</div>
  );
}
