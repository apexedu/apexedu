import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { telHref } from "../lib/contact";

// Foydalanuvchi qayerda bo'lmasin — qo'ng'iroq va ariza tugmasi doim ko'z oldida.
// Hero'da va ariza formasi ko'ringanda yashirinadi (ortiqcha bo'lmasligi uchun).
export default function FloatingCta({ phone }: { phone?: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const on = () => setPastHero(window.scrollY > 560);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const el = document.getElementById("apply");
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = pastHero && !atForm;
  const hide = show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0";

  return (
    <>
      {/* Kompyuter: o'ng pastdagi suzuvchi tugmalar */}
      <div className={`fixed bottom-6 right-6 z-30 hidden flex-col items-end gap-3 transition-all duration-500 md:flex ${hide}`}>
        <a href="#apply" className="btn-shine glow-saffron inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-brand-900 transition hover:scale-105">
          Bepul konsultatsiya <Icon name="arrow" className="h-4 w-4" />
        </a>
        {phone && (
          <a href={telHref(phone)} aria-label={`Qo'ng'iroq qilish: ${phone}`} className="group relative flex h-14 items-center gap-0 overflow-visible rounded-full bg-brand-600 pl-4 pr-4 text-white shadow-xl transition-all hover:bg-brand-700">
            <span className="pulse-ring text-brand-600" />
            <span className="pulse-ring d2 text-brand-600" />
            <Icon name="phone" className="ringing h-6 w-6" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[12rem] group-hover:opacity-100">{phone}</span>
          </a>
        )}
      </div>

      {/* Telefon: pastki doimiy panel */}
      <div className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_14px_40px_-8px_rgba(7,50,63,0.5)] backdrop-blur-xl transition-all duration-500 md:hidden ${hide}`}>
        <div className={`mx-auto grid max-w-md gap-3 ${phone ? "grid-cols-2" : "grid-cols-1"}`}>
          {phone && (
            <a href={telHref(phone)} className="press relative flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-2 py-3 text-[0.95rem] font-bold text-white">
              <Icon name="phone" className="ringing h-[1.1rem] w-[1.1rem]" /> Qo'ng'iroq qilish
            </a>
          )}
          <a href="#apply" className="press btn-shine flex min-h-12 items-center justify-center gap-2 rounded-xl bg-saffron px-2 py-3 text-[0.95rem] font-bold text-brand-900">
            Ariza qoldirish
          </a>
        </div>
      </div>
    </>
  );
}
