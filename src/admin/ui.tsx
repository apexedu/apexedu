import { ReactNode, useEffect } from "react";
import { AdminApiError } from "./adminApi";

export const btnPrimary = "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50";
export const btnGhost = "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50";
export const btnDanger = "rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50";
export const btnSmall = "rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm hover:bg-slate-50 disabled:opacity-40";
export const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";
export const cardCls = "rounded-2xl border border-slate-200 bg-white p-5";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Login yoki parol noto'g'ri.",
  too_many_attempts: "Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring.",
  unauthorized: "Sessiya tugadi. Qayta kiring.",
  network: "Server bilan aloqa yo'q yoki juda sekin javob berdi. Qayta urinib ko'ring.",
  not_configured: "VITE_API_URL sozlanmagan.",
  in_use: "Bu yozuv boshqa joyda ishlatilmoqda. Avval unga bog'liq yozuvlarni o'chiring.",
  invalid_ref: "Tanlangan kurs topilmadi.",
  invalid_url: "Havola http:// yoki https:// bilan boshlanishi kerak.",
  invalid_telegram: "Telegram username noto'g'ri (lotin harf, raqam va _).",
  invalid_token: "Bot tokeni noto'g'ri formatda.",
  invalid_chat_id: "Chat ID noto'g'ri (raqam yoki @kanal).",
  too_many_ids: "Chat ID'lar soni 20 tadan oshmasin.",
  invalid_file: "Fayl turi mos emas (JPG, PNG yoki WebP).",
  file_too_large: "Fayl juda katta.",
  login_taken: "Bunday login band.",
  invalid_login: "Login 3–30 belgi: lotin harf, raqam, nuqta, chiziqcha.",
  weak_password: "Parol kamida 8 ta belgidan iborat bo'lsin.",
  last_admin: "Oxirgi faol adminni o'chirib yoki bloklab bo'lmaydi.",
  self_action: "Bu amalni o'zingiz uchun bajarib bo'lmaydi.",
  not_allowed: "Bu amalga ruxsat yo'q.",
  not_found: "Yozuv topilmadi.",
};

export function errText(e: unknown): string {
  const code = e instanceof AdminApiError ? e.code : "network";
  if (MESSAGES[code]) return MESSAGES[code];
  if (code.startsWith("required_")) return "Majburiy maydon to'ldirilmagan.";
  if (code.startsWith("invalid_")) return "Kiritilgan ma'lumot noto'g'ri.";
  return "Xatolik yuz berdi. Qayta urinib ko'ring.";
}

export function Loading({ text = "Yuklanmoqda..." }: { text?: string }) {
  return <p className="p-8 text-center text-slate-500" role="status">{text}</p>;
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {message}
      {onRetry && <button onClick={onRetry} className="ml-3 underline">Qayta urinish</button>}
    </div>
  );
}

export function PageHeader({ title, hint, actions }: { title: string; hint?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {hint && <p className="mt-1 text-sm text-slate-600">{hint}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1.5 block">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900" aria-label="Yopish">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-600" : "bg-slate-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export const fmtDate = (iso: string) =>
  iso && iso.length >= 16 ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)} ${iso.slice(11, 16)}` : iso;
