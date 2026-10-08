import Section from "./Section";
import type { Course, Group } from "../types";

interface Props { courses: Course[]; groups: Group[]; onApply: (courseId: string, groupId?: string) => void }

export default function Courses({ courses, groups, onApply }: Props) {
  return (
    <Section id="courses" title="Kurslar va guruhlar" subtitle="Avval kursni, so'ng o'zingizga mos darajadagi guruhni tanlang." muted>
      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((c) => (
          <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6">
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
