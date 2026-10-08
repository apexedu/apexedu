import { useCallback, useEffect, useRef, useState } from "react";
import Section from "./Section";
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

  const arrow = "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-brand-50 disabled:opacity-40";

  return (
    <Section id="courses" title="Kurslar va guruhlar" subtitle="Avval kursni, so'ng o'zingizga mos darajadagi guruhni tanlang." muted>
      {(canPrev || canNext) && (
        <div className="mb-4 flex justify-end gap-2">
          <button className={arrow} onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Oldingi kurslar">Oldingi</button>
          <button className={arrow} onClick={() => scroll(1)} disabled={!canNext} aria-label="Keyingi kurslar">Keyingi</button>
        </div>
      )}
      <div
        ref={ref}
        onScroll={update}
        tabIndex={0}
        aria-label="Kurslar ro'yxati"
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {courses.map((c) => (
          <article key={c.id} className="w-[88%] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-6 sm:w-[440px]">
            <h3 className="text-xl font-semibold">{c.name}</h3>
            <p className="mt-2 text-slate-600">{c.description}</p>
            <ul className="mt-5 divide-y divide-slate-100">
              {groups.filter((g) => g.courseId === c.id).map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">{g.name}</p>
                    <p className="text-sm text-slate-600">{g.description}</p>
                    <p className="text-sm text-slate-500">{g.schedule}</p>
                  </div>
                  <button onClick={() => onApply(c.id, g.id)} className="shrink-0 rounded-lg border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50">Yozilish</button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
