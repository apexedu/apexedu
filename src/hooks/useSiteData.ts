import { useCallback, useEffect, useRef, useState } from "react";
import { getSiteData } from "../services/api";
import type { SiteData } from "../types";

const KEY = "apexedu:site:v1";

function readCache(): SiteData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d && d.settings && Array.isArray(d.courses) && Array.isArray(d.reviews) ? (d as SiteData) : null;
  } catch {
    return null;
  }
}

// Avval saqlangan ma'lumot darhol ko'rsatiladi, yangisi fonda yuklanadi
export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(readCache);
  const dataRef = useRef<SiteData | null>(data);
  const [loading, setLoading] = useState(data === null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!dataRef.current) {
      setLoading(true);
      setError(false);
    }
    getSiteData()
      .then((d) => {
        dataRef.current = d;
        setData(d);
        setError(false);
        try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* xotira to'la bo'lsa — e'tibor bermaymiz */ }
      })
      .catch(() => {
        if (!dataRef.current) setError(true); // eski ma'lumot bo'lsa, xato ko'rsatilmaydi
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);
  return { data, loading, error, retry: load };
}
