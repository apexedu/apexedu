import Section from "./Section";
import { Icon, type IconName } from "./icons";
import { telHref } from "../lib/contact";
import type { Settings } from "../types";

function Card({ icon, title, children, i }: { icon: IconName; title: string; children: React.ReactNode; i: number }) {
  return (
    <div data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
      <div className="hover-lift group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand-600/30 hover:shadow-2xl max-sm:flex max-sm:items-center max-sm:gap-4 sm:rounded-3xl sm:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-all duration-500 sm:h-12 sm:w-12 sm:rounded-2xl group-hover:rotate-6 group-hover:bg-brand-600 group-hover:text-white">
          <Icon name={icon} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mt-4 sm:text-sm">{title}</p>
          <div className="mt-0.5 break-words text-base font-bold sm:mt-1 sm:text-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Contact({ settings: s }: { settings: Settings }) {
  const socials = ([["Instagram", s.instagram], ["Facebook", s.facebook], ["YouTube", s.youtube]] as [string, string][]).filter(([, u]) => u);
  let i = 0;
  return (
    <Section id="contact" title="Aloqa" eyebrow="Bog'laning" tone="tint" prev="dark" wave="curve" backdrop={8} subtitle={`${s.academyName} bilan bog'lanish uchun qulay usulni tanlang.`}>
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <Card i={i++} icon="phone" title="Telefon">
          {s.phones.map((p, k) => <a key={`${p}-${k}`} href={telHref(p)} className="block py-1 transition hover:text-brand-600 sm:py-0">{p}</a>)}
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
          <a href="#apply" className="btn-shine group flex h-full min-h-32 flex-col justify-between rounded-2xl bg-[linear-gradient(135deg,#07323f,#0b5d7a)] p-5 sm:min-h-40 sm:rounded-3xl sm:p-6 text-white shadow-xl transition hover:-translate-y-1.5 hover:shadow-2xl">
            <Icon name="sparkle" className="h-8 w-8 text-saffron" />
            <span className="mt-4 flex items-center justify-between gap-3 text-lg font-extrabold sm:mt-6 sm:text-xl">Bepul konsultatsiya <Icon name="arrow" className="h-6 w-6 text-saffron transition-transform group-hover:translate-x-1.5" /></span>
          </a>
        </div>
      </div>
    </Section>
  );
}
