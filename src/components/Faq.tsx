import { useState } from "react";
import Section from "./Section";
import { Icon } from "./icons";
import { telHref } from "../lib/contact";
import type { Faq as FaqItem } from "../types";

export default function Faq({ items, phone }: { items: FaqItem[]; phone?: string }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <Section id="faq" title="Ko'p so'raladigan savollar" eyebrow="Savol-javob" tone="light" prev="tint" wave="curve" backdrop={6}>
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-3" data-reveal>
          {items.map((q) => {
            const isOpen = open === q.id;
            return (
              <div key={q.id} className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? "border-brand-600/40 bg-white shadow-lg" : "border-slate-200 bg-white/80 hover:border-brand-600/30"}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${q.id}`}
                    onClick={() => setOpen(isOpen ? null : q.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-bold"
                  >
                    {q.question}
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "rotate-180 bg-saffron text-brand-900" : "bg-brand-50 text-brand-600"}`}>
                      <Icon name="chevron" className="h-5 w-5" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-${q.id}`} role="region" className="acc" data-open={isOpen}>
                  <div><p className="px-5 pb-5 text-slate-600">{q.answer}</p></div>
                </div>
              </div>
            );
          })}
        </div>

        <aside data-reveal="right" className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#07323f,#0b5d7a)] p-7 text-white shadow-2xl lg:sticky lg:top-28">
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" aria-hidden="true" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron text-brand-900"><Icon name="chat" className="h-7 w-7" /></span>
          <h3 className="relative mt-5 text-2xl font-extrabold">Savolingiz qoldimi?</h3>
          <p className="relative mt-2 text-white/75">Biz bilan bog'laning — barcha savollarga bepul javob beramiz.</p>
          <div className="relative mt-6 grid gap-3">
            {phone && (
              <a href={telHref(phone)} className="btn-shine flex items-center justify-center gap-2 rounded-xl bg-saffron py-3.5 font-extrabold text-brand-900"><Icon name="phone" className="h-5 w-5" /> Qo'ng'iroq qilish</a>
            )}
            <a href="#apply" className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 py-3 font-bold transition hover:bg-white hover:text-brand-900">Ariza qoldirish</a>
          </div>
        </aside>
      </div>
    </Section>
  );
}
