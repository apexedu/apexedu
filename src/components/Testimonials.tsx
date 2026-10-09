import Section from "./Section";
import { Icon } from "./icons";
import type { Testimonial } from "../types";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section id="results" title="Talabalar natijalari" eyebrow="Natijalar" tone="dark" prev="light" wave="curve" backdrop={3} subtitle="Bizda o'qib, maqsadiga erishganlar.">
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((t, i) => (
          <figure key={t.id} data-reveal={i % 2 ? "right" : "left"} className="hover-lift relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-7 backdrop-blur-sm hover:border-saffron/50 hover:bg-white/10">
            <Icon name="quote" className="absolute right-5 top-5 h-12 w-12 text-white/10" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-3 py-1 text-sm font-bold text-brand-900">
              <Icon name="check" className="h-4 w-4" /> {t.result}
            </span>
            <blockquote className="mt-5 text-lg leading-relaxed text-white/90">{t.text}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky to-leaf text-lg font-extrabold">{t.name.charAt(0)}</span>
              <span className="font-bold">{t.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
