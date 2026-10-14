export function ExampleBadge({ className = "" }: { className?: string }) {
  return <span className={`inline-flex items-center rounded-full border border-amber-300/70 bg-black/40 px-2 py-0.5 text-[10px] font-bold text-amber-200 ${className}`}>예시</span>;
}
