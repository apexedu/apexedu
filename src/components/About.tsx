import Section from "./Section";
import type { Advantage, Format, Testimonial } from "../types";

interface Props { name: string; formats: Format[]; advantages: Advantage[]; testimonials: Testimonial[] }

const h3 = "mb-5 mt-14 text-xl font-semibold tracking-tight";

export default function About({ name, formats, advantages, testimonials }: Props) {
  return (
    <Section id="about" title={`${name} haqida`}>
      <div className="grid gap-8 md:grid-cols-2">
        <p className="leading-relaxed text-slate-700">
          Biz tilni yodlash emas, ishlatish orqali o'rgatamiz. Har bir guruh darajasiga mos dastur bilan ishlaydi,
          shuning uchun talaba o'z tezligida va tushunib oldinga siljiydi.
        </p>
        <p className="leading-relaxed text-slate-700">
          Darslar kichik guruhlarda o'tadi. O'qituvchi har bir talabaning xatosini ko'radi va darhol to'g'rilaydi.
          Maqsad — sertifikat olish, o'qish yoki ishlash uchun tilni haqiqatan ham bilish.
        </p>
      </div>

      <h3 className={h3}>Nega ApexEdu</h3>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {advantages.map((a) => (
          <div key={a.id} className="border-l-2 border-brand-600 pl-4">
            <h4 className="font-semibold">{a.title}</h4>
            <p className="mt-1 text-slate-600">{a.text}</p>
          </div>
        ))}
      </div>

      <h3 className={h3}>Ta'lim formatlari</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {formats.map((f) => (
          <div key={f.id} className="rounded-2xl border border-slate-200 bg-mist p-6">
            <h4 className="text-lg font-semibold">{f.name}</h4>
            <p className="mt-2 text-slate-600">{f.description}</p>
          </div>
        ))}
      </div>

      <h3 className={h3}>Talabalar natijalari</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={t.id} className="rounded-2xl border border-slate-200 p-6">
            <blockquote className="text-slate-700">{t.text}</blockquote>
            <figcaption className="mt-4 text-sm"><span className="font-semibold">{t.name}</span> — {t.result}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
