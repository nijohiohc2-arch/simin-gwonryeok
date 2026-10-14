"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { backendEnabled } from "@/lib/supabase";
import { remoteLoad, remoteSave } from "@/lib/remote";
const EVT = "cos-storage";
const SYNCED = /^cos\.(votes|join|task|mine|proposals)(\.|$)/;
/** 기록 저장소: 항상 localStorage에 쓰고, 로그인 상태면 Supabase(본인 행)와 동기화. 같은 키끼리 탭 내 동기화. */
export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init); const [loaded, setLoaded] = useState(false); const cur = useRef<T>(init);
  useEffect(() => {
    let alive = true;
    const read = () => { try { const s = localStorage.getItem(key); const n = s ? JSON.parse(s) : init; cur.current = n; setV(n); } catch { /* 무시 */ } };
    read();
    const done = () => alive && setLoaded(true);
    if (backendEnabled && SYNCED.test(key)) remoteLoad(key).then((r) => { if (!alive) return; if (r !== undefined) { cur.current = r as T; setV(r as T); try { localStorage.setItem(key, JSON.stringify(r)); } catch { /* 무시 */ } } done(); }).catch(done);
    else done();
    const on = (e: Event) => { const d = (e as CustomEvent).detail; if (d === key || d === "*") read(); };
    window.addEventListener(EVT, on); return () => { alive = false; window.removeEventListener(EVT, on); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((n: T) => {
    const prev = cur.current; cur.current = n; setV(n);
    try { localStorage.setItem(key, JSON.stringify(n)); window.dispatchEvent(new CustomEvent(EVT, { detail: key })); } catch { /* 무시 */ }
    if (backendEnabled && SYNCED.test(key)) remoteSave(key, n, prev).catch(() => { /* 오프라인 등: 로컬엔 남음 */ });
  }, [key]);
  return [v, set, loaded] as const;
}
