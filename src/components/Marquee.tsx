// Hero va keyingi bo'lim orasidagi qiyshiq harakatlanuvchi lenta — bo'limlarni ajratib turadi
// va ta'limga oid (til) kayfiyat beradi.
const WORDS = ["Merhaba", "Hello", "Salom", "Teşekkürler", "Thank you", "Rahmat", "Günaydın", "Good morning", "Hoş geldiniz", "Welcome", "Başarılar", "Success"];

export default function Marquee({ name }: { name: string }) {
  const row = (k: string) => (
    <div className="flex shrink-0 items-center" key={k} aria-hidden={k === "b"}>
      {WORDS.flatMap((w, i) => (i % 3 === 2 ? [w, name] : [w])).map((w, i) => (
        <span key={i} className={`flex items-center whitespace-nowrap px-5 text-base font-extrabold uppercase tracking-wide sm:px-8 sm:text-2xl ${w === name ? "text-white drop-shadow-sm" : "text-brand-900"}`}>
          {w}
          <span className="ml-6 text-brand-900/40 sm:ml-8">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-10 -mt-7 mb-[-1.75rem] sm:-mt-9 sm:mb-[-2.25rem]" aria-hidden="true">
      <div className="marquee -rotate-[1.4deg] scale-x-[1.04] overflow-hidden bg-saffron py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] sm:py-4">
        <div className="marquee-track">{row("a")}{row("b")}</div>
      </div>
    </div>
  );
}
