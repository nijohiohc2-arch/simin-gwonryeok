export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-5 py-8" aria-busy="true" aria-label="불러오는 중">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white/10" />
      <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
      <div className="grid gap-3 md:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />)}</div>
    </div>
  );
}
