import { Icon, type IconName } from "./icons";

// Ta'limga oid, sekin suzuvchi belgilar: turk alifbosi harflari, darajalar, salomlashuvlar, kitob/qalam/globus.
// Faqat transform animatsiyasi (GPU) — telefonda ham yengil. Matn/ikonka juda xira, kontentga xalaqit bermaydi.
type Item = { v: string; icon?: IconName; x: number; y: number; s: number; r: number; dur: number; del: number; mob?: boolean };

const ITEMS: Item[] = [
  { v: "Ç", x: 4, y: 14, s: 84, r: -8, dur: 22, del: -3, mob: true },
  { v: "", icon: "book", x: 17, y: 72, s: 58, r: -10, dur: 26, del: -9 },
  { v: "Merhaba", x: 30, y: 8, s: 30, r: 4, dur: 24, del: -6 },
  { v: "Ş", x: 44, y: 78, s: 76, r: 8, dur: 20, del: -12, mob: true },
  { v: "", icon: "cap", x: 58, y: 16, s: 62, r: 8, dur: 28, del: -2 },
  { v: "A1", x: 71, y: 62, s: 44, r: -6, dur: 21, del: -15, mob: true },
  { v: "Hello", x: 83, y: 10, s: 32, r: -5, dur: 25, del: -8 },
  { v: "Ğ", x: 92, y: 44, s: 70, r: 10, dur: 23, del: -4 },
  { v: "", icon: "globe", x: 9, y: 44, s: 54, r: 6, dur: 27, del: -11 },
  { v: "B2", x: 24, y: 38, s: 40, r: 7, dur: 19, del: -7 },
  { v: "", icon: "pencil", x: 64, y: 40, s: 50, r: 14, dur: 24, del: -13, mob: true },
  { v: "Salom", x: 52, y: 52, s: 28, r: -4, dur: 26, del: -1 },
  { v: "Ö", x: 78, y: 82, s: 66, r: -9, dur: 22, del: -10 },
  { v: "C1", x: 37, y: 28, s: 38, r: 5, dur: 28, del: -5 },
  { v: "", icon: "chat", x: 90, y: 76, s: 52, r: -8, dur: 25, del: -14 },
  { v: "Ü", x: 12, y: 88, s: 60, r: 7, dur: 21, del: -6 },
];

interface Props { tone?: "dark" | "light"; seed?: number }

export default function EduBackdrop({ tone = "dark", seed = 0 }: Props) {
  const shift = (seed * 5) % ITEMS.length;
  const items = [...ITEMS.slice(shift), ...ITEMS.slice(0, shift)];
  const mirror = seed % 2 === 1;
  const color = tone === "dark" ? "text-white/[0.09]" : "text-brand-600/[0.09]";
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((it, i) => {
        // seed bo'yicha joylashuv har bir bo'limda boshqacha bo'lsin
        const x = mirror ? 100 - it.x : it.x;
        const y = (it.y + seed * 9) % 94;
        return (
          <span
            key={i}
            className={`edu-item ${i % 2 ? "edu-b" : "edu-a"} ${color} ${it.mob ? "" : "hidden sm:block"} font-extrabold leading-none tracking-tight`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: it.s,
              ["--r" as string]: `${it.r}deg`,
              ["--dur" as string]: `${it.dur}s`,
              ["--del" as string]: `${it.del}s`,
            }}
          >
            {it.icon ? <Icon name={it.icon} className="h-[1em] w-[1em]" /> : it.v}
          </span>
        );
      })}
    </div>
  );
}
