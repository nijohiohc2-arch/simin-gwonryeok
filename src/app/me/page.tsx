"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BADGES, ISSUES } from "@/lib/data";
import { useMockAuth } from "@/hooks/useMockAuth";
import { remoteLoad, deleteMe } from "@/lib/remote";
type Act = { proposals: { title: string; date: string }[]; votes: { id: string; title: string; n: number }[]; statements: number; supports: { id: string; title: string; supported: boolean; role?: string; n?: number }[]; tasks: { id: string; title: string; task: string }[] };
function local<T>(k: string, d: T): T { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; } }
export default function Me() {
  const { user, login, logout, real, loaded } = useMockAuth(); const [a, setA] = useState<Act | null>(null); const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!loaded) return;
    const keys = ["cos.proposals", ...ISSUES.flatMap((i) => ["votes", "mine", "join", "task"].map((k) => `cos.${k}.${i.id}`))];
    Promise.all(keys.map(async (k) => [k, real && user ? await remoteLoad(k) : undefined] as const)).then((pairs) => {
    const R = new Map(pairs);
    const read = <T,>(k: string, d: T): T => (R.get(k) as T | undefined) ?? local(k, d);
    setA({
      proposals: read("cos.proposals", []),
      votes: ISSUES.map((i) => ({ id: i.id, title: i.title, n: Object.keys(read<Record<string, string>>(`cos.votes.${i.id}`, {})).length })).filter((x) => x.n > 0),
      statements: ISSUES.reduce((s, i) => s + read<string[]>(`cos.mine.${i.id}`, []).length, 0),
      supports: ISSUES.map((i) => ({ id: i.id, title: i.title, ...read<{ supported: boolean; role?: string; n?: number }>(`cos.join.${i.id}`, { supported: false }) })).filter((x) => x.supported || x.n),
      tasks: ISSUES.map((i) => ({ id: i.id, title: i.title, task: read<string | null>(`cos.task.${i.id}`, null) })).filter((x): x is { id: string; title: string; task: string } => !!x.task),
    });
    });
  }, [loaded, real, user]);
  if (!a) return <div className="mx-auto max-w-3xl space-y-3 px-5 py-8" aria-busy="true"><div className="h-24 animate-pulse rounded-3xl bg-white/5" /><div className="h-40 animate-pulse rounded-3xl bg-white/5" /></div>;
  const totalVotes = a.votes.reduce((s, v) => s + v.n, 0);
  const earned: Record<string, boolean> = { propose: a.proposals.length > 0, deliberate: totalVotes >= 5, statement: a.statements > 0, support: a.supports.some((s) => s.supported), team: a.supports.some((s) => s.n), task: a.tasks.length > 0 };
  const empty = !a.proposals.length && !a.votes.length && !a.supports.length && !a.tasks.length;
  return (
    <div className="mx-auto max-w-3xl px-5 py-6">
      <div className="flex items-center gap-3 rounded-3xl border border-line bg-panel p-5">
        <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-2xl">🌳</span>
        <div className="flex-1"><h1 className="text-xl font-black">{user ? user.nickname : "게스트"}</h1><p className="text-xs text-white/75">{real && user ? "카카오 계정으로 기록이 저장돼요 (본인만 볼 수 있음)" : real ? "로그인하면 기록이 저장돼요 · 지금은 이 브라우저에만 남아요" : "기록은 이 브라우저에만 저장돼요 (예시 · 서버 없음)"}</p></div>
        <button onClick={user ? logout : login} className={`rounded-full px-3 py-1.5 text-xs font-bold ${user ? "bg-white/10" : "bg-[#FEE500] text-black"}`}>{user ? "로그아웃" : "카카오로 시작"}</button>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">{[["제안", a.proposals.length], ["카드 응답", totalVotes], ["공감·합류", a.supports.length], ["맡은 작업", a.tasks.length]].map(([l, v]) => <div key={l as string} className="rounded-2xl bg-panel p-3"><div className="text-2xl font-black text-amber-200">{v}</div><div className="text-[11px] text-white/75">{l}</div></div>)}</div>
      <section className="mt-6"><h2 className="font-black">활동 배지</h2>
        <ul className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-6">{BADGES.map((b) => <li key={b.key} className={`rounded-2xl p-3 text-center text-xs ${earned[b.key] ? "border border-amber-300/50 bg-amber-300/10" : "bg-white/5 text-white/60"}`}><span aria-hidden className={`block text-2xl ${earned[b.key] ? "" : "grayscale opacity-50"}`}>{b.emoji}</span>{b.label}<span className="sr-only">{earned[b.key] ? " (획득)" : " (미획득)"}</span></li>)}</ul>
        <p className="mt-2 text-[11px] text-white/70">배지는 활동 기록일 뿐, 의결권이나 금전 가치가 없습니다.</p></section>
      {empty && <div className="mt-6 rounded-3xl border border-dashed border-white/25 p-6 text-center"><p className="font-bold">아직 참여 기록이 없어요</p><p className="mt-1 text-sm text-white/75">1분 카드 숙의부터 시작해 보세요.</p><Link href="/deliberate/night-bus" className="mt-4 inline-block rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-5 py-3 font-black text-black">카드 숙의 시작</Link></div>}
      {[["✍️ 내 제안", a.proposals.map((p) => [p.title, `${p.date} · 상태: 접수 (예시)`, "/propose"])], ["🗳️ 카드 숙의", a.votes.map((v) => [v.title, `${v.n}문장 응답`, `/deliberate/${v.id}`])], ["🤝 공감·실행팀", a.supports.map((s) => [s.title, s.n ? `실행팀 참여${s.n > 0 ? ` ${s.n}번째` : ""} · ${s.role ?? ""}` : "공감", `/agreement/${s.id}`])], ["🙋 맡은 작업", a.tasks.map((t) => [t.title, t.task, `/room/${t.id}`])]].map(([h, rows]) => (rows as string[][]).length > 0 && (
        <section key={h as string} className="mt-6"><h2 className="font-black">{h as string}</h2><ul className="mt-2 space-y-2">{(rows as string[][]).map(([t, s, href], i) => <li key={i}><Link href={href} className="flex items-center justify-between rounded-2xl border border-line bg-panel p-3"><span><b className="block text-sm">{t}</b><span className="text-xs text-white/75">{s}</span></span><span aria-hidden className="text-white/60">›</span></Link></li>)}</ul></section>))}
      <section className="mt-10 rounded-2xl border border-white/15 p-4 text-sm"><h2 className="font-bold">{real && user ? "탈퇴 · 기록 삭제" : "기록 삭제"}</h2><p className="mt-1 text-xs text-white/75">{real && user ? "계정과 모든 참여 기록(카드 응답·공감·실행팀·제안·작업)이 즉시 삭제돼요. 되돌릴 수 없어요." : "이 브라우저에 저장된 참여 기록을 모두 지워요."} <Link href="/privacy" className="underline">개인정보 처리 안내</Link></p><button disabled={busy} onClick={async () => { if (!confirm(real && user ? "정말 탈퇴하고 모든 기록을 삭제할까요?" : "이 브라우저의 기록을 모두 지울까요?")) return; setBusy(true); try { await deleteMe(); location.reload(); } catch { alert("삭제에 실패했어요. 잠시 후 다시 시도해 주세요."); setBusy(false); } }} className="mt-3 rounded-xl border border-red-400/60 px-4 py-2 font-bold text-red-300 disabled:opacity-50">{busy ? "삭제 중…" : real && user ? "탈퇴하고 기록 삭제" : "기록 지우기"}</button></section>
    </div>
  );
}
