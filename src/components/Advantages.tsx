import Section from "./Section";
import { Icon, type IconName } from "./icons";
import type { Advantage } from "../types";

const ICONS: IconName[] = ["users", "trend", "mic", "gift", "sparkle", "globe"];

export default function Advantages({ items }: { items: Advantage[] }) {
  return (
    <Section id="why" title="Nega ApexEdu" eyebrow="Afzalliklar" tone="tint" prev="light" wave="curve" subtitle="Natija beradigan o'qishning to'rtta asosiy sababi.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a, i) => (
          <div key={a.id} data-reveal style={{ ["--d" as string]: `${i * 110}ms` }}>
            <div className="hover-lift group relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-brand-600/30 hover:shadow-2xl">
              <span className="pointer-events-none absolute -right-2 -top-4 select-none text-8xl font-extrabold text-brand-600/[0.06] transition-transform duration-500 group-hover:scale-125" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <Icon name={ICONS[i % ICONS.length]} className="h-7 w-7" />
              </span>
              <h3 className="relative mt-5 text-lg font-bold">{a.title}</h3>
              <p className="relative mt-2 text-slate-600">{a.text}</p>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-saffron to-sky transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
