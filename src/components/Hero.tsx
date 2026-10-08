import type { Course, Group, Settings } from "../types";

interface Props { settings: Settings; course?: Course; groups: Group[] }

export default function Hero({ settings, course, groups }: Props) {
  return (
    <section id="top" className="bg-brand-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{settings.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{settings.heroText}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#apply" className="rounded-lg bg-saffron px-6 py-3 text-center font-semibold text-brand-900 hover:brightness-95">Bepul konsultatsiya</a>
            <a href="#courses" className="rounded-lg border border-white/30 px-6 py-3 text-center font-medium hover:bg-white/10">Kurslarni ko'rish</a>
          </div>
          <dl className="mt-10 flex gap-8">
            {settings.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold">{s.value}<span className="ml-1.5 text-sm font-normal text-white/70">{s.label}</span></dd>
              </div>
            ))}
          </dl>
        </div>
        {course && groups.length > 0 && (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <p className="text-sm text-white/70">{course.name}: daraja yo'li</p>
            <ol className="mt-4 space-y-3">
              {groups.map((g, i) => (
                <li key={g.id} className="flex items-center gap-4 rounded-xl bg-white/10 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-900">{i + 1}</span>
                  <span className="font-medium">{g.name}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
