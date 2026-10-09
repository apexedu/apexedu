import { useCallback, useEffect, useState } from "react";
import { call, Row } from "./adminApi";
import { btnGhost, btnPrimary, cardCls, ErrorBox, errText, Field, inputCls, Loading, PageHeader, Toggle } from "./ui";

function useLoad<T>(action: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    setError("");
    call<T>(action).then(setData).catch((e) => setError(errText(e)));
  }, [action]);
  useEffect(load, [load]);
  return { data, setData, error, load };
}

// ---------------- Umumiy / aloqa sozlamalari ----------------
interface Stat { value: string; label: string }

export function GeneralSettings() {
  const { data, setData, error, load } = useLoad<Row>("adminGetSettings");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: string, v: unknown) => setData((d) => (d ? { ...d, [k]: v } : d));

  async function save() {
    if (!data) return;
    setSaving(true);
    setMsg(null);
    try {
      await call("adminSaveSettings", { values: data });
      setMsg({ ok: true, text: "Saqlandi. Sayt ~1 daqiqa ichida yangilanadi." });
    } catch (e) {
      setMsg({ ok: false, text: errText(e) });
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!data) return <Loading />;
  const stats: Stat[] = data.stats ?? [];
  const text = (k: string, label: string, hint?: string) => (
    <Field label={label} hint={hint}><input className={inputCls} value={data[k] ?? ""} onChange={(e) => set(k, e.target.value)} /></Field>
  );

  return (
    <div>
      <PageHeader title="Umumiy va aloqa sozlamalari" hint="Bosh sahifa matnlari va aloqa ma'lumotlari." />
      <div className="max-w-2xl space-y-6">
        <div className={`${cardCls} space-y-4`}>
          <h2 className="font-semibold">Bosh sahifa</h2>
          {text("academyName", "Markaz nomi")}
          {text("heroTitle", "Bosh sarlavha")}
          <Field label="Bosh matn"><textarea className={inputCls} rows={3} value={data.heroText ?? ""} onChange={(e) => set("heroText", e.target.value)} /></Field>
          <div>
            <p className="mb-1.5 text-sm font-medium">Statistika (sarlavha ostidagi raqamlar)</p>
            <div className="space-y-2">
              {stats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input className={`${inputCls} w-28`} placeholder="500+" value={s.value} onChange={(e) => set("stats", stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                  <input className={inputCls} placeholder="bitiruvchi" value={s.label} onChange={(e) => set("stats", stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                  <button className={btnGhost} onClick={() => set("stats", stats.filter((_, j) => j !== i))} aria-label="O'chirish">✕</button>
                </div>
              ))}
              {stats.length < 6 && <button className={btnGhost} onClick={() => set("stats", [...stats, { value: "", label: "" }])}>+ Qo'shish</button>}
            </div>
          </div>
        </div>
        <div className={`${cardCls} space-y-4`}>
          <h2 className="font-semibold">Aloqa</h2>
          <Field label="Telefon raqamlar" hint="Har biri alohida qatorda"><textarea className={inputCls} rows={3} value={data.phones ?? ""} onChange={(e) => set("phones", e.target.value)} /></Field>
          {text("telegram", "Telegram username", "Masalan: apexedu_admin (@ belgisisiz)")}
          {text("address", "Manzil")}
          {text("workingHours", "Ish vaqti")}
          {text("mapUrl", "Xarita havolasi", "https://... (Google Maps)")}
        </div>
        <div className={`${cardCls} space-y-4`}>
          <h2 className="font-semibold">Ijtimoiy tarmoqlar</h2>
          {text("instagram", "Instagram", "https://instagram.com/...")}
          {text("facebook", "Facebook", "https://facebook.com/...")}
          {text("youtube", "YouTube", "https://youtube.com/...")}
        </div>
        {msg && (msg.ok ? <p role="status" className="rounded-xl bg-brand-50 p-3 text-sm text-brand-900">{msg.text}</p> : <ErrorBox message={msg.text} />)}
        <button className={btnPrimary} onClick={save} disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
      </div>
    </div>
  );
}

// ---------------- Telegram ----------------
interface Tg { enabled: boolean; tokenSet: boolean; chatIds: string[] }

export function TelegramSettings() {
  const { data, error, load } = useLoad<Tg>("adminGetTelegram");
  const [enabled, setEnabled] = useState(true);
  const [ids, setIds] = useState("");
  const [token, setTokenVal] = useState("");
  const [tokenSet, setTokenSet] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (data) { setEnabled(data.enabled); setIds(data.chatIds.join("\n")); setTokenSet(data.tokenSet); }
  }, [data]);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await call<Tg>("adminSaveTelegram", { enabled, chatIds: ids, ...(token ? { botToken: token } : {}) });
      setTokenSet(r.tokenSet);
      setTokenVal("");
      setMsg({ ok: true, text: "Saqlandi." });
    } catch (e) {
      setMsg({ ok: false, text: errText(e) });
    } finally {
      setBusy(false);
    }
  }
  async function test() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await call<{ sent: number; failed: number; skipped: boolean }>("adminTestTelegram");
      setMsg(
        r.skipped
          ? { ok: false, text: "Telegram o'chirilgan yoki bot tokeni / chat ID kiritilmagan. Avval saqlang." }
          : { ok: r.failed === 0, text: `Yuborildi: ${r.sent} ta, xato: ${r.failed} ta.${r.failed ? " Chat ID yoki token to'g'ri ekanini va bot bilan suhbat boshlanganini tekshiring." : ""}` }
      );
    } catch (e) {
      setMsg({ ok: false, text: errText(e) });
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!data) return <Loading />;
  return (
    <div>
      <PageHeader title="Telegram sozlamalari" hint="Yangi arizalar shu chatlarga yuboriladi." />
      <div className={`${cardCls} max-w-2xl space-y-4`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Bildirishnomalar yoqilgan</span>
          <Toggle checked={enabled} onChange={setEnabled} label="Telegram bildirishnomalari" />
        </div>
        <Field label="Bot tokeni" hint={tokenSet ? "Token saqlangan (xavfsizlik uchun ko'rsatilmaydi). O'zgartirish uchun yangisini kiriting." : "Token hali kiritilmagan. @BotFather dan oling."}>
          <input type="password" autoComplete="off" className={inputCls} placeholder={tokenSet ? "••••••••••••" : "123456789:AA..."} value={token} onChange={(e) => setTokenVal(e.target.value)} />
        </Field>
        <Field label="Chat ID'lar" hint="Har biri alohida qatorda yoki vergul bilan. Bir nechta bo'lishi mumkin.">
          <textarea className={inputCls} rows={4} value={ids} onChange={(e) => setIds(e.target.value)} placeholder={"123456789\n987654321"} />
        </Field>
        {msg && (msg.ok ? <p role="status" className="rounded-xl bg-brand-50 p-3 text-sm text-brand-900">{msg.text}</p> : <ErrorBox message={msg.text} />)}
        <div className="flex gap-3">
          <button className={btnPrimary} onClick={save} disabled={busy}>Saqlash</button>
          <button className={btnGhost} onClick={test} disabled={busy}>Ulanishni tekshirish</button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Google integratsiyasi ----------------
interface Integ { spreadsheetName: string; spreadsheetUrl: string; webAppUrl: string; counts: Record<string, number | null>; missing: string[] }

export function Integration() {
  const { data, setData, error, load } = useLoad<Integ>("adminIntegration");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function run(action: string, okText: string) {
    setBusy(true);
    setMsg("");
    try {
      const r = await call<Integ | { ok: boolean }>(action);
      if ("counts" in r) setData(r);
      setMsg(okText);
    } catch (e) {
      setMsg(errText(e));
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!data) return <Loading />;
  const apiHost = (() => { try { return new URL(import.meta.env.VITE_API_URL as string).host; } catch { return "sozlanmagan"; } })();
  return (
    <div>
      <PageHeader title="Google integratsiyasi" hint="Ma'lumotlar bazasi — Google Sheets, backend — Google Apps Script." />
      <div className="max-w-2xl space-y-6">
        <div className={`${cardCls} space-y-2 text-sm`}>
          <p><span className="text-slate-500">Jadval:</span> <b>{data.spreadsheetName}</b> — <a className="text-brand-600 underline" href={data.spreadsheetUrl} target="_blank" rel="noreferrer">Sheets'da ochish</a></p>
          <p><span className="text-slate-500">API manzili (frontend):</span> {apiHost}</p>
          {data.missing.length > 0 && <ErrorBox message={`Yetishmayotgan sheet'lar: ${data.missing.join(", ")}. "Tuzilmani tekshirish" tugmasini bosing.`} />}
        </div>
        <div className={cardCls}>
          <h2 className="mb-3 font-semibold">Sheet'lardagi yozuvlar soni</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {Object.entries(data.counts).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-slate-100 py-1"><span>{k}</span><span className="font-medium">{v === null ? "yo'q" : v}</span></li>
            ))}
          </ul>
        </div>
        <div className={`${cardCls} space-y-3`}>
          <p className="text-sm text-slate-600">Sheets'da qo'lda o'zgartirishlar saytda ~1 daqiqada ko'rinadi. Darhol yangilash uchun keshni tozalang.</p>
          <div className="flex flex-wrap gap-3">
            <button className={btnPrimary} disabled={busy} onClick={() => run("adminClearCache", "Kesh yangilandi.")}>Keshni yangilash</button>
            <button className={btnGhost} disabled={busy} onClick={() => run("adminEnsureSchema", "Tuzilma tekshirildi.")}>Tuzilmani tekshirish</button>
          </div>
          {msg && <p role="status" className="text-sm text-slate-700">{busy ? "..." : msg}</p>}
        </div>
      </div>
    </div>
  );
}
