import Section from "./Section";
import type { Testimonial } from "../types";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section id="results" title="Talabalar natijalari" muted>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <blockquote className="text-slate-700">{t.text}</blockquote>
            <figcaption className="mt-4 text-sm"><span className="font-semibold">{t.name}</span> — {t.result}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
