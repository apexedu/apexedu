import { useEffect, useState } from "react";
import type { Course, Group, Settings } from "../types";

interface Props { settings: Settings; courses: Course[]; groups: Group[] }

const MAX_SHOWN = 5;

export default function Hero({ settings, courses, groups }: Props) {
  const slides = courses
    .map((c) => ({ course: c, groups: groups.filter((g) => g.courseId === c.id) }))
    .filter((s) => s.groups.length > 0);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const current = slides[i % Math.max(slides.length, 1)];
  const tallest = Math.min(MAX_SHOWN + 1, Math.max(0, ...slides.map((s) => s.groups.length)));

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
        {current && (
          <div
            className="rounded-2xl border border-white/15 bg-white/5 p-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ minHeight: tallest * 60 + 110 }}
          >
            <div key={current.course.id} className="animate-fade-up">
              <p className="text-sm text-white/70">{current.course.name}: daraja yo'li</p>
              <ol className="mt-4 space-y-3">
                {current.groups.slice(0, MAX_SHOWN).map((g, idx) => (
                  <li key={g.id} className="flex items-center gap-4 rounded-xl bg-white/10 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-900">{idx + 1}</span>
                    <span className="font-medium">{g.name}</span>
                  </li>
                ))}
              </ol>
              {current.groups.length > MAX_SHOWN && (
                <a href="#courses" className="mt-3 block text-sm text-white/70 hover:text-white">+{current.groups.length - MAX_SHOWN} ta guruh yana</a>
              )}
            </div>
            {slides.length > 1 && (
              <div className="mt-5 flex gap-2" role="tablist" aria-label="Kurslar">
                {slides.map((s, idx) => (
                  <button
                    key={s.course.id}
                    role="tab"
                    aria-selected={idx === i}
                    aria-label={s.course.name}
                    onClick={() => setI(idx)}
                    className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
