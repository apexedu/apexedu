import Section from "./Section";
import { Icon, type IconName } from "./icons";
import type { Format } from "../types";

// Nomga qarab ikonka: "online" bo'lsa noutbuk, aks holda bino
const iconFor = (name: string): IconName => (/online|onlayn|masofa/i.test(name) ? "laptop" : "building");

export default function Formats({ formats }: { formats: Format[] }) {
  return (
    <Section id="formats" title="Ta'lim formatlari" eyebrow="Format" tone="tint" prev="dark" wave="tilt" backdrop={2} subtitle="Dastur bir xil — o'zingizga qulay usulni tanlang.">
      <div className="grid gap-6 sm:grid-cols-2">
        {formats.map((f, i) => (
          <div key={f.id} data-reveal={i % 2 ? "right" : "left"}>
            <div className="hover-lift group relative flex h-full gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:border-brand-600/30 hover:shadow-2xl">
              <span className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-brand-50 transition-transform duration-700 group-hover:scale-[2.2]" aria-hidden="true" />
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-saffron shadow-lg transition-transform duration-500 group-hover:rotate-6">
                <Icon name={iconFor(f.name)} className="h-8 w-8" />
              </span>
              <div className="relative">
                <h3 className="text-xl font-extrabold">{f.name}</h3>
                <p className="mt-2 text-slate-600">{f.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
