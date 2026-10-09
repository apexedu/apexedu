import Section from "./Section";
import { Icon, type IconName } from "./icons";
import type { Advantage } from "../types";

const ICONS: IconName[] = ["users", "trend", "mic", "gift", "sparkle", "globe"];

export default function Advantages({ items }: { items: Advantage[] }) {
  return (
    <Section id="why" title="Nega ApexEdu" eyebrow="Afzalliklar" tone="tint" prev="light" wave="curve" subtitle="Natija beradigan o'qishning to'rtta asosiy sababi.">
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {items.map((a, i) => (
          <div key={a.id} data-reveal style={{ ["--d" as string]: `${i * 110}ms` }}>
            <div className="hover-lift group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-brand-600/30 hover:shadow-2xl sm:block sm:rounded-3xl sm:p-6">
              <span className="pointer-events-none absolute -right-2 -top-3 select-none text-6xl sm:-top-4 sm:text-8xl font-extrabold text-brand-600/[0.06] transition-transform duration-500 group-hover:scale-125" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <Icon name={ICONS[i % ICONS.length]} className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              <div className="relative min-w-0 sm:contents">
                <h3 className="text-base font-bold sm:relative sm:mt-5 sm:text-lg">{a.title}</h3>
                <p className="mt-1 text-[0.92rem] leading-snug text-slate-600 sm:relative sm:mt-2 sm:text-base sm:leading-normal">{a.text}</p>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-saffron to-sky transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
