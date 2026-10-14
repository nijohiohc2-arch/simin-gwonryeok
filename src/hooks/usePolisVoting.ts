"use client";
// MOCK: 카드 응답을 이 브라우저(localStorage)에만 저장. Polis 엔진 미연동.
import { useLocal } from "./useLocal";
export type Vote = "agree" | "disagree" | "pass";
export function usePolisVoting(issueId: string) {
  const [votes, setVotes, loaded] = useLocal<Record<number, Vote>>(`cos.votes.${issueId}`, {});
  const [mine, setMine] = useLocal<string[]>(`cos.mine.${issueId}`, []);
  return { votes, loaded, vote: (id: number, v: Vote) => setVotes({ ...votes, [id]: v }), reset: () => setVotes({}), myStatements: mine, submit: (t: string) => setMine([...mine, t]) };
}
