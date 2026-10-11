import { FormEvent, useState } from "react";
import { useCarousel } from "../hooks/useCarousel";
import Section from "./Section";
import { Icon } from "./icons";
import { submitReview } from "../services/api";
import type { Review } from "../types";

type Status = "idle" | "sending" | "success" | "error";
const stars = (r: number) => "★".repeat(r) + "☆".repeat(5 - r);
const input = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const n = reviews.length;
  const { track, active, positions, goTo, next, prev, onScroll, hold } = useCarousel(n, 5000);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Ismingizni kiriting";
    if (text.trim().length < 10) e.text = "Fikringizni kamida 10 ta belgi bilan yozing";
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      await submitReview({ name: name.trim(), text: text.trim(), rating });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="reviews" title="Fikrlar" eyebrow="Sharhlar" tone="tint" prev="dark" wave="tilt" subtitle="Talabalarimiz fikrlarini o'qing va o'z fikringizni qoldiring.">
      <div className="grid gap-7 sm:gap-10 lg:grid-cols-2 lg:items-start">
        <div data-reveal="left" className="min-w-0" {...hold}>
          {n > 0 ? (
            <>
              <div ref={track} onScroll={onScroll} className="snap-row pb-6 pt-2" role="region" aria-roledescription="karusel" aria-label="Fikrlar" tabIndex={0}>
                {reviews.map((r, idx) => (
                  <figure key={r.id} aria-label={`${idx + 1} / ${n}`} className="relative flex min-h-48 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:min-h-56 sm:p-7">
                    <Icon name="quote" className="absolute right-4 top-4 h-11 w-11 text-brand-600/10 sm:right-5 sm:top-5 sm:h-14 sm:w-14" />
                    <p className="relative text-lg tracking-wider text-amber-500 sm:text-xl" aria-label={`${r.rating} yulduz`}>{stars(r.rating)}</p>
                    <blockquote className="relative mt-3 flex-1 text-base leading-relaxed text-slate-700 sm:text-lg">{r.text}</blockquote>
                    <figcaption className="relative mt-5 flex items-center gap-3 font-bold"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky text-white">{r.name.charAt(0)}</span>{r.name}</figcaption>
                  </figure>
                ))}
              </div>
              {positions > 1 && (
                <div className="-mt-2 flex items-center justify-between gap-3">
                  <p className="min-w-[4.5rem] text-sm font-semibold tabular-nums text-slate-500" aria-live="polite">
                    <span className="text-brand-900">{String(active + 1).padStart(2, "0")}</span> / {String(positions).padStart(2, "0")}
                  </p>
                  {positions <= 8 && (
                    <div className="flex gap-2" aria-hidden="true">
                      {Array.from({ length: positions }, (_, idx) => (
                        <button key={idx} tabIndex={-1} onClick={() => goTo(idx)} className={`relative h-2 rounded-full transition-all duration-300 before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] ${idx === active ? "w-8 bg-saffron" : "w-2 bg-slate-300"}`} />
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={prev} aria-label="Oldingi fikr" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"><Icon name="chevleft" className="h-5 w-5" /></button>
                    <button onClick={next} aria-label="Keyingi fikr" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"><Icon name="right" className="h-5 w-5" /></button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-600">Hozircha fikrlar yo'q. Birinchi bo'lib fikr qoldiring.</p>
          )}
        </div>

        {status === "success" ? (
          <div role="status" className="pop-in flex items-start gap-3 self-start rounded-3xl bg-white p-7 text-brand-900 shadow-xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf text-white"><Icon name="check" className="h-5 w-5" /></span>
            Fikringiz uchun rahmat! U tekshiruvdan so'ng saytda ko'rinadi.
          </div>
        ) : (
          <form data-reveal="right" onSubmit={onSubmit} noValidate className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <label className="block text-sm font-medium">
              <span className="mb-1.5 block">Ismingiz</span>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
              {errors.name && <span role="alert" className="mt-1 block text-red-700">{errors.name}</span>}
            </label>
            <div className="text-sm font-medium">
              <span className="mb-1.5 block">Baho</span>
              <div className="-ml-1.5 flex gap-0.5 sm:ml-0 sm:gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" aria-label={`${n} yulduz`} aria-pressed={rating === n} onClick={() => setRating(n)} className={`flex h-11 w-11 items-center justify-center text-3xl transition-transform hover:scale-125 sm:h-auto sm:w-auto ${n <= rating ? "text-amber-500" : "text-slate-300"}`}>★</button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-medium">
              <span className="mb-1.5 block">Fikringiz</span>
              <textarea className={input} rows={4} value={text} onChange={(e) => setText(e.target.value)} maxLength={500} />
              {errors.text && <span role="alert" className="mt-1 block text-red-700">{errors.text}</span>}
            </label>
            {status === "error" && <p role="alert" className="text-sm text-red-700">Fikrni yuborib bo'lmadi. Birozdan so'ng qayta urinib ko'ring.</p>}
            <button type="submit" disabled={status === "sending"} className="w-full rounded-xl bg-brand-600 px-7 py-3.5 font-bold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:justify-self-start">
              {status === "sending" ? "Yuborilmoqda..." : status === "error" ? "Qayta yuborish" : "Fikr yuborish"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
