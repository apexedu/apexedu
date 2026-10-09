import Section from "./Section";
import { Icon } from "./icons";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export default function About({ name }: { name: string }) {
  return (
    <Section id="about" title={`${name} haqida`} eyebrow="Biz haqimizda" backdrop={1}>
      <div className="grid items-center gap-9 sm:gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:space-y-5 sm:text-lg">
          <p data-reveal>
            Biz tilni yodlash emas, <strong className="text-brand-900">ishlatish</strong> orqali o'rgatamiz. Har bir guruh darajasiga mos dastur bilan ishlaydi,
            shuning uchun talaba o'z tezligida va tushunib oldinga siljiydi.
          </p>
          <p data-reveal style={{ ["--d" as string]: "120ms" }}>
            Darslar kichik guruhlarda o'tadi. O'qituvchi har bir talabaning xatosini ko'radi va darhol to'g'rilaydi.
            Maqsad — sertifikat olish, o'qish yoki ishlash uchun tilni haqiqatan ham bilish.
          </p>
          <a data-reveal style={{ ["--d" as string]: "240ms" }} href="#courses" className="group inline-flex items-center gap-2 font-bold text-brand-600">
            Kurslar bilan tanishing <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </a>
        </div>

        {/* Daraja zinapoyasi: balandlikka o'sib chiqadi (logotipdagi o'sish strelkasi g'oyasi) */}
        <div data-reveal="zoom" className="relative rounded-3xl border border-brand-600/10 bg-gradient-to-br from-brand-50 to-white p-5 shadow-[0_30px_60px_-30px_rgba(11,93,122,0.35)] sm:p-8" aria-hidden="true">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 sm:mb-6 sm:text-sm"><Icon name="trend" className="h-4 w-4" /> Noldan yuqori darajagacha</p>
          <div className="flex h-44 items-end gap-2 sm:h-60 sm:gap-3">
            {LEVELS.map((l, i) => (
              <div key={l} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className="step-bar flex items-start justify-center rounded-t-2xl bg-gradient-to-t from-brand-600 to-sky pt-2.5 text-xs font-extrabold text-white shadow-lg sm:pt-3 sm:text-sm"
                  style={{ height: `${28 + i * 18}%`, ["--d" as string]: `${300 + i * 140}ms`, filter: `saturate(${0.8 + i * 0.1})` }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -right-2 -top-3 flex h-12 w-12 sm:-right-3 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-saffron text-brand-900 shadow-xl bob">
            <Icon name="cap" className="h-7 w-7" />
          </div>
        </div>
      </div>
    </Section>
  );
}
