import { useCallback, useEffect, useRef, useState } from "react";
import Section from "./Section";
import { Icon } from "./icons";
import type { Course, Group } from "../types";

interface Props { courses: Course[]; groups: Group[]; onApply: (courseId: string, groupId?: string) => void }

export default function Courses({ courses, groups, onApply }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [courses, update]);

  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  const arrow = "flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:bg-white disabled:hover:text-slate-700";

  return (
    <Section id="courses" title="Kurslar va guruhlar" eyebrow="Kurslar" tone="light" prev="tint" wave="tilt" backdrop={4} subtitle="Avval kursni, so'ng o'zingizga mos darajadagi guruhni tanlang.">
      {(canPrev || canNext) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Yon tomonga suring →</p>
          <div className="flex gap-2">
            <button className={arrow} onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Oldingi kurslar"><Icon name="chevleft" className="h-5 w-5" /></button>
            <button className={arrow} onClick={() => scroll(1)} disabled={!canNext} aria-label="Keyingi kurslar"><Icon name="right" className="h-5 w-5" /></button>
          </div>
        </div>
      )}
      <div
        ref={ref}
        data-reveal
        onScroll={update}
        tabIndex={0}
        aria-label="Kurslar ro'yxati"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-10 pt-2 sm:-mx-6 sm:px-6"
      >
        {courses.map((c, ci) => (
          <article key={c.id} className="group flex w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-600/30 hover:shadow-2xl sm:w-[440px]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#07323f,#0b5d7a)] p-6 text-white">
              <span className="pointer-events-none absolute -right-6 -top-8 select-none text-[8rem] font-extrabold leading-none text-white/[0.08]" aria-hidden="true">{String(ci + 1).padStart(2, "0")}</span>
              <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-brand-900 shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"><Icon name="book" className="h-6 w-6" /></span>
              <h3 className="relative text-2xl font-extrabold">{c.name}</h3>
              <p className="relative mt-2 text-white/75">{c.description}</p>
            </div>
            <ul className="flex-1 divide-y divide-slate-100 px-6 py-2">
              {groups.filter((g) => g.courseId === c.id).map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-bold text-brand-900">{g.name}</p>
                    <p className="text-sm text-slate-600">{g.description}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500"><Icon name="clock" className="h-3.5 w-3.5" />{g.schedule}</p>
                  </div>
                  <button onClick={() => onApply(c.id, g.id)} className="group/b inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-brand-600 px-4 py-2 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white">
                    Yozilish <Icon name="arrow" className="h-4 w-4 transition-transform group-hover/b:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="p-6 pt-3">
              <button onClick={() => onApply(c.id)} className="btn-shine w-full rounded-2xl bg-saffron py-3.5 font-extrabold text-brand-900 transition hover:brightness-105">
                Bu kurs bo'yicha bepul konsultatsiya
              </button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
