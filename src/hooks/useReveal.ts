import { useEffect, useState } from "react";

// [data-reveal] elementlari ekranga kirganda "is-in" klassi qo'shiladi (animatsiya uchun).
// Keyin DOM'ga qo'shiladigan elementlar (masalan, forma qayta chizilganda) ham avtomatik kuzatiladi.
export function useRevealAll(dep: unknown) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in"));
      return;
    }
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((e) => {
        if (!seen.has(e)) { seen.add(e); io.observe(e); }
      });
    };
    scan();
    let raf = 0;
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, [dep]);
}

// "500+" -> 0 dan 500 gacha sanaydi, "+" va qolgan matn saqlanadi
export function useCountUp(value: string, start: boolean, ms = 1400) {
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const target = m ? parseInt(m[2], 10) : 0;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!m || !start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, target, ms]);
  if (!m) return value;
  return `${m[1]}${start ? n : 0}${m[3]}`;
}
