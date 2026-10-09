import Section from "./Section";
import type { Settings } from "../types";

export default function Contact({ settings: s }: { settings: Settings }) {
  const socials = ([["Instagram", s.instagram], ["Facebook", s.facebook], ["YouTube", s.youtube]] as [string, string][]).filter(([, u]) => u);
  const rows: [string, React.ReactNode][] = [
    ["Telefon", s.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:text-brand-600">{p}</a>)],
    ["Telegram", <a href={`https://t.me/${s.telegram}`} className="hover:text-brand-600">@{s.telegram}</a>],
    ["Manzil", <>{s.address} <a href={s.mapUrl} target="_blank" rel="noreferrer" className="text-brand-600 underline">Xaritada ochish</a></>],
    ["Ish vaqti", s.workingHours],
    ...(socials.length
      ? ([["Ijtimoiy tarmoqlar", socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="mr-4 hover:text-brand-600">{n}</a>)]] as [string, React.ReactNode][])
      : []),
  ];
  return (
    <Section id="contact" title="Aloqa" muted>
      <dl className="grid max-w-2xl gap-5 sm:grid-cols-[120px_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-slate-500">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
