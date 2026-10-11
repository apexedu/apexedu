import { useCallback, useEffect, useRef, useState } from "react";

// Gorizontal (scroll-snap) karusel uchun umumiy mantiq: joriy karta, avtomatik almashish, strelkalar.
// Surish brauzerning o'zi bilan ishlaydi (barmoq/sichqoncha g'ildiragi), shuning uchun telefonda silliq.
export function useCarousel(n: number, autoMs = 6000) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);
  const [paused, setPaused] = useState(false);
  const raf = useRef(0);

  const measure = useCallback(() => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setPerView(Math.max(1, Math.round(el.clientWidth / first.offsetWidth)));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, n]);

  const positions = Math.max(1, n - perView + 1);

  const stepPx = () => {
    const el = track.current;
    const a = el?.children[0] as HTMLElement | undefined;
    const b = el?.children[1] as HTMLElement | undefined;
    if (!a) return 0;
    return b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
  };

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const k = Math.min(Math.max(i, 0), positions - 1);
    el.scrollTo({ left: k * stepPx(), behavior: "smooth" });
  }, [positions]);

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = track.current;
      const s = stepPx();
      if (!el || !s) return;
      setActive(Math.min(positions - 1, Math.max(0, Math.round(el.scrollLeft / s))));
    });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const next = () => goTo(active + 1 >= positions ? 0 : active + 1);
  const prev = () => goTo(active - 1 < 0 ? positions - 1 : active - 1);

  // Avtomatik almashish (sichqoncha/barmoq tegsa yoki "harakatni kamaytirish" yoqilgan bo'lsa to'xtaydi)
  useEffect(() => {
    if (positions < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => goTo(active + 1 >= positions ? 0 : active + 1), autoMs);
    return () => clearInterval(t);
  }, [positions, paused, active, goTo, autoMs]);

  // Konteynerga qo'yiladigan "to'xtatish" hodisalari
  const hold = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onTouchStart: () => setPaused(true),
    onTouchEnd: () => { setTimeout(() => setPaused(false), 4000); },
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return { track, active, positions, goTo, next, prev, onScroll, hold };
}
