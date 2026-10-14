export function ProgressBar({ value, max = 100, tone = "hot", thin }: { value: number; max?: number; tone?: "hot" | "mint" | "vio"; thin?: boolean }) {
  const p = Math.min(100, (value / max) * 100);
  const g = { hot: "from-hot to-vio", mint: "from-mint to-sky-400", vio: "from-vio to-fuchsia-500" }[tone];
  return (
    <div className={`w-full overflow-hidden rounded-full bg-white/10 ${thin ? "h-1.5" : "h-3"}`}>
      <div className={`h-full rounded-full bg-gradient-to-r ${g} transition-[width] duration-1000 ease-out shadow-[0_0_12px_rgba(255,46,99,.6)]`} style={{ width: `${p}%` }} />
    </div>
  );
}
