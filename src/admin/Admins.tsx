import { useState } from "react";
import { call, Admin, Row, setToken } from "./adminApi";
import { useCached } from "./cache";
import { btnDanger, btnGhost, btnPrimary, btnSmall, cardCls, ErrorBox, errText, Field, fmtDate, inputCls, Loading, Modal, PageHeader, Toggle } from "./ui";

export default function Admins({ me }: { me: Admin }) {
  const { data: list, error, reload, mutate } = useCached<Row[]>("admins", () => call<Row[]>("adminListAdmins"));
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [resetFor, setResetFor] = useState<Row | null>(null);
  const [own, setOwn] = useState(false);

  // Optimistik: o'zgarish darhol ko'rinadi, xatoda qaytariladi
  function toggle(a: Row, v: boolean) {
    setNotice("");
    mutate((l) => (l ?? []).map((x) => (x.id === a.id ? { ...x, active: v } : x)));
    call("adminUpdateAdmin", { id: a.id, active: v }).catch((e) => { setNotice(errText(e)); reload(); });
  }
  function remove(a: Row) {
    if (!window.confirm(`${a.login} o'chirilsinmi?`)) return;
    setNotice("");
    mutate((l) => (l ?? []).filter((x) => x.id !== a.id));
    call("adminDeleteAdmin", { id: a.id }).catch((e) => { setNotice(errText(e)); reload(); });
  }

  return (
    <div>
      <PageHeader
        title="Adminlar"
        hint="Admin panelga kira oladigan foydalanuvchilar."
        actions={<div className="flex gap-2"><button className={btnGhost} onClick={() => setOwn(true)}>Parolimni o'zgartirish</button><button className={btnPrimary} onClick={() => setCreating(true)}>+ Admin qo'shish</button></div>}
      />
      {(notice || error) && <div className="mb-4"><ErrorBox message={notice || error} onRetry={reload} /></div>}
      {!list ? (!error && <Loading />) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr><th className="px-3 py-3 font-medium">Login</th><th className="px-3 py-3 font-medium">Yaratilgan</th><th className="px-3 py-3 font-medium">Faol</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((a) => (
                <tr key={a.id}>
                  <td className="px-3 py-2 font-medium">{a.login}{a.id === me.id && <span className="ml-2 text-xs text-slate-500">(siz)</span>}</td>
                  <td className="px-3 py-2">{fmtDate(a.created_at)}</td>
                  <td className="px-3 py-2"><Toggle checked={a.active} label="Faol" onChange={(v) => toggle(a, v)} /></td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button className={btnSmall} onClick={() => setResetFor(a)}>Parolni yangilash</button>
                      {a.id !== me.id && <button className={btnDanger} onClick={() => remove(a)}>O'chirish</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {creating && <CreateModal onClose={() => setCreating(false)} onDone={() => { setCreating(false); reload(); }} />}
      {resetFor && <ResetModal admin={resetFor} isMe={resetFor.id === me.id} onClose={() => setResetFor(null)} onDone={() => { setResetFor(null); reload(); }} />}
      {own && <OwnPasswordModal onClose={() => setOwn(false)} />}
    </div>
  );
}

function CreateModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setErr("");
    try { await call("adminCreateAdmin", { login, password }); onDone(); } catch (e) { setErr(errText(e)); setBusy(false); }
  }
  return (
    <Modal title="Yangi admin" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Login" hint="3–30 belgi: lotin harf, raqam, . _ -"><input className={inputCls} value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="off" /></Field>
        <Field label="Parol" hint="Kamida 8 ta belgi"><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></Field>
        {err && <ErrorBox message={err} />}
        <div className="flex justify-end gap-3"><button className={btnGhost} onClick={onClose}>Bekor qilish</button><button className={btnPrimary} onClick={submit} disabled={busy}>Qo'shish</button></div>
      </div>
    </Modal>
  );
}

function ResetModal({ admin, isMe, onClose, onDone }: { admin: Row; isMe: boolean; onClose: () => void; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setErr("");
    try {
      const r = await call<{ token: string | null }>("adminUpdateAdmin", { id: admin.id, password });
      if (isMe && r.token) setToken(r.token);
      onDone();
    } catch (e) { setErr(errText(e)); setBusy(false); }
  }
  return (
    <Modal title={`${admin.login}: yangi parol`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Yangi parol" hint="Kamida 8 ta belgi. Bu adminning eski sessiyalari tugaydi."><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></Field>
        {err && <ErrorBox message={err} />}
        <div className="flex justify-end gap-3"><button className={btnGhost} onClick={onClose}>Bekor qilish</button><button className={btnPrimary} onClick={submit} disabled={busy}>Saqlash</button></div>
      </div>
    </Modal>
  );
}

function OwnPasswordModal({ onClose }: { onClose: () => void }) {
  const [cur, setCur] = useState("");
  const [neu, setNeu] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setErr("");
    try {
      const r = await call<{ token: string | null }>("adminChangePassword", { currentPassword: cur, newPassword: neu });
      if (r.token) setToken(r.token);
      setOk(true);
    } catch (e) { setErr(errText(e)); }
    setBusy(false);
  }
  return (
    <Modal title="Parolimni o'zgartirish" onClose={onClose}>
      {ok ? (
        <div className="space-y-4"><p role="status" className="rounded-xl bg-brand-50 p-3 text-sm text-brand-900">Parol o'zgartirildi.</p><div className="flex justify-end"><button className={btnPrimary} onClick={onClose}>Yopish</button></div></div>
      ) : (
        <div className="space-y-4">
          <Field label="Joriy parol"><input type="password" className={inputCls} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></Field>
          <Field label="Yangi parol" hint="Kamida 8 ta belgi"><input type="password" className={inputCls} value={neu} onChange={(e) => setNeu(e.target.value)} autoComplete="new-password" /></Field>
          {err && <ErrorBox message={err} />}
          <div className="flex justify-end gap-3"><button className={btnGhost} onClick={onClose}>Bekor qilish</button><button className={btnPrimary} onClick={submit} disabled={busy}>Saqlash</button></div>
        </div>
      )}
    </Modal>
  );
}
