import Section from "./Section";
import type { Teacher } from "../types";

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

export default function Teachers({ teachers }: { teachers: Teacher[] }) {
  return (
    <Section id="teachers" title="O'qituvchilar">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => (
          <article key={t.id} className="flex gap-4">
            {t.photo ? (
              <img src={t.photo} alt={t.fullName} loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xl font-semibold text-brand-600" aria-hidden="true">{initials(t.fullName)}</div>
            )}
            <div>
              <h3 className="font-semibold">{t.fullName}</h3>
              <p className="text-sm font-medium text-brand-600">{t.position}</p>
              <p className="mt-1.5 text-sm text-slate-600">{t.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
