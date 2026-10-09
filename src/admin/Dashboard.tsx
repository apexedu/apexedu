import { useMemo } from "react";
import { Row } from "./adminApi";
import { fetchApplications, useCached } from "./cache";
import { btnGhost, cardCls, ErrorBox, Loading, PageHeader } from "./ui";

// Sana kalitlari Toshkent vaqtida saqlangan created_at dan (YYYY-MM-DD...) olinadi
const todayStr = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
const addDays = (d: string, n: number) => {
  const x = new Date(d + "T00:00:00Z");
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const weekStart = (d: string) => addDays(d, -((new Date(d + "T00:00:00Z").getUTCDay() + 6) % 7));
const monthAdd = (m: string, n: number) => {
  const [y, mo] = m.split("-").map(Number);
  const t = y * 12 + (mo - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
};
const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

interface Point { label: string; value: number }

function count(rows: Row[], key: (r: Row) => string) {
  const m = new Map<string, number>();
  rows.forEach((r) => { const k = key(r); m.set(k, (m.get(k) ?? 0) + 1); });
  return m;
}
const top = (m: Map<string, number>, n = 8): Point[] =>
  Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, value]) => ({ label, value }));

function Bars({ data }: { data: Point[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const every = data.length > 14 ? 5 : 1;
  return (
    <div>
      <div className="flex h-44 items-end gap-1">
        {data.map((d, i) => (
          <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end" title={`${d.label}: ${d.value}`}>
            <span className="text-[10px] text-slate-500">{d.value || ""}</span>
            <div className="w-full rounded-t bg-brand-600" style={{ height: `${(d.value / max) * 80}%`, minHeight: d.value ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {data.map((d, i) => (
          <span key={i} className="min-w-0 flex-1 truncate text-center text-[10px] text-slate-500">{i % every === 0 || i === data.length - 1 ? d.label : ""}</span>
        ))}
      </div>
    </div>
  );
}

function HBars({ data }: { data: Point[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (!data.length) return <p className="text-sm text-slate-500">Ma'lumot yo'q</p>;
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.label} className="text-sm">
          <div className="mb-0.5 flex justify-between gap-3"><span className="truncate">{d.label}</span><span className="font-medium">{d.value}</span></div>
          <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${(d.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={cardCls}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: rows, error, reload: load, refreshing } = useCached<Row[]>("applications", fetchApplications, 30000);

  const s = useMemo(() => {
    if (!rows) return null;
    const today = todayStr();
    const day = (r: Row) => String(r.created_at).slice(0, 10);
    const byDay = count(rows, day);
    const byWeek = count(rows, (r) => weekStart(day(r)));
    const byMonth = count(rows, (r) => day(r).slice(0, 7));
    const days: Point[] = Array.from({ length: 30 }, (_, i) => {
      const d = addDays(today, i - 29);
      return { label: `${d.slice(8)}.${d.slice(5, 7)}`, value: byDay.get(d) ?? 0 };
    });
    const weeks: Point[] = Array.from({ length: 12 }, (_, i) => {
      const d = addDays(weekStart(today), (i - 11) * 7);
      return { label: `${d.slice(8)}.${d.slice(5, 7)}`, value: byWeek.get(d) ?? 0 };
    });
    const months: Point[] = Array.from({ length: 12 }, (_, i) => {
      const m = monthAdd(today.slice(0, 7), i - 11);
      return { label: MONTHS[Number(m.slice(5)) - 1], value: byMonth.get(m) ?? 0 };
    });
    const none = "Ko'rsatilmagan";
    return {
      total: rows.length,
      today: byDay.get(today) ?? 0,
      week: byWeek.get(weekStart(today)) ?? 0,
      month: byMonth.get(today.slice(0, 7)) ?? 0,
      days, weeks, months,
      courses: top(count(rows, (r) => r.course || none)),
      groups: top(count(rows, (r) => (r.group ? `${r.course} / ${r.group}` : `${r.course} / ${none}`))),
      formats: top(count(rows, (r) => r.format || none)),
      peak: top(byDay, 1)[0],
    };
  }, [rows]);

  return (
    <div>
      <PageHeader title="Dashboard" hint="Arizalar statistikasi (Toshkent vaqti bilan)." actions={<button className={btnGhost} onClick={load} disabled={refreshing}>{refreshing ? "Yangilanmoqda..." : "Yangilash"}</button>} />
      {error && <ErrorBox message={error} onRetry={load} />}
      {!rows && !error && <Loading />}
      {s && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Jami arizalar" value={s.total} />
            <Stat label="Bugun" value={s.today} />
            <Stat label="Shu hafta" value={s.week} />
            <Stat label="Shu oy" value={s.month} />
          </div>
          {s.total > 0 && (
            <div className={`${cardCls} text-sm text-slate-700`}>
              Eng ko'p ariza: <b>{s.courses[0]?.label}</b> kursiga, <b>{s.formats[0]?.label}</b> formatiga
              {s.peak && <>; eng faol kun — <b>{s.peak.label.slice(8)}.{s.peak.label.slice(5, 7)}.{s.peak.label.slice(0, 4)}</b> ({s.peak.value} ta)</>}.
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={cardCls}><h2 className="mb-3 font-semibold">Kunlar bo'yicha (oxirgi 30 kun)</h2><Bars data={s.days} /></div>
            <div className={cardCls}><h2 className="mb-3 font-semibold">Haftalar bo'yicha (oxirgi 12 hafta)</h2><Bars data={s.weeks} /></div>
            <div className={cardCls}><h2 className="mb-3 font-semibold">Oylar bo'yicha (oxirgi 12 oy)</h2><Bars data={s.months} /></div>
            <div className={cardCls}><h2 className="mb-3 font-semibold">Kurslar bo'yicha</h2><HBars data={s.courses} /></div>
            <div className={cardCls}><h2 className="mb-3 font-semibold">Guruhlar bo'yicha</h2><HBars data={s.groups} /></div>
            <div className={cardCls}><h2 className="mb-3 font-semibold">Ta'lim formati bo'yicha</h2><HBars data={s.formats} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
