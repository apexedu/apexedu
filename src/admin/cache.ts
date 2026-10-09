import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Admin, call, Row } from "./adminApi";
import { errText } from "./ui";

// Oddiy "eski ma'lumotni darhol ko'rsat, yangisini fonda yukla" (stale-while-revalidate) keshi.
// Sahifalar o'rtasida o'tganda tarmoq kutilmaydi; saqlash amallari ham darhol (optimistik) ko'rinadi.
interface Entry { data: unknown; at: number }
const store = new Map<string, Entry>();
const versions = new Map<string, number>();
const listeners = new Map<string, Set<() => void>>();
const inflight = new Map<string, Promise<unknown>>();
let initPromise: Promise<unknown> | null = null;

const isInitKey = (k: string) => k.startsWith("sheet:") || k === "settings" || k === "telegram" || k === "admins";

export const getCached = <T,>(k: string) => store.get(k)?.data as T | undefined;

export function setCached(k: string, data: unknown) {
  store.set(k, { data, at: Date.now() });
  listeners.get(k)?.forEach((f) => f());
}
const bump = (k: string) => versions.set(k, (versions.get(k) ?? 0) + 1);

function subscribe(k: string, f: () => void) {
  if (!listeners.has(k)) listeners.set(k, new Set());
  listeners.get(k)!.add(f);
  return () => { listeners.get(k)?.delete(f); };
}

export function clearAll() {
  store.clear();
  versions.clear();
  inflight.clear();
  initPromise = null;
}

export async function revalidate<T>(k: string, fetcher: () => Promise<T>, staleMs = 0): Promise<void> {
  // Boshlang'ich yuklash (adminInit) ketayotgan bo'lsa, qo'shimcha so'rov yubormay uni kutamiz
  if (initPromise && isInitKey(k)) {
    try { await initPromise; } catch { /* init xato bo'lsa — alohida yuklaymiz */ }
  }
  const e = store.get(k);
  if (e && staleMs && Date.now() - e.at < staleMs) return;
  const ver = versions.get(k) ?? 0;
  let p = inflight.get(k) as Promise<T> | undefined;
  if (!p) {
    p = fetcher().finally(() => inflight.delete(k));
    inflight.set(k, p);
  }
  const result = await p;
  // Kutish paytida optimistik o'zgartirish bo'lgan bo'lsa, eski javob uni ustiga yozmaydi
  if ((versions.get(k) ?? 0) === ver) setCached(k, result);
}

export function useCached<T>(key: string, fetcher: () => Promise<T>, staleMs = 60000) {
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const fRef = useRef(fetcher);
  fRef.current = fetcher;

  useEffect(() => subscribe(key, force), [key]);

  const run = useCallback((ms: number) => {
    setError("");
    setRefreshing(true);
    revalidate(key, () => fRef.current(), ms)
      .catch((e) => setError(errText(e)))
      .finally(() => setRefreshing(false));
  }, [key]);
  useEffect(() => { run(staleMs); }, [run, staleMs]);

  const mutate = useCallback((fn: (d: T | undefined) => T) => {
    bump(key);
    setCached(key, fn(getCached<T>(key)));
  }, [key]);

  return { data: getCached<T>(key), error, refreshing, reload: () => run(0), mutate };
}

interface InitResult {
  admin: Admin;
  sheets: Record<string, Row[]>;
  settings: Row;
  telegram: Row;
  admins: Row[];
}

// Bitta so'rovda: admin + barcha kontent ro'yxatlari + sozlamalar + adminlar
export function startInit(onAdmin: (a: Admin) => void): Promise<void> {
  const p = call<InitResult>("adminInit").then((r) => {
    Object.entries(r.sheets).forEach(([n, rows]) => setCached("sheet:" + n, rows));
    setCached("settings", r.settings);
    setCached("telegram", r.telegram);
    setCached("admins", r.admins);
    onAdmin(r.admin);
  });
  initPromise = p;
  return p;
}

export async function fetchApplications(): Promise<Row[]> {
  const r = await call<{ cols: string[]; rows: string[][] }>("adminApplications");
  return r.rows.map((v) => Object.fromEntries(r.cols.map((c, i) => [c, v[i]])));
}
