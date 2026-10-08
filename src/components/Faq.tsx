import Section from "./Section";
import type { Faq as FaqItem } from "../types";

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Section id="faq" title="Ko'p so'raladigan savollar">
      <div className="max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
        {items.map((q) => (
          <details key={q.id} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {q.question}
              <span className="text-brand-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 text-slate-600">{q.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
