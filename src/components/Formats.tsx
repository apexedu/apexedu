import Section from "./Section";
import type { Format } from "../types";

export default function Formats({ formats }: { formats: Format[] }) {
  return (
    <Section id="formats" title="Ta'lim formatlari" subtitle="Dastur bir xil — o'zingizga qulay usulni tanlang." muted>
      <div className="grid gap-6 sm:grid-cols-2">
        {formats.map((f) => (
          <div key={f.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold">{f.name}</h3>
            <p className="mt-2 text-slate-600">{f.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
