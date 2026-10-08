import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "#about", label: "Biz haqimizda" },
  { href: "#courses", label: "Kurslar" },
  { href: "#teachers", label: "O'qituvchilar" },
  { href: "#reviews", label: "Fikrlar" },
  { href: "#faq", label: "Savollar" },
  { href: "#contact", label: "Aloqa" },
];

export default function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label={name}><Logo name={name} /></a>
        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Asosiy menyu">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-slate-600 hover:text-brand-600">{l.label}</a>
          ))}
          <a href="#apply" className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">Kursga yozilish</a>
        </nav>
        <button
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? "Yopish" : "Menyu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden" aria-label="Mobil menyu">
          {[...links, { href: "#apply", label: "Kursga yozilish" }].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-slate-700">{l.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
