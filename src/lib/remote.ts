"use client";
// localStorage 키 ↔ Supabase 테이블 매핑. 로그인한 경우에만 사용(본인 행만, RLS로 보호).
import { supabase } from "./supabase";
type Join = { supported: boolean; role?: string; n?: number };
async function uid() { const { data } = await supabase!.auth.getSession(); return data.session?.user.id ?? null; }

export async function remoteLoad(key: string): Promise<unknown | undefined> {
  if (!supabase || !(await uid())) return undefined;
  const [, kind, id] = key.split(".");
  if (kind === "votes") { const { data } = await supabase.rpc("civic_get_votes", { p_issue: id }); return data ?? {}; }
  if (kind === "join") { const { data } = await supabase.rpc("civic_get_join", { p_issue: id }); return data ? { supported: data.supported, role: data.role ?? undefined, n: data.team ? -1 : undefined } : { supported: false }; }
  if (kind === "task") { const { data } = await supabase.rpc("civic_get_task", { p_issue: id }); return data ?? null; }
  if (kind === "mine") { const { data } = await supabase.rpc("civic_get_statements", { p_issue: id }); return data ?? []; }
  if (kind === "proposals") { const { data } = await supabase.rpc("civic_get_proposals"); return ((data ?? []) as { title: string; created_at: string }[]).map((r) => ({ title: r.title, date: new Date(r.created_at).toLocaleDateString("ko-KR") })); }
  return undefined;
}
export async function remoteSave(key: string, value: unknown, prev: unknown) {
  if (!supabase || !(await uid())) return;
  const [, kind, id] = key.split(".");
  if (kind === "votes") await supabase.rpc("civic_set_votes", { p_issue: id, p_votes: value ?? {} });
  else if (kind === "join") { const j = value as Join; await supabase.rpc("civic_set_join", { p_issue: id, p_supported: !!j.supported, p_role: j.role ?? null, p_team: !!j.n }); }
  else if (kind === "task") await supabase.rpc("civic_set_task", { p_issue: id, p_task: value ? String(value) : null });
  else if (kind === "mine") { const a = value as string[], b = (prev as string[]) ?? []; for (const body of a.slice(b.length)) await supabase.rpc("civic_add_statement", { p_issue: id, p_body: body }); }
  else if (kind === "proposals") { const a = value as { title: string; body?: Record<string, string> }[], b = (prev as unknown[]) ?? []; for (const p of a.slice(b.length)) await supabase.rpc("civic_add_proposal", { p_title: p.title, p_body: p.body ?? {} }); }
}
/** 공개 집계(숫자만) */
export async function issueCounts(issueId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("civic_issue_counts", { p_issue: issueId });
  if (error || !data?.[0]) return null; return data[0] as { supporters: number; team: number; voters: number };
}
export async function deleteMe() {
  if (supabase && (await uid())) { const { error } = await supabase.rpc("civic_delete_me"); if (error) throw error; await supabase.auth.signOut(); }
  Object.keys(localStorage).filter((k) => k.startsWith("cos.") && k !== "cos.introSeen").forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("cos-storage", { detail: "*" }));
}
