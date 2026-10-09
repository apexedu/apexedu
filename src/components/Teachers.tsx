import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { Icon } from "./icons";
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
        className="mx-auto h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
      />
    );
  }
  return (
    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-brand-600 to-sky text-4xl font-extrabold text-white shadow-lg" aria-hidden="true">
      {initials(t.fullName)}
    </div>
  );
}

export default function Teachers({ teachers, name }: { teachers: Teacher[]; name: string }) {
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
    <Section id="teachers" title="O'qituvchilar" eyebrow="Jamoa" tone="light" prev="tint" wave="curve" backdrop={5} subtitle={`${name} ustozlari — har bir talabaga e'tibor beradigan tajribali mutaxassislar.`}>
      <div
        ref={box}
        data-reveal className="relative h-[27rem] overflow-hidden"
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
              className={`absolute left-1/2 top-1/2 overflow-hidden rounded-3xl border bg-white p-6 text-center transition-all duration-700 ease-out ${isActive ? "border-brand-600/30 shadow-2xl" : "border-slate-200 shadow-sm"} ${abs === 1 ? "cursor-pointer" : ""}`}
              style={{
                width: cardW,
                transform: `translate(-50%, -50%) translateX(${d * step}px) scale(${isActive ? 1 : 0.78})`,
                opacity: isActive ? 1 : abs === 1 ? 0.55 : abs === 2 ? 0.2 : 0,
                zIndex: 10 - abs,
                pointerEvents: abs > 1 ? "none" : "auto",
              }}
            >
              <span className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-brand-900 to-brand-600 `} aria-hidden="true" />
              <div className="relative pt-2"><Avatar t={t} /></div>
              <h3 className="mt-4 text-xl font-extrabold">{t.fullName}</h3>
              <p className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600">{t.position}</p>
              <p className="mt-3 text-sm text-slate-600">{t.bio}</p>
            </article>
          );
        })}
      </div>
      {n > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white transition hover:border-brand-600 hover:bg-brand-600 hover:text-white" aria-label="Oldingi o'qituvchi"><Icon name="chevleft" className="h-5 w-5" /></button>
          <div className="flex gap-2" aria-hidden="true">
            {teachers.map((t, i) => (
              <span key={t.id} className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-saffron" : "w-2 bg-slate-300"}`} />
            ))}
          </div>
          <button onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white transition hover:border-brand-600 hover:bg-brand-600 hover:text-white" aria-label="Keyingi o'qituvchi"><Icon name="right" className="h-5 w-5" /></button>
        </div>
      )}
    </Section>
  );
}
