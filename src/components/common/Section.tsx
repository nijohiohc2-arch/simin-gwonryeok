export function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-line bg-panel p-4 text-sm"><h2 className="text-base font-bold"><span aria-hidden>{icon}</span> {title}</h2><div className="mt-2 space-y-1 text-white/85">{children}</div></section>;
}
