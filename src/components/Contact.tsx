import Section from "./Section";
import { Icon, type IconName } from "./icons";
import { telHref } from "../lib/contact";
import type { Settings } from "../types";

function Card({ icon, title, children, i }: { icon: IconName; title: string; children: React.ReactNode; i: number }) {
  return (
    <div data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
      <div className="hover-lift group h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-600/30 hover:shadow-2xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-all duration-500 group-hover:rotate-6 group-hover:bg-brand-600 group-hover:text-white">
          <Icon name={icon} className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="mt-1 text-lg font-bold">{children}</div>
      </div>
    </div>
  );
}

export default function Contact({ settings: s }: { settings: Settings }) {
  const socials = ([["Instagram", s.instagram], ["Facebook", s.facebook], ["YouTube", s.youtube]] as [string, string][]).filter(([, u]) => u);
  let i = 0;
  return (
    <Section id="contact" title="Aloqa" eyebrow="Bog'laning" tone="tint" prev="dark" wave="curve" backdrop={8} subtitle={`${s.academyName} bilan bog'lanish uchun qulay usulni tanlang.`}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card i={i++} icon="phone" title="Telefon">
          {s.phones.map((p, k) => <a key={`${p}-${k}`} href={telHref(p)} className="block transition hover:text-brand-600">{p}</a>)}
        </Card>
        <Card i={i++} icon="send" title="Telegram">
          <a href={`https://t.me/${s.telegram}`} target="_blank" rel="noreferrer" className="transition hover:text-brand-600">@{s.telegram}</a>
        </Card>
        <Card i={i++} icon="pin" title="Manzil">
          <p>{s.address}</p>
          <a href={s.mapUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-brand-600 hover:underline">Xaritada ochish <Icon name="arrow" className="h-4 w-4" /></a>
        </Card>
        <Card i={i++} icon="clock" title="Ish vaqti">{s.workingHours}</Card>
        {socials.length > 0 && (
          <Card i={i++} icon="link" title="Ijtimoiy tarmoqlar">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="transition hover:text-brand-600">{n}</a>)}
            </div>
          </Card>
        )}
        <div data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
          <a href="#apply" className="btn-shine group flex h-full min-h-40 flex-col justify-between rounded-3xl bg-[linear-gradient(135deg,#07323f,#0b5d7a)] p-6 text-white shadow-xl transition hover:-translate-y-1.5 hover:shadow-2xl">
            <Icon name="sparkle" className="h-8 w-8 text-saffron" />
            <span className="mt-6 flex items-center justify-between gap-3 text-xl font-extrabold">Bepul konsultatsiya <Icon name="arrow" className="h-6 w-6 text-saffron transition-transform group-hover:translate-x-1.5" /></span>
          </a>
        </div>
      </div>
    </Section>
  );
}
