import { useCallback, useEffect, useState } from "react";
import { getSiteData } from "../services/api";
import type { SiteData } from "../types";

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getSiteData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);
  return { data, loading, error, retry: load };
}
