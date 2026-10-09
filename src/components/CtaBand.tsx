import EduBackdrop from "./EduBackdrop";
import { Icon } from "./icons";
import { telHref } from "../lib/contact";

interface Props { name: string; phone?: string; prev?: "light" | "tint"; seed?: number }

// Sahifa o'rtasidagi "undovchi" blok: foydalanuvchi shu yerda qaror qabul qilib qo'ng'iroq qiladi yoki ariza qoldiradi
export default function CtaBand({ name, phone, seed = 3 }: Props) {
  return (
    <section id="call" className="relative overflow-hidden bg-[linear-gradient(180deg,#07323f_0%,#051a24_100%)] py-20 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="aurora aurora-a -left-40 top-[-12rem] h-[30rem] w-[30rem]" />
        <div className="aurora aurora-b -right-40 bottom-[-14rem] h-[30rem] w-[30rem]" />
        <div className="dots-pattern-dark absolute inset-0 opacity-60" />
        <EduBackdrop tone="dark" seed={seed} />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[auto_1fr]">
        <div data-reveal="zoom" className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full sm:h-44 sm:w-44" aria-hidden="true">
          <span className="pulse-ring text-saffron" />
          <span className="pulse-ring d2 text-saffron" />
          <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-saffron to-amber-300 text-brand-900 shadow-[0_20px_60px_-10px_rgba(240,163,10,0.7)]">
            <Icon name="phone" className="ringing h-16 w-16 sm:h-20 sm:w-20" />
          </span>
        </div>
        <div data-reveal style={{ ["--d" as string]: "120ms" }} className="text-center md:text-left">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-saffron">{name}</p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Qaysi daraja sizga mos? <span className="text-saffron">Bepul aniqlaymiz.</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75 md:mx-0">Qisqa suhbat — va siz o'zingizga mos guruhni bilib olasiz. Qo'ng'iroq qiling yoki ariza qoldiring, o'zimiz bog'lanamiz.</p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:justify-start">
            {phone && (
              <a href={telHref(phone)} className="btn-shine glow-saffron group inline-flex items-center justify-center gap-3 rounded-2xl bg-saffron px-8 py-4 text-lg font-extrabold text-brand-900 transition hover:-translate-y-0.5">
                <Icon name="phone" className="h-5 w-5" /> {phone}
              </a>
            )}
            <a href="#apply" className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/30 px-8 py-4 text-lg font-bold transition hover:border-white hover:bg-white hover:text-brand-900">
              Ariza qoldirish <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
