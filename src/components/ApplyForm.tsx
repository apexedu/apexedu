import { FormEvent, useMemo, useState } from "react";
import Section from "./Section";
import { Icon } from "./icons";
import { telHref } from "../lib/contact";
import { ApiError, submitApplication } from "../services/api";
import type { Course, Format, Group } from "../types";

interface Props { courses: Course[]; groups: Group[]; formats: Format[]; presetCourse?: string; presetGroup?: string; callPhone?: string; telegram?: string; name: string }
type Status = "idle" | "sending" | "success" | "error";

// Telefon: foydalanuvchi faqat 9 ta raqam kiritadi (+998 oldindan yozilgan).
// Ko'rinishi: "50 777 37 38"; serverga: "+998507773738".
const normPhone = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("998")) d = d.slice(3); // to'liq raqam qo'yib yuborilsa
  return d.slice(0, 9);
};
const fmtPhone = (d: string) =>
  [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");

const field = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15 disabled:bg-slate-50 disabled:text-slate-400";

export default function ApplyForm({ courses, groups, formats, presetCourse = "", presetGroup = "", callPhone, telegram, name }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState(presetCourse);
  const [groupId, setGroupId] = useState(presetGroup);
  const [formatId, setFormatId] = useState("");
  const [age, setAge] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const courseGroups = useMemo(() => groups.filter((g) => g.courseId === courseId), [groups, courseId]);

  function validate() {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 3) e.fullName = "Ism va familiyangizni kiriting";
    if (phone.length !== 9) e.phone = "Telefon raqamni to'liq kiriting (9 ta raqam)";
    if (!courseId) e.courseId = "Kursni tanlang";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const q = new URLSearchParams(window.location.search);
    setStatus("sending");
    try {
      await submitApplication({
        fullName: fullName.trim(), phone: `+998${phone}`, courseId, groupId, formatId, age, comment,
        source: q.get("source") ?? "direct",
        utmSource: q.get("utm_source") ?? "", utmMedium: q.get("utm_medium") ?? "", utmCampaign: q.get("utm_campaign") ?? "",
      });
      setStatus("success");
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "network";
      setErrorMsg(
        code === "rate_limited"
          ? "Bu raqamdan ariza yaqinda yuborilgan. Bir daqiqadan so'ng qayta urinib ko'ring."
          : code.startsWith("invalid_")
          ? "Ma'lumotlarni tekshirib, qayta yuboring."
          : "Arizani yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring."
      );
      setStatus("error");
    }
  }

  return (
    <Section id="apply" title="Kursga yozilish" eyebrow="Ariza" tone="dark" prev="light" wave="tilt" backdrop={7} subtitle={`Ma'lumotlaringizni qoldiring — ${name} jamoasi tez orada siz bilan bog'lanadi.`}>
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-start">
        {/* Chap: nega hoziroq yozilish kerak + tezkor aloqa */}
        <div data-reveal="left" className="space-y-6 sm:space-y-7">
          <ul className="space-y-3 text-base sm:space-y-4 sm:text-lg">
            {["Darajangizni bepul aniqlaymiz", "Sizga mos guruhni birga tanlaymiz", "Offline yoki online — o'zingizga qulay formatda"].map((t, i) => (
              <li key={t} className="flex items-center gap-3 sm:gap-4" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron text-brand-900 sm:h-9 sm:w-9"><Icon name="check" className="h-4 w-4 sm:h-5 sm:w-5" /></span>
                {t}
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Kutishni xohlamaysizmi?</p>
            <div className="mt-4 grid gap-3">
              {callPhone && (
                <a href={telHref(callPhone)} className="btn-shine glow-saffron flex items-center justify-center gap-3 rounded-2xl bg-saffron px-5 py-3.5 text-base font-extrabold text-brand-900 transition hover:-translate-y-0.5 sm:py-4 sm:text-lg">
                  <Icon name="phone" className="ringing h-5 w-5" /> {callPhone}
                </a>
              )}
              {telegram && (
                <a href={`https://t.me/${telegram}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 rounded-2xl border-2 border-white/25 px-5 py-3.5 font-bold transition hover:bg-white hover:text-brand-900">
                  <Icon name="send" className="h-5 w-5" /> Telegramda yozing
                </a>
              )}
            </div>
          </div>
        </div>

        {status === "success" ? (
          <div role="status" data-reveal="right" className="pop-in rounded-3xl bg-white p-6 text-center text-brand-900 shadow-2xl sm:p-12">
            <svg viewBox="0 0 52 52" className="mx-auto h-20 w-20 sm:h-24 sm:w-24" aria-hidden="true">
              <circle className="check-circle" cx="26" cy="26" r="24" fill="none" stroke="#4f8a3c" strokeWidth="3" />
              <path className="check-mark" d="M15 27l8 8 14-16" fill="none" stroke="#4f8a3c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 text-xl font-extrabold sm:mt-5 sm:text-2xl">Arizangiz qabul qilindi!</p>
            <p className="mt-2 text-slate-600">Arizangiz muvaffaqiyatli yuborildi. {name} jamoasi tez orada siz bilan bog'lanadi.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate data-reveal="right" className="grid gap-4 rounded-3xl bg-white p-5 text-ink shadow-2xl sm:grid-cols-2 sm:gap-5 sm:p-8">
            <Field label="Ism va familiya" error={errors.fullName}>
              <input className={field} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Telefon raqam" error={errors.phone}>
              <div className="flex rounded-xl border border-slate-300 bg-white transition focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-600/15">
                <span className="select-none border-r border-slate-200 px-3 py-3 text-base text-slate-500">+998</span>
                <input
                  className="w-full min-w-0 rounded-r-xl bg-transparent px-3 py-3 text-base outline-none"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="50 777 37 38"
                  value={fmtPhone(phone)}
                  onChange={(e) => setPhone(normPhone(e.target.value))}
                />
              </div>
            </Field>
            <Field label="Kurs" error={errors.courseId}>
              <select className={field} value={courseId} onChange={(e) => { setCourseId(e.target.value); setGroupId(""); }}>
                <option value="">Tanlang</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Guruh (daraja)">
              <select className={field} value={groupId} onChange={(e) => setGroupId(e.target.value)} disabled={!courseId}>
                <option value="">Bilmayman, maslahat kerak</option>
                {courseGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
            <Field label="Format">
              <select className={field} value={formatId} onChange={(e) => setFormatId(e.target.value)}>
                <option value="">Tanlang</option>
                {formats.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </Field>
            <Field label="Yosh">
              <input className={field} type="number" inputMode="numeric" min={5} max={80} value={age} onChange={(e) => setAge(e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Izoh (ixtiyoriy)">
                <textarea className={field} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              {status === "error" && (
                <p role="alert" className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
              )}
              <button type="submit" disabled={status === "sending"} className="btn-shine glow-saffron group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-saffron px-6 py-3.5 text-base font-extrabold text-brand-900 transition hover:brightness-105 disabled:opacity-70 sm:py-4 sm:text-lg">
                {status === "sending" ? (
                  <><span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-900/30 border-t-brand-900" /> Yuborilmoqda...</>
                ) : (
                  <>{status === "error" ? "Qayta yuborish" : "Ariza yuborish"} <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
              <p className="mt-3 text-center text-sm text-slate-500">Ma'lumotlaringiz faqat siz bilan bog'lanish uchun ishlatiladi.</p>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1.5 block text-slate-700">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-red-700">{error}</span>}
    </label>
  );
}
