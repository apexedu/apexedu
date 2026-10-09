import { useCallback, useEffect, useRef, useState } from "react";
import Section from "./Section";
import { Icon } from "./icons";
import type { Testimonial } from "../types";

const AUTO_MS = 6000;

// Natijalar kartalari karusel ko'rinishida: telefonda 1 ta, planshet/kompyuterda 2 ta karta ko'rinadi.
// Fikrlar ko'payganda sahifa uzayib ketmaydi — kartalar o'zi almashadi, barmoq bilan surish ham mumkin.
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const n = items.length;
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);
  const [paused, setPaused] = useState(false);

  // Nechta karta ko'rinayotganini o'lchaydi
  const measure = useCallback(() => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setPerView(Math.max(1, Math.round(el.clientWidth / first.offsetWidth)));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, n]);

  const positions = Math.max(1, n - perView + 1);

  const stepPx = () => {
    const el = track.current;
    const a = el?.children[0] as HTMLElement | undefined;
    const b = el?.children[1] as HTMLElement | undefined;
    if (!a) return 0;
    return b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
  };

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const k = Math.min(Math.max(i, 0), positions - 1);
    el.scrollTo({ left: k * stepPx(), behavior: "smooth" });
  }, [positions]);

  // Surilganda joriy kartani yangilaydi
  const raf = useRef(0);
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = track.current;
      const s = stepPx();
      if (!el || !s) return;
      setActive(Math.min(positions - 1, Math.max(0, Math.round(el.scrollLeft / s))));
    });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Avtomatik almashish (sichqoncha/barmoq tegsa yoki "harakatni kamaytirish" yoqilgan bo'lsa to'xtaydi)
  useEffect(() => {
    if (positions < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => goTo(active + 1 >= positions ? 0 : active + 1), AUTO_MS);
    return () => clearInterval(t);
  }, [positions, paused, active, goTo]);

  const arrow = "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:border-saffron hover:bg-saffron hover:text-brand-900 disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:bg-white/10 disabled:hover:text-white";

  return (
    <Section id="results" title="Talabalar natijalari" eyebrow="Natijalar" tone="dark" prev="light" wave="curve" backdrop={3} subtitle="Bizda o'qib, maqsadiga erishganlar.">
      <div
        data-reveal
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 4000)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          ref={track}
          onScroll={onScroll}
          className={`snap-row ${n > 1 ? "two" : ""} py-2`}
          role="region"
          aria-roledescription="karusel"
          aria-label="Talabalar natijalari"
          tabIndex={0}
        >
          {items.map((t, i) => (
            <figure
              key={t.id}
              aria-label={`${i + 1} / ${n}`}
              className="relative flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-7"
            >
              <Icon name="quote" className="absolute right-4 top-4 h-10 w-10 text-white/10 sm:right-5 sm:top-5 sm:h-12 sm:w-12" />
              <span className="inline-flex w-fit max-w-[85%] items-center gap-1.5 rounded-full bg-saffron px-3 py-1 text-[0.8rem] font-bold text-brand-900 sm:text-sm">
                <Icon name="check" className="h-4 w-4 shrink-0" /> <span className="truncate">{t.result}</span>
              </span>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg">{t.text}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-leaf text-lg font-extrabold sm:h-11 sm:w-11">{t.name.charAt(0)}</span>
                <span className="font-bold">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {positions > 1 && (
          <div className="mt-4 flex items-center justify-between gap-4 sm:mt-6">
            <p className="min-w-[4.5rem] text-sm font-semibold tabular-nums text-white/70" aria-live="polite">
              <span className="text-white">{String(active + 1).padStart(2, "0")}</span> / {String(positions).padStart(2, "0")}
            </p>
            {positions <= 8 && (
              <div className="flex gap-2" aria-hidden="true">
                {Array.from({ length: positions }, (_, i) => (
                  <button key={i} tabIndex={-1} onClick={() => goTo(i)} className={`relative h-2 rounded-full transition-all duration-300 before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] ${i === active ? "w-8 bg-saffron" : "w-2 bg-white/35"}`} />
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button className={arrow} onClick={() => goTo(active - 1 < 0 ? positions - 1 : active - 1)} aria-label="Oldingi natija"><Icon name="chevleft" className="h-5 w-5" /></button>
              <button className={arrow} onClick={() => goTo(active + 1 >= positions ? 0 : active + 1)} aria-label="Keyingi natija"><Icon name="right" className="h-5 w-5" /></button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
