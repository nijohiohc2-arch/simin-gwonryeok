"use client";
// 인증: Supabase(카카오) 설정 시 실제 로그인, 아니면 모의 로그인(localStorage 별칭).
import { useEffect, useState } from "react";
import { supabase, backendEnabled } from "@/lib/supabase";
import { useLocal } from "./useLocal";
export interface MockUser { nickname: string }
type Real = { user: MockUser | null; loaded: boolean };
let realState: Real = { user: null, loaded: false }; const subs = new Set<(s: Real) => void>();
if (typeof window !== "undefined" && supabase) {
  const apply = async (uid: string | undefined, meta: Record<string, unknown> | undefined) => {
    let nickname = (meta?.name ?? meta?.nickname ?? meta?.preferred_username ?? "시민") as string;
    if (uid) { const { data } = await supabase!.from("profiles").select("nickname").eq("id", uid).maybeSingle(); if (data?.nickname) nickname = data.nickname; }
    realState = { user: uid ? { nickname } : null, loaded: true }; subs.forEach((f) => f(realState));
    window.dispatchEvent(new CustomEvent("cos-storage", { detail: "*" })); // 로그인 상태 변화 → 기록 다시 읽기
  };
  supabase.auth.getSession().then(({ data }) => apply(data.session?.user.id, data.session?.user.user_metadata));
  supabase.auth.onAuthStateChange((_e, s) => { void apply(s?.user.id, s?.user.user_metadata); });
}
export function useMockAuth() {
  const [mock, setMock, mockLoaded] = useLocal<MockUser | null>("cos.user", null);
  const [real, setReal] = useState<Real>(realState);
  useEffect(() => { if (!backendEnabled) return; setReal(realState); subs.add(setReal); return () => { subs.delete(setReal); }; }, []);
  if (backendEnabled && supabase) {
    return {
      user: real.user, loaded: real.loaded, authenticated: !!real.user, real: true as const,
      login: () => { void supabase!.auth.signInWithOAuth({ provider: "kakao", options: { redirectTo: window.location.href.split("#")[0] } }); },
      logout: () => { void supabase!.auth.signOut(); },
    };
  }
  return { user: mock, loaded: mockLoaded, authenticated: !!mock, real: false as const, login: () => setMock({ nickname: "느티나무" + Math.floor(10 + Math.random() * 90) }), logout: () => setMock(null) };
}
