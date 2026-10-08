import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import type { Teacher } from "../types";

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

// photo_url katagida quyidagilardan istalgani bo'lishi mumkin:
//  - Google Drive havolasi yoki faqat fayl ID'si (rasm "Anyone with the link" bo'lishi kerak)
//  - fayl nomi (ali.jpg) — public/assets/teachers/ papkasidan olinadi
//  - boshqa to'liq havola (https://...)
const driveId = (u: string) =>
  u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=|thumbnail\?(?:[^#]*&)?id=)([\w-]{20,})/)?.[1] ??
  (/^[\w-]{25,}$/.test(u) ? u : null);

const photoSrc = (url: string) => {
  const id = driveId(url);
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w800`;
  return /^(https?:|data:)/.test(url)
    ? url
    : `${import.meta.env.BASE_URL}assets/teachers/${url.replace(/^\.?\/?(assets\/teachers\/)?/, "")}`;
};

function Avatar({ t }: { t: Teacher }) {
  const [failed, setFailed] = useState(false);
  if (t.photo && !failed) {
    return (
      <img
        src={photoSrc(t.photo)}
        alt={t.fullName}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="mx-auto h-28 w-28 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-brand-50 text-3xl font-semibold text-brand-600" aria-hidden="true">
      {initials(t.fullName)}
    </div>
  );
}

export default function Teachers({ teachers }: { teachers: Teacher[] }) {
  const n = teachers.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [w, setW] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 3500);
    return () => clearInterval(t);
  }, [n, paused]);

  const go = (d: number) => setActive((a) => (a + d + n) % n);
  const cardW = Math.min(320, w * 0.78);
  const step = cardW * 0.82;
  const half = Math.floor(n / 2);

  return (
    <Section id="teachers" title="O'qituvchilar">
      <div
        ref={box}
        className="relative h-[25rem] overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
        onTouchEnd={(e) => {
          if (touchX.current !== null) {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }
          touchX.current = null;
          setPaused(false);
        }}
      >
        {teachers.map((t, i) => {
          const d = ((i - active + n + half) % n) - half;
          const abs = Math.abs(d);
          const isActive = d === 0;
          return (
            <article
              key={t.id}
              aria-hidden={!isActive}
              onClick={() => abs === 1 && setActive(i)}
              className={`absolute left-1/2 top-1/2 rounded-2xl border bg-white p-6 text-center transition-all duration-700 ease-out ${isActive ? "border-brand-600/30 shadow-xl" : "border-slate-200 shadow-sm"} ${abs === 1 ? "cursor-pointer" : ""}`}
              style={{
                width: cardW,
                transform: `translate(-50%, -50%) translateX(${d * step}px) scale(${isActive ? 1 : 0.78})`,
                opacity: isActive ? 1 : abs === 1 ? 0.55 : abs === 2 ? 0.2 : 0,
                zIndex: 10 - abs,
                pointerEvents: abs > 1 ? "none" : "auto",
              }}
            >
              <Avatar t={t} />
              <h3 className="mt-4 text-lg font-semibold">{t.fullName}</h3>
              <p className="text-sm font-medium text-brand-600">{t.position}</p>
              <p className="mt-2 text-sm text-slate-600">{t.bio}</p>
            </article>
          );
        })}
      </div>
      {n > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-brand-50" aria-label="Oldingi o'qituvchi">Oldingi</button>
          <div className="flex gap-2" aria-hidden="true">
            {teachers.map((t, i) => (
              <span key={t.id} className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-brand-600" : "w-2 bg-slate-300"}`} />
            ))}
          </div>
          <button onClick={() => go(1)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-brand-50" aria-label="Keyingi o'qituvchi">Keyingi</button>
        </div>
      )}
    </Section>
  );
}
