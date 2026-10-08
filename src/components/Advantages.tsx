import Section from "./Section";
import type { Advantage } from "../types";

export default function Advantages({ items }: { items: Advantage[] }) {
  return (
    <Section id="why" title="Nega ApexEdu">
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {items.map((a) => (
          <div key={a.id} className="border-l-2 border-brand-600 pl-4">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-1 text-slate-600">{a.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
