import { mockSiteData } from "../data/mock";
import type { ApplicationPayload, ReviewPayload, SiteData } from "../types";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const TIMEOUT_MS = 15000;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Lokal ishlab chiqishda API manzili bo'lmasa, mock ishlatiladi. Production'da — yo'q (xato ko'rsatiladi).
const useMock = !API_URL && import.meta.env.DEV;

async function request<T>(action: string, body?: object): Promise<T> {
  if (!API_URL) throw new Error("VITE_API_URL sozlanmagan");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
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
    const json = await res.json();
    if (!json.ok) throw new Error(json.error ?? "api_error");
    return json.data as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function getSiteData(): Promise<SiteData> {
  if (useMock) {
    console.warn("[mock] VITE_API_URL yo'q — vaqtincha ma'lumotlar ishlatilmoqda");
    await delay(300);
    return mockSiteData;
  }
  return request<SiteData>("public");
}

export async function submitApplication(payload: ApplicationPayload): Promise<void> {
  if (useMock) { await delay(800); console.info("[mock] ariza:", payload); return; }
  await request("submitApplication", payload);
}

export async function submitReview(payload: ReviewPayload): Promise<void> {
  if (useMock) { await delay(700); console.info("[mock] fikr:", payload); return; }
  await request("submitReview", payload);
}
