import { ReactNode, useCallback, useEffect, useState } from "react";
import { call, Row } from "./adminApi";
import { btnDanger, btnGhost, btnPrimary, btnSmall, cardCls, ErrorBox, errText, Field, inputCls, Loading, Modal, PageHeader, Toggle } from "./ui";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "bool" | "ref" | "photo" | "rating";
  refSheet?: string;
  hint?: string;
}
export interface ColDef { key: string; label: string; render?: (r: Row, refs: Record<string, Row[]>) => ReactNode }
export interface CrudConfig {
  sheet: string;
  title: string;
  hint?: string;
  singular: string;
  columns: ColDef[];
  fields: FieldDef[];
  activeKey: "active" | "approved";
  activeLabel: string;
  ordered: boolean;
  canCreate: boolean;
}

// ---- Rasm yordamchilari (Drive havolasi / fayl ID'si / lokal fayl nomi) ----
const driveId = (u: string) =>
  u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=|thumbnail\?(?:[^#]*&)?id=)([\w-]{20,})/)?.[1] ??
  (/^[\w-]{25,}$/.test(u) ? u : null);

export const photoPreview = (url: string) => {
  const id = driveId(url);
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w200`;
  return /^(https?:|data:)/.test(url) ? url : `../assets/teachers/${url.replace(/^\.?\/?(assets\/teachers\/)?/, "")}`;
};

// Brauzerda kvadratga qirqib, 800x800 gacha siqadi (JPEG)
async function compress(file: File): Promise<{ mime: string; data: string }> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const out = Math.min(side, 800);
  const cv = document.createElement("canvas");
  cv.width = cv.height = out;
  cv.getContext("2d")!.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, out, out);
  const blob: Blob = await new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error("invalid_file"))), "image/jpeg", 0.82));
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { mime: "image/jpeg", data: btoa(bin) };
}

function PhotoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(f?: File) {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      const { mime, data } = await compress(f);
      const r = await call<{ id: string }>("adminUploadPhoto", { mime, data });
      onChange(r.id);
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex items-center gap-4">
      {value ? (
        <img src={photoPreview(value)} alt="" referrerPolicy="no-referrer" className="h-20 w-20 rounded-full bg-slate-100 object-cover" />
      ) : (
        <div className="h-20 w-20 rounded-full bg-slate-100" />
      )}
      <div className="space-y-1 text-sm">
        <input type="file" accept="image/*" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
        {busy && <p className="text-slate-500">Siqilib, Drive'ga yuklanmoqda...</p>}
        {err && <p className="text-red-700">{err}</p>}
        {value && !busy && <button type="button" className="text-red-700 underline" onClick={() => onChange("")}>Rasmni olib tashlash</button>}
      </div>
    </div>
  );
}

export default function CrudPage({ cfg }: { cfg: CrudConfig }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [refs, setRefs] = useState<Record<string, Row[]>>({});
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const refSheets = Array.from(new Set(cfg.fields.filter((f) => f.type === "ref").map((f) => f.refSheet!)));
      const [list, ...rl] = await Promise.all([
        call<Row[]>("adminListSheet", { sheet: cfg.sheet }),
        ...refSheets.map((s) => call<Row[]>("adminListSheet", { sheet: s })),
      ]);
      setRows(list);
      setRefs(Object.fromEntries(refSheets.map((s, i) => [s, rl[i]])));
    } catch (e) {
      setError(errText(e));
    }
  }, [cfg]);
  useEffect(() => { load(); }, [load]);

  function openForm(row: Row | null) {
    setFormErr("");
    setIsNew(!row);
    const init: Row = row ? { ...row } : { [cfg.activeKey]: cfg.activeKey === "active", rating: 5 };
    setForm(init);
    setEditing(row ?? {});
  }

  async function save() {
    setSaving(true);
    setFormErr("");
    try {
      const payload: Row = {};
      cfg.fields.forEach((f) => { payload[f.key] = form[f.key] ?? (f.type === "bool" ? false : ""); });
      if (!isNew) payload.id = editing!.id;
      await call("adminUpsert", { sheet: cfg.sheet, row: payload });
      setEditing(null);
      await load();
    } catch (e) {
      setFormErr(errText(e));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(r: Row) {
    try {
      await call("adminUpsert", { sheet: cfg.sheet, row: { id: r.id, [cfg.activeKey]: !r[cfg.activeKey] } });
      setRows((rs) => rs && rs.map((x) => (x.id === r.id ? { ...x, [cfg.activeKey]: !r[cfg.activeKey] } : x)));
    } catch (e) {
      setError(errText(e));
    }
  }

  async function remove(r: Row) {
    if (!window.confirm("Rostdan ham o'chirilsinmi? Buni qaytarib bo'lmaydi. (Yashirish uchun o'chirgich tugmasidan foydalaning.)")) return;
    try {
      await call("adminDelete", { sheet: cfg.sheet, id: r.id });
      await load();
    } catch (e) {
      setError(errText(e));
    }
  }

  async function move(i: number, dir: -1 | 1) {
    if (!rows) return;
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = rows.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    try {
      await call("adminReorder", { sheet: cfg.sheet, ids: next.map((r) => r.id) });
    } catch (e) {
      setError(errText(e));
      load();
    }
  }

  return (
    <div>
      <PageHeader
        title={cfg.title}
        hint={cfg.hint}
        actions={cfg.canCreate && <button className={btnPrimary} onClick={() => openForm(null)}>+ Qo'shish</button>}
      />
      {error && <div className="mb-4"><ErrorBox message={error} onRetry={load} /></div>}
      {!rows ? (
        !error && <Loading />
      ) : rows.length === 0 ? (
        <p className={`${cardCls} text-slate-500`}>Hozircha yozuv yo'q.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                {cfg.ordered && <th className="w-20 px-3 py-3">Tartib</th>}
                {cfg.columns.map((c) => <th key={c.key} className="px-3 py-3 font-medium">{c.label}</th>)}
                <th className="px-3 py-3 font-medium">{cfg.activeLabel}</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={r.id} className={r[cfg.activeKey] ? "" : "bg-slate-50 text-slate-500"}>
                  {cfg.ordered && (
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button className={btnSmall} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yuqoriga">↑</button>
                        <button className={btnSmall} onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Pastga">↓</button>
                      </div>
                    </td>
                  )}
                  {cfg.columns.map((c) => <td key={c.key} className="px-3 py-2 align-middle">{c.render ? c.render(r, refs) : String(r[c.key] ?? "")}</td>)}
                  <td className="px-3 py-2"><Toggle checked={!!r[cfg.activeKey]} onChange={() => toggleActive(r)} label={cfg.activeLabel} /></td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button className={btnSmall} onClick={() => openForm(r)}>Tahrirlash</button>
                      <button className={btnDanger} onClick={() => remove(r)}>O'chirish</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={isNew ? `${cfg.singular}: yangi` : `${cfg.singular}: tahrirlash`} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            {cfg.fields.map((f) => (
              <Field key={f.key} label={f.label} hint={f.hint}>
                {f.type === "textarea" ? (
                  <textarea className={inputCls} rows={4} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                ) : f.type === "ref" ? (
                  <select className={inputCls} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    <option value="">Tanlang</option>
                    {(refs[f.refSheet!] ?? []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                ) : f.type === "bool" ? (
                  <Toggle checked={!!form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} label={f.label} />
                ) : f.type === "rating" ? (
                  <select className={inputCls} value={form[f.key] ?? 5} onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
                  </select>
                ) : f.type === "photo" ? (
                  <PhotoField value={form[f.key] ?? ""} onChange={(v) => setForm({ ...form, [f.key]: v })} />
                ) : (
                  <input className={inputCls} type={f.type === "number" ? "number" : "text"} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                )}
              </Field>
            ))}
            {formErr && <ErrorBox message={formErr} />}
            <div className="flex justify-end gap-3 pt-2">
              <button className={btnGhost} onClick={() => setEditing(null)}>Bekor qilish</button>
              <button className={btnPrimary} onClick={save} disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
