import { mockSiteData } from "../data/mock";
import type { ApplicationPayload, ReviewPayload, SiteData } from "../types";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Lokal ishlab chiqishda API manzili bo'lmasa, mock ishlatiladi. Production'da — yo'q (xato ko'rsatiladi).
const useMock = !API_URL && import.meta.env.DEV;

export class ApiError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

const newRequestId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

async function once<T>(action: string, body: object | undefined, timeoutMs: number): Promise<T> {
  if (!API_URL) throw new ApiError("not_configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let json: { ok: boolean; data?: unknown; error?: string };
  try {
    // POST: "text/plain" — Apps Script uchun preflight (CORS) so'rovisiz ishlashi shart
    const res = body
      ? await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action, ...body }),
          signal: ctrl.signal,
        })
      : await fetch(`${API_URL}?action=${action}`, { signal: ctrl.signal });
    json = await res.json();
  } catch {
    throw new ApiError("network");
  } finally {
    clearTimeout(timer);
  }
  if (!json.ok) throw new ApiError(json.error ?? "server_error");
  return json.data as T;
}

// Tarmoq/server xatosida avtomatik qayta uriniladi (Apps Script ba'zan sekin yoki "uyquda" bo'ladi)
async function request<T>(action: string, body: object | undefined, timeoutMs: number, retries: number): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await once<T>(action, body, timeoutMs);
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "network";
      const retryable = code === "network" || code === "server_error";
      if (!retryable || attempt >= retries) throw e instanceof ApiError ? e : new ApiError("network");
      await delay(700 * (attempt + 1));
    }
  }
}

// Backend eski bo'lsa ham (yangi maydonlar kelmasa) sayt yiqilmasligi uchun standart qiymatlar qo'yiladi
const SETTINGS_DEFAULTS = { instagram: "", facebook: "", youtube: "" };

function normalize(d: SiteData): SiteData {
  return {
    ...d,
    settings: { ...SETTINGS_DEFAULTS, ...d.settings },
    heroCards: d.heroCards ?? d.courses.map((c) => ({ id: c.id, title: `${c.name}: daraja yo'li`, courseId: c.id })),
    reviews: d.reviews ?? [],
  };
}

export async function getSiteData(): Promise<SiteData> {
  if (useMock) {
    console.warn("[mock] VITE_API_URL yo'q — vaqtincha ma'lumotlar ishlatilmoqda");
    await delay(300);
    return mockSiteData;
  }
  return normalize(await request<SiteData>("public", undefined, 20000, 2));
}

// requestId — qayta yuborilganda server ikkinchi yozuv yaratmasligi uchun
export async function submitApplication(payload: ApplicationPayload): Promise<void> {
  if (useMock) { await delay(800); console.info("[mock] ariza:", payload); return; }
  await request("submitApplication", { ...payload, requestId: newRequestId() }, 25000, 1);
}

export async function submitReview(payload: ReviewPayload): Promise<void> {
  if (useMock) { await delay(700); console.info("[mock] fikr:", payload); return; }
  await request("submitReview", { ...payload, requestId: newRequestId() }, 25000, 1);
}
