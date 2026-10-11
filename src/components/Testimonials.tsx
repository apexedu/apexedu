import { useCarousel } from "../hooks/useCarousel";
import Section from "./Section";
import { Icon } from "./icons";
import type { Testimonial } from "../types";

// Natijalar kartalari karusel ko'rinishida: telefonda 1 ta, planshet/kompyuterda 2 ta karta ko'rinadi.
// Fikrlar ko'payganda sahifa uzayib ketmaydi — kartalar o'zi almashadi, barmoq bilan surish ham mumkin.
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const n = items.length;
  const { track, active, positions, goTo, next, prev, onScroll, hold } = useCarousel(n, 6000);

  const arrow = "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:border-saffron hover:bg-saffron hover:text-brand-900 disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:bg-white/10 disabled:hover:text-white";

  return (
    <Section id="results" title="Talabalar natijalari" eyebrow="Natijalar" tone="dark" prev="light" wave="curve" backdrop={3} subtitle="Bizda o'qib, maqsadiga erishganlar.">
      <div data-reveal {...hold}>
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
              <button className={arrow} onClick={prev} aria-label="Oldingi natija"><Icon name="chevleft" className="h-5 w-5" /></button>
              <button className={arrow} onClick={next} aria-label="Keyingi natija"><Icon name="right" className="h-5 w-5" /></button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
