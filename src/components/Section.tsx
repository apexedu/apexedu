import type { ReactNode } from "react";

interface Props { id: string; title: string; subtitle?: string; muted?: boolean; children: ReactNode }

export default function Section({ id, title, subtitle, muted, children }: Props) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${muted ? "bg-mist" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
