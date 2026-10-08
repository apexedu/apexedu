import { FormEvent, useMemo, useState } from "react";
import Section from "./Section";
import { ApiError, submitApplication } from "../services/api";
import type { Course, Format, Group } from "../types";

interface Props { courses: Course[]; groups: Group[]; formats: Format[]; presetCourse?: string; presetGroup?: string }
type Status = "idle" | "sending" | "success" | "error";

const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-600";

export default function ApplyForm({ courses, groups, formats, presetCourse = "", presetGroup = "" }: Props) {
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
    if (phone.replace(/\D/g, "").length < 9) e.phone = "Telefon raqamni to'liq kiriting";
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
        fullName: fullName.trim(), phone, courseId, groupId, formatId, age, comment,
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
    <Section id="apply" title="Kursga yozilish" subtitle="Ma'lumotlaringizni qoldiring — tez orada siz bilan bog'lanamiz.">
      {status === "success" ? (
        <div role="status" className="max-w-xl rounded-2xl bg-brand-50 p-6 text-brand-900">
          Arizangiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz.
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-5 sm:grid-cols-2">
          <Field label="Ism va familiya" error={errors.fullName}>
            <input className={field} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Telefon raqam" error={errors.phone}>
            <input className={field} type="tel" inputMode="tel" placeholder="+998 __ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
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
              <p role="alert" className="mb-3 text-sm text-red-700">{errorMsg}</p>
            )}
            <button type="submit" disabled={status === "sending"} className="w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto">
              {status === "sending" ? "Yuborilmoqda..." : status === "error" ? "Qayta yuborish" : "Ariza yuborish"}
            </button>
          </div>
        </form>
      )}
    </Section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1.5 block">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-red-700">{error}</span>}
    </label>
  );
}
