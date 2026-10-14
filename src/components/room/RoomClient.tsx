"use client";
import Link from "next/link";
import type { Issue, Room } from "@/lib/data";
import { useLocal } from "@/hooks/useLocal";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Section } from "@/components/common/Section";
import { ProgressBar } from "@/components/common/ProgressBar";
export function RoomClient({ issue, room }: { issue: Issue; room: Room }) {
  const [task, setTask, loaded] = useLocal<string | null>(`cos.task.${issue.id}`, null);
  const { authenticated, login } = useMockAuth();
  const finished = issue.stage === "결과 공개";
  const open = room.tasks.find((t) => !t.done);
  const done = room.tasks.filter((t) => t.done).length;
  return (
    <div className="mx-auto max-w-4xl px-5 py-5">
      <div className="rounded-2xl border border-line bg-panel p-4">
        <div className="flex items-center justify-between text-sm"><b>{finished ? "✅ 실행 완료" : "🛠️ 실행 중"}</b><span className="text-white/75">참여 {room.members.toLocaleString()}명 · 작업 {done}/{room.tasks.length}</span></div>
        <div className="mt-2"><ProgressBar value={done} max={room.tasks.length} tone="mint" thin /></div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Section icon="🎯" title="목표와 성공 기준"><p>{room.goal}</p><p className="text-white/75">완료 기준: {room.criteria}</p></Section>
        <Section icon="👥" title="참여자 / 역할"><p className="text-2xl" aria-hidden>🌳 🦊 🐢 🐧 🦉</p><p>실행팀 리더: 별칭 ‘{issue.proposer}’ · 참여 {room.members}명 (명단은 별칭으로만, 팀 내부 공개)</p><p className="text-white/75">{room.partner}</p></Section>
        <Section icon="🗓️" title="타임라인과 작업"><ul className="space-y-1.5">{room.tasks.map((t) => <li key={t.title} className="flex items-center gap-2"><span aria-hidden>{t.done ? "✅" : task === t.title ? "🙋" : "⬜"}</span><span className={t.done ? "text-white/65 line-through" : ""}>{t.date} {t.title}</span><span className="ml-auto text-xs text-white/70">{task === t.title ? "나" : t.owner}</span></li>)}</ul></Section>
        <Section icon="📝" title="회의 요약 및 결정">{room.decisions.map((d) => <p key={d}>{d}</p>)}<p className="text-amber-200">소수 의견: {room.minority}</p></Section>
        <Section icon="🧰" title="투입 자원"><p>{room.resources}</p><p className="font-bold">모금 없음</p></Section>
        <Section icon="⚠️" title="위험 / 이해충돌 공개">{room.risks.map((r) => <p key={r}>{r}</p>)}</Section>
        <Section icon="📎" title="참고 자료와 출처"><p>{room.sources}</p></Section>
        <Section icon="➡️" title="다음 행동과 완료 기준"><p>{room.next}</p></Section>
      </div>
      {finished ? <Link href={`/results/${issue.id}`} className="mt-5 block rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 py-4 text-center font-black text-black">📊 결과 공개 보기</Link>
        : !loaded ? <div className="mt-5 h-14 animate-pulse rounded-2xl bg-white/5" /> : open && (
        <button onClick={() => (!authenticated ? login() : setTask(task ? null : open.title))} aria-pressed={!!task} className={`mt-5 w-full rounded-2xl py-4 font-black ${task ? "bg-mint text-black" : "bg-gradient-to-r from-amber-300 to-amber-500 text-black"}`}>{task ? `✅ ‘${task}’ 맡았어요 · 다시 누르면 내려놓기` : authenticated ? `🙋 ‘${open.title}’ 맡기` : "카카오로 시작하고 작업 맡기"}</button>)}
    </div>
  );
}
