import Section from "./Section";
import { Icon, type IconName } from "./icons";
import type { Advantage } from "../types";

const ICONS: IconName[] = ["users", "trend", "mic", "gift", "sparkle", "globe"];

export default function Advantages({ items }: { items: Advantage[] }) {
  return (
    <Section id="why" title="Nega ApexEdu" eyebrow="Afzalliklar" tone="tint" prev="light" wave="curve" subtitle="Natija beradigan o'qishning to'rtta asosiy sababi.">
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {items.map((a, i) => (
          <div key={a.id} data-reveal style={{ ["--d" as string]: `${i * 110}ms` }}>
            <div className="hover-lift group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-brand-600/30 hover:shadow-2xl sm:rounded-3xl sm:p-6">
              <span className="pointer-events-none absolute -right-2 -top-3 select-none text-6xl font-extrabold text-brand-600/[0.06] transition-transform duration-500 group-hover:scale-125 sm:-top-4 sm:text-8xl" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-2xl">
                <Icon name={ICONS[i % ICONS.length]} className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              <h3 className="relative mt-3 text-[0.95rem] font-bold leading-snug sm:mt-5 sm:text-lg">{a.title}</h3>
              <p className="relative mt-1 text-[0.82rem] leading-snug text-slate-600 sm:mt-2 sm:text-base sm:leading-normal">{a.text}</p>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-saffron to-sky transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
