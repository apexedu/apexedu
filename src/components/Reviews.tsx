import { FormEvent, useEffect, useRef, useState } from "react";
import Section from "./Section";
import { Icon } from "./icons";
import { submitReview } from "../services/api";
import type { Review } from "../types";

type Status = "idle" | "sending" | "success" | "error";
const stars = (r: number) => "★".repeat(r) + "☆".repeat(5 - r);
const input = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (reviews.length < 2 || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  const current = reviews[i % Math.max(reviews.length, 1)];
  const go = (d: number) => setI((x) => (x + d + reviews.length) % reviews.length);

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
        <div
          data-reveal="left"
          className="touch-pan-y"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
          onTouchEnd={(e) => {
            if (touchX.current !== null && reviews.length > 1) {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }
            touchX.current = null;
            setPaused(false);
          }}
          aria-live="polite"
        >
          {current ? (
            <>
              <figure key={current.id} className="slide-up relative min-h-48 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:min-h-56 sm:p-7">
                <Icon name="quote" className="absolute right-4 top-4 h-11 w-11 text-brand-600/10 sm:right-5 sm:top-5 sm:h-14 sm:w-14" />
                <p className="relative text-lg tracking-wider text-amber-500 sm:text-xl" aria-label={`${current.rating} yulduz`}>{stars(current.rating)}</p>
                <blockquote className="relative mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">{current.text}</blockquote>
                <figcaption className="relative mt-5 flex items-center gap-3 font-bold"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky text-white">{current.name.charAt(0)}</span>{current.name}</figcaption>
              </figure>
              {reviews.length > 1 && (
                <div className="mt-4 flex items-center gap-2">
                  {reviews.map((r, idx) => (
                    <button key={r.id} onClick={() => setI(idx)} aria-label={`${idx + 1}-fikr`} className={`relative before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] h-2 rounded-full transition-all duration-500 ${idx === i ? "w-8 bg-saffron" : "w-2 bg-slate-300"}`} />
                  ))}
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
