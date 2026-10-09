const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const TOKEN_KEY = "apexedu:admin:token";

export type Row = Record<string, any>;
export interface Admin { id: string; login: string }

export const getToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t: string | null) => {
  try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

export class AdminApiError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

// Barcha admin so'rovlari POST (token URL'da ko'rinmasligi uchun). Sessiya tokeni — "token" maydoni.
export async function call<T = any>(action: string, body: object = {}): Promise<T> {
  if (!API_URL) throw new AdminApiError("not_configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  let json: { ok: boolean; data?: unknown; error?: string };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, token: getToken(), ...body }),
      signal: ctrl.signal,
    });
    json = await res.json();
  } catch {
    throw new AdminApiError("network");
  } finally {
    clearTimeout(timer);
  }
  if (!json.ok) {
    if (json.error === "unauthorized") {
      setToken(null);
      window.dispatchEvent(new Event("admin:logout"));
    }
    throw new AdminApiError(json.error ?? "server_error");
  }
  return json.data as T;
}

// Yozuvlardan keyin sayt keshini fonda (kechiktirib, bitta so'rov bilan) yangilaydi — foydalanuvchi kutmaydi
let warmTimer: number | undefined;
export function scheduleWarm() {
  window.clearTimeout(warmTimer);
  warmTimer = window.setTimeout(() => { call("adminWarm").catch(() => undefined); }, 2500);
}
