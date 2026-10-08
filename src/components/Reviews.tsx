import { FormEvent, useEffect, useState } from "react";
import Section from "./Section";
import { submitReview } from "../services/api";
import type { Review } from "../types";

type Status = "idle" | "sending" | "success" | "error";
const stars = (r: number) => "★".repeat(r) + "☆".repeat(5 - r);
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-600";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (reviews.length < 2 || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  const current = reviews[i % Math.max(reviews.length, 1)];

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
    <Section id="reviews" title="Fikrlar" subtitle="Talabalarimiz fikrlarini o'qing va o'z fikringizni qoldiring." muted>
      <div className="grid gap-10 lg:grid-cols-2">
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-live="polite">
          {current ? (
            <>
              <figure key={current.id} className="animate-fade-up min-h-48 rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-lg text-amber-500" aria-label={`${current.rating} yulduz`}>{stars(current.rating)}</p>
                <blockquote className="mt-3 text-slate-700">{current.text}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{current.name}</figcaption>
              </figure>
              {reviews.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {reviews.map((r, idx) => (
                    <button key={r.id} onClick={() => setI(idx)} aria-label={`${idx + 1}-fikr`} className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-brand-600" : "w-2 bg-slate-300"}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-600">Hozircha fikrlar yo'q. Birinchi bo'lib fikr qoldiring.</p>
          )}
        </div>

        {status === "success" ? (
          <div role="status" className="self-start rounded-2xl bg-brand-50 p-6 text-brand-900">
            Fikringiz uchun rahmat! U tekshiruvdan so'ng saytda ko'rinadi.
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-4">
            <label className="block text-sm font-medium">
              <span className="mb-1.5 block">Ismingiz</span>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
              {errors.name && <span role="alert" className="mt-1 block text-red-700">{errors.name}</span>}
            </label>
            <div className="text-sm font-medium">
              <span className="mb-1.5 block">Baho</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" aria-label={`${n} yulduz`} aria-pressed={rating === n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? "text-amber-500" : "text-slate-300"}`}>★</button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-medium">
              <span className="mb-1.5 block">Fikringiz</span>
              <textarea className={input} rows={4} value={text} onChange={(e) => setText(e.target.value)} maxLength={500} />
              {errors.text && <span role="alert" className="mt-1 block text-red-700">{errors.text}</span>}
            </label>
            {status === "error" && <p role="alert" className="text-sm text-red-700">Fikrni yuborib bo'lmadi. Birozdan so'ng qayta urinib ko'ring.</p>}
            <button type="submit" disabled={status === "sending"} className="w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:justify-self-start">
              {status === "sending" ? "Yuborilmoqda..." : status === "error" ? "Qayta yuborish" : "Fikr yuborish"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
