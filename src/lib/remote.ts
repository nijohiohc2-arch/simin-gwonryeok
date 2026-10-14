"use client";
// localStorage 키 ↔ Supabase 테이블 매핑. 로그인한 경우에만 사용(본인 행만, RLS로 보호).
import { supabase } from "./supabase";
type Votes = Record<number, "agree" | "disagree" | "pass">;
type Join = { supported: boolean; role?: string; n?: number };
async function uid() { const { data } = await supabase!.auth.getSession(); return data.session?.user.id ?? null; }

export async function remoteLoad(key: string): Promise<unknown | undefined> {
  if (!supabase || !(await uid())) return undefined;
  const [, kind, id] = key.split(".");
  if (kind === "votes") { const { data } = await supabase.from("votes").select("statement_id,choice").eq("issue_id", id); return Object.fromEntries((data ?? []).map((r) => [r.statement_id, r.choice])); }
  if (kind === "join") { const { data } = await supabase.from("supports").select("supported,role,team_joined_at").eq("issue_id", id).maybeSingle(); return data ? { supported: data.supported, role: data.role ?? undefined, n: data.team_joined_at ? -1 : undefined } : { supported: false }; }
  if (kind === "task") { const { data } = await supabase.from("tasks").select("task").eq("issue_id", id).maybeSingle(); return data?.task ?? null; }
  if (kind === "mine") { const { data } = await supabase.from("statements_submitted").select("body").eq("issue_id", id).order("id"); return (data ?? []).map((r) => r.body); }
  if (kind === "proposals") { const { data } = await supabase.from("proposals").select("title,created_at").order("id"); return (data ?? []).map((r) => ({ title: r.title, date: new Date(r.created_at).toLocaleDateString("ko-KR") })); }
  return undefined;
}
export async function remoteSave(key: string, value: unknown, prev: unknown) {
  const user_id = supabase ? await uid() : null; if (!supabase || !user_id) return;
  const [, kind, id] = key.split(".");
  if (kind === "votes") {
    const v = value as Votes; const rows = Object.entries(v).map(([s, choice]) => ({ user_id, issue_id: id, statement_id: Number(s), choice }));
    if (rows.length) await supabase.from("votes").upsert(rows);
    else await supabase.from("votes").delete().eq("issue_id", id);
  } else if (kind === "join") {
    const j = value as Join;
    if (!j.supported && !j.n) await supabase.from("supports").delete().eq("issue_id", id);
    else await supabase.from("supports").upsert({ user_id, issue_id: id, supported: j.supported, role: j.n ? j.role ?? null : null, team_joined_at: j.n ? new Date().toISOString() : null });
  } else if (kind === "task") {
    if (value) await supabase.from("tasks").upsert({ user_id, issue_id: id, task: String(value) }); else await supabase.from("tasks").delete().eq("issue_id", id);
  } else if (kind === "mine") {
    const a = value as string[], b = (prev as string[]) ?? []; for (const body of a.slice(b.length)) await supabase.from("statements_submitted").insert({ issue_id: id, body });
  } else if (kind === "proposals") {
    const a = value as { title: string; body?: Record<string, string> }[], b = (prev as unknown[]) ?? []; for (const p of a.slice(b.length)) await supabase.from("proposals").insert({ title: p.title, body: p.body ?? {} });
  }
}
/** 공개 집계(숫자만) */
export async function issueCounts(issueId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("issue_counts", { p_issue: issueId });
  if (error || !data?.[0]) return null; return data[0] as { supporters: number; team: number; voters: number };
}
export async function deleteMe() {
  if (supabase && (await uid())) { const { error } = await supabase.rpc("delete_me"); if (error) throw error; await supabase.auth.signOut(); }
  Object.keys(localStorage).filter((k) => k.startsWith("cos.") && k !== "cos.introSeen").forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("cos-storage", { detail: "*" }));
}
