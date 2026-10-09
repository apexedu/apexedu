import { useCallback, useEffect, useMemo, useState } from "react";
import { call, Row } from "./adminApi";
import { btnGhost, btnSmall, cardCls, ErrorBox, errText, fmtDate, inputCls, Loading, Modal, PageHeader } from "./ui";

const PAGE = 20;
const uniq = (rows: Row[], key: string) => Array.from(new Set(rows.map((r) => r[key]).filter(Boolean))).sort() as string[];
const DETAIL: [string, string][] = [
  ["ID", "id"], ["Sana", "created_at"], ["Ism", "full_name"], ["Telefon", "phone"], ["Kurs", "course"], ["Guruh", "group"],
  ["Format", "format"], ["Yosh", "age"], ["Izoh", "comment"], ["Manba", "source"], ["utm_source", "utm_source"], ["utm_medium", "utm_medium"], ["utm_campaign", "utm_campaign"],
];

export default function Applications() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [course, setCourse] = useState("");
  const [group, setGroup] = useState("");
  const [format, setFormat] = useState("");
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Row | null>(null);

  const load = useCallback(() => {
    setError("");
    call<Row[]>("adminApplications").then(setRows).catch((e) => setError(errText(e)));
  }, []);
  useEffect(load, [load]);
  useEffect(() => setPage(1), [q, from, to, course, group, format]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const needle = q.trim().toLowerCase().replace(/\s+/g, " ");
    const digits = needle.replace(/\D/g, "");
    return rows.filter((r) => {
      const d = String(r.created_at).slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (course && r.course !== course) return false;
      if (group && r.group !== group) return false;
      if (format && r.format !== format) return false;
      if (!needle) return true;
      return (
        `${r.full_name} ${r.comment} ${r.id}`.toLowerCase().includes(needle) ||
        (digits.length >= 3 && String(r.phone).includes(digits))
      );
    });
  }, [rows, q, from, to, course, group, format]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const slice = filtered.slice((page - 1) * PAGE, page * PAGE);
  const reset = () => { setQ(""); setFrom(""); setTo(""); setCourse(""); setGroup(""); setFormat(""); };
  const groupOpts = rows ? uniq(course ? rows.filter((r) => r.course === course) : rows, "group") : [];

  return (
    <div>
      <PageHeader title="Arizalar" hint="Saytdan kelgan arizalar (yangisi birinchi)." actions={<button className={btnGhost} onClick={load}>Yangilash</button>} />
      {error && <ErrorBox message={error} onRetry={load} />}
      {!rows && !error && <Loading />}
      {rows && (
        <>
          <div className={`${cardCls} mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
            <input className={`${inputCls} sm:col-span-2`} placeholder="Qidirish: ism, telefon, izoh, ID" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="text-xs text-slate-500">Sanadan<input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
            <label className="text-xs text-slate-500">Sanagacha<input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} /></label>
            <select className={inputCls} value={course} onChange={(e) => { setCourse(e.target.value); setGroup(""); }}>
              <option value="">Barcha kurslar</option>{uniq(rows, "course").map((v) => <option key={v}>{v}</option>)}
            </select>
            <select className={inputCls} value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">Barcha guruhlar</option>{groupOpts.map((v) => <option key={v}>{v}</option>)}
            </select>
            <select className={inputCls} value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">Barcha formatlar</option>{uniq(rows, "format").map((v) => <option key={v}>{v}</option>)}
            </select>
            <button className={btnGhost} onClick={reset}>Filtrni tozalash</button>
          </div>
          <p className="mb-2 text-sm text-slate-600">Topildi: <b>{filtered.length}</b> ta{rows.length >= 5000 && " (oxirgi 5000 ta ariza ko'rsatilmoqda)"}</p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>{["Sana", "Ism", "Telefon", "Kurs", "Guruh", "Format"].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slice.map((r) => (
                  <tr key={r.id} onClick={() => setSel(r)} className="cursor-pointer hover:bg-brand-50">
                    <td className="whitespace-nowrap px-3 py-2">{fmtDate(r.created_at)}</td>
                    <td className="px-3 py-2 font-medium">{r.full_name}</td>
                    <td className="whitespace-nowrap px-3 py-2">{r.phone}</td>
                    <td className="px-3 py-2">{r.course}</td>
                    <td className="px-3 py-2">{r.group || "—"}</td>
                    <td className="px-3 py-2">{r.format || "—"}</td>
                  </tr>
                ))}
                {!slice.length && <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-500">Hech narsa topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button className={btnSmall} onClick={() => setPage(page - 1)} disabled={page === 1}>Oldingi</button>
              <span>{page} / {pages}</span>
              <button className={btnSmall} onClick={() => setPage(page + 1)} disabled={page === pages}>Keyingi</button>
            </div>
          )}
        </>
      )}
      {sel && (
        <Modal title={`Ariza ${sel.id}`} onClose={() => setSel(null)}>
          <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[120px_1fr]">
            {DETAIL.filter(([, k]) => sel[k]).map(([label, k]) => (
              <div key={k} className="contents"><dt className="text-slate-500">{label}</dt><dd className="break-words font-medium">{k === "created_at" ? fmtDate(sel[k]) : sel[k]}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex justify-end"><button className={btnGhost} onClick={() => setSel(null)}>Yopish</button></div>
        </Modal>
      )}
    </div>
  );
}
