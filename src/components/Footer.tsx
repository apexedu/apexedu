import Logo from "./Logo";
import { Icon } from "./icons";
import { telHref } from "../lib/contact";

const links = [
  { href: "#about", label: "Biz haqimizda" },
  { href: "#courses", label: "Kurslar" },
  { href: "#teachers", label: "O'qituvchilar" },
  { href: "#faq", label: "Savollar" },
  { href: "#contact", label: "Aloqa" },
];

export default function Footer({ name, phone }: { name: string; phone?: string }) {
  return (
    <footer className="relative overflow-hidden bg-night pb-28 pt-10 max-sm:mt-3 max-sm:rounded-t-3xl text-sm text-white/70 sm:pt-14 md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-saffron via-sky to-leaf" aria-hidden="true" />
      <p className="pointer-events-none absolute inset-x-0 bottom-10 select-none whitespace-nowrap text-center text-[18vw] font-extrabold leading-none tracking-tighter text-white/[0.04] md:bottom-4" aria-hidden="true">{name}</p>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="inline-block rounded-2xl bg-white px-4 py-2">
              <Logo name={name} className="h-16 w-auto sm:h-20" />
            </div>
            <p className="mt-3 text-xl font-extrabold tracking-tight text-white sm:mt-4 sm:text-2xl">{name}</p>
            <p className="mt-1 max-w-xs">Tilni yodlash emas, ishlatish orqali o'rgatamiz.</p>
          </div>
          <nav aria-label="Pastki menyu">
            <p className="mb-3 font-bold text-white">Bo'limlar</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:block sm:space-y-2">
              {links.map((l) => <li key={l.href}><a href={l.href} className="block py-1.5 transition hover:text-saffron sm:inline sm:py-0">{l.label}</a></li>)}
            </ul>
          </nav>
          <div>
            <p className="mb-3 font-bold text-white">Hoziroq boshlang</p>
            <div className="grid gap-3">
              {phone && <a href={telHref(phone)} className="inline-flex items-center gap-2 text-base font-bold text-white transition hover:text-saffron"><Icon name="phone" className="h-5 w-5" /> {phone}</a>}
              <a href="#apply" className="btn-shine inline-flex w-fit items-center gap-2 rounded-full bg-saffron px-5 py-2.5 font-bold text-brand-900">Kursga yozilish <Icon name="arrow" className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p>© {new Date().getFullYear()} {name}</p>
          <a href="#top" className="inline-flex items-center gap-1.5 transition hover:text-white">Tepaga qaytish <Icon name="arrow" className="h-4 w-4 -rotate-90" /></a>
        </div>
      </div>
    </footer>
  );
}
