import type { ReactNode } from "react";
import EduBackdrop from "./EduBackdrop";

export type Tone = "light" | "tint" | "dark";

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: Tone;
  prev?: Tone;          // oldingi bo'lim rangi — to'lqinli ajratgich shu rangda chiziladi
  wave?: "curve" | "tilt";
  backdrop?: number;    // ta'limga oid fon animatsiyasi (har bir bo'lim uchun boshqa "seed")
  align?: "left" | "center";
  children: ReactNode;
}

const BG: Record<Tone, string> = {
  light: "bg-white text-ink",
  tint: "bg-mist text-ink",
  dark: "bg-[linear-gradient(180deg,#07323f_0%,#051a24_100%)] text-white",
};
const FILL: Record<Tone, string> = { light: "#ffffff", tint: "#f3f6f8", dark: "#051a24" };

export default function Section({ id, title, subtitle, eyebrow, tone = "light", prev, wave = "curve", backdrop, align = "left", children }: Props) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <section id={id} className={`relative ${BG[tone]} ${prev ? "pt-28 sm:pt-36" : "pt-20 sm:pt-28"} pb-20 sm:pb-28`}>
      {tone === "tint" && <div className="dots-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />}
      {dark && <div className="dots-pattern-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />}
      {backdrop !== undefined && <EduBackdrop tone={dark ? "dark" : "light"} seed={backdrop} />}

      {prev && (
        <svg className="pointer-events-none absolute inset-x-0 top-0 h-14 w-full sm:h-20" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          {wave === "curve"
            ? <path d="M0 0H1440V30C1130 86 760 84 0 18Z" fill={FILL[prev]} />
            : <path d="M0 0H1440V76L0 14Z" fill={FILL[prev]} />}
        </svg>
      )}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className={`mb-12 sm:mb-14 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
          {eyebrow && (
            <p className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "bg-white/10 text-saffron" : "bg-brand-50 text-brand-600"}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{title}</h2>
          <span className={`title-bar mt-4 block h-1.5 w-16 rounded-full bg-gradient-to-r from-saffron to-sky ${center ? "mx-auto" : ""}`} />
          {subtitle && <p className={`mt-5 text-base sm:text-lg ${dark ? "text-white/75" : "text-slate-600"}`}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
