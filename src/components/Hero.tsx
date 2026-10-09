import { useEffect, useRef, useState } from "react";
import type { Group, HeroCard, Settings } from "../types";
import EduBackdrop from "./EduBackdrop";
import { Icon } from "./icons";
import { useCountUp } from "../hooks/useReveal";
import { telHref } from "../lib/contact";

interface Props { settings: Settings; heroCards: HeroCard[]; groups: Group[]; phone?: string }

const MAX_SHOWN = 5;

function Stat({ value, label, go }: { value: string; label: string; go: boolean }) {
  const v = useCountUp(value, go);
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur-sm sm:px-5">
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-extrabold tabular-nums sm:text-3xl">{v}</dd>
      <p className="mt-0.5 text-xs text-white/70 sm:text-sm" aria-hidden="true">{label}</p>
    </div>
  );
}

export default function Hero({ settings, heroCards, groups, phone }: Props) {
  // Slaydlar admin paneldagi "Bosh sahifa kartasi" (HeroCards) dan keladi; guruhlar kursdan avtomatik olinadi
  const slides = heroCards
    .map((h) => ({ id: h.id, title: h.title, groups: groups.filter((g) => g.courseId === h.courseId) }))
    .filter((x) => x.groups.length > 0);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el || !("IntersectionObserver" in window)) { setStatsOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const current = slides[i % Math.max(slides.length, 1)];
  const tallest = Math.min(MAX_SHOWN + 1, Math.max(0, ...slides.map((s) => s.groups.length)));

  // Sarlavhaning oxirgi so'zi alohida bezatiladi
  const words = settings.heroTitle.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : "";
  const head = words.join(" ");

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#051a24_0%,#07323f_45%,#0b5d7a_100%)] pb-28 text-white sm:pb-36">
      {/* Fon: aurora + chiziqli to'r + ta'limga oid suzuvchi belgilar */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="aurora aurora-a -left-40 -top-40 h-[34rem] w-[34rem]" />
        <div className="aurora aurora-b -right-32 top-10 h-[30rem] w-[30rem]" />
        <div className="aurora aurora-c bottom-[-14rem] left-1/3 h-[32rem] w-[32rem]" />
        <div className="grid-lines absolute inset-0" />
        <EduBackdrop tone="dark" seed={0} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-4 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pt-24">
        <div>
          <p data-reveal className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron" />
            </span>
            Bepul konsultatsiya va daraja aniqlash
          </p>

          <h1 data-reveal style={{ ["--d" as string]: "100ms" }} className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            {head}{" "}
            {last && (
              <span className="relative inline-block bg-gradient-to-r from-saffron via-amber-200 to-saffron bg-clip-text text-transparent">
                {last}
                <svg className="absolute -bottom-2 left-0 h-3 w-full text-saffron" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 Q 25 0 50 7 T 100 7 T 150 7 T 198 6" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </h1>

          <p data-reveal style={{ ["--d" as string]: "200ms" }} className="mt-6 max-w-xl text-lg text-white/80 sm:text-xl">{settings.heroText}</p>

          <div data-reveal style={{ ["--d" as string]: "300ms" }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#apply" className="btn-shine glow-saffron group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl bg-saffron px-8 py-4 text-lg font-extrabold text-brand-900 transition hover:-translate-y-0.5 hover:brightness-105">
              Bepul konsultatsiya
              <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            {phone ? (
              <a href={telHref(phone)} className="group inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/5 px-6 py-3.5 text-lg font-bold backdrop-blur transition hover:border-white hover:bg-white hover:text-brand-900">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600">
                  <span className="pulse-ring text-white" />
                  <Icon name="phone" className="ringing h-4.5 w-4.5" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-xs font-medium opacity-70">Hoziroq qo'ng'iroq qiling</span>
                  <span className="block whitespace-nowrap">{phone}</span>
                </span>
              </a>
            ) : (
              <a href="#courses" className="inline-flex items-center justify-center rounded-2xl border-2 border-white/30 px-6 py-3.5 text-lg font-bold transition hover:bg-white/10">Kurslarni ko'rish</a>
            )}
          </div>

          <dl ref={statsRef} data-reveal style={{ ["--d" as string]: "420ms" }} className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {settings.stats.map((s) => <Stat key={s.label} value={s.value} label={s.label} go={statsOn} />)}
          </dl>
        </div>

        {current && (
          <div data-reveal="right" style={{ ["--d" as string]: "250ms" }} className="relative">
            {/* Kartani to'ldirib turuvchi suzuvchi belgilar */}
            <div className="bob absolute -left-4 -top-6 z-10 hidden rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-brand-900 shadow-xl sm:flex sm:items-center sm:gap-2" aria-hidden="true">
              <Icon name="cap" className="h-5 w-5 text-brand-600" /> A1 → C1
            </div>
            <div className="bob-2 absolute -bottom-5 -right-3 z-10 hidden rounded-2xl bg-saffron px-4 py-2.5 text-sm font-bold text-brand-900 shadow-xl sm:flex sm:items-center sm:gap-2" aria-hidden="true">
              <Icon name="sparkle" className="h-4 w-4" /> Kichik guruhlar
            </div>

            <div
              className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-7"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              style={{ minHeight: tallest * 64 + 130 }}
            >
              {slides.length > 1 && (
                <span key={`${current.id}-${i}`} className="slide-progress absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-saffron to-sky" style={{ animationPlayState: paused ? "paused" : "running" }} aria-hidden="true" />
              )}
              <div key={current.id} className="slide-up">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-saffron">
                  <Icon name="book" className="h-4 w-4" /> {current.title}
                </p>
                <ol className="mt-5 space-y-3">
                  {current.groups.slice(0, MAX_SHOWN).map((g, idx) => (
                    <li key={g.id} className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/20" style={{ animation: `slide-up .45s ease-out ${idx * 70}ms both` }}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-brand-900">{idx + 1}</span>
                      <span className="font-semibold">{g.name}</span>
                      <span className="ml-auto hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/15 sm:block" aria-hidden="true">
                        <span className="block h-full rounded-full bg-gradient-to-r from-sky to-saffron" style={{ width: `${((idx + 1) / Math.max(current.groups.length, 1)) * 100}%` }} />
                      </span>
                    </li>
                  ))}
                </ol>
                {current.groups.length > MAX_SHOWN && (
                  <a href="#courses" className="mt-3 block text-sm text-white/70 hover:text-white">+{current.groups.length - MAX_SHOWN} ta guruh yana</a>
                )}
              </div>
              {slides.length > 1 && (
                <div className="mt-6 flex gap-2" role="tablist" aria-label="Kurslar">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={idx === i}
                      aria-label={s.title}
                      onClick={() => setI(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-8 bg-saffron" : "w-2 bg-white/40 hover:bg-white/70"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
