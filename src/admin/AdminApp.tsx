import { FormEvent, useCallback, useEffect, useState } from "react";
import { Admin, call, getToken, setToken } from "./adminApi";
import { clearAll, fetchApplications, revalidate, startInit } from "./cache";
import { btnPrimary, ErrorBox, errText, Field, inputCls, Loading } from "./ui";
import CrudPage, { CrudConfig } from "./CrudPage";
import Dashboard from "./Dashboard";
import Applications from "./Applications";
import Admins from "./Admins";
import { GeneralSettings, Integration, TelegramSettings } from "./SettingsPages";
import { advantages, courses, faq, formats, groups, heroCards, reviews, teachers, testimonials } from "./crudConfigs";

function AdminLogo({ light }: { light?: boolean }) {
  const [failed, setFailed] = useState(false);
  // Admin /admin/ papkasida turadi, shuning uchun logo "../assets/logo.png"
  return failed ? (
    <span className={`text-lg font-bold ${light ? "text-white" : "text-brand-600"}`}>ApexEdu</span>
  ) : (
    <span className="inline-block rounded-lg bg-white px-2 py-1">
      <img src="../assets/logo.png" alt="ApexEdu" className="h-9 w-auto" onError={() => setFailed(true)} />
    </span>
  );
}

function Login({ onLogin }: { onLogin: (a: Admin) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await call<{ token: string; admin: Admin }>("adminLogin", { login, password });
      setToken(r.token);
      onLogin(r.admin);
    } catch (e2) {
      setErr(errText(e2));
      setBusy(false);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between"><AdminLogo /><span className="text-sm text-slate-500">Admin panel</span></div>
        <Field label="Login"><input className={inputCls} value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" autoFocus /></Field>
        <Field label="Parol"><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></Field>
        {err && <ErrorBox message={err} />}
        <button type="submit" className={`${btnPrimary} w-full`} disabled={busy || !login || !password}>{busy ? "Tekshirilmoqda..." : "Kirish"}</button>
      </form>
    </div>
  );
}

interface NavItem { path: string; label: string; el: (me: Admin) => JSX.Element }
const crud = (cfg: CrudConfig) => () => <CrudPage key={cfg.sheet} cfg={cfg} />;

const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Asosiy", items: [
    { path: "/dashboard", label: "Dashboard", el: () => <Dashboard /> },
    { path: "/applications", label: "Arizalar", el: () => <Applications /> },
  ] },
  { group: "Sayt kontenti", items: [
    { path: "/courses", label: "Kurslar", el: crud(courses) },
    { path: "/groups", label: "Guruhlar", el: crud(groups) },
    { path: "/teachers", label: "O'qituvchilar", el: crud(teachers) },
    { path: "/formats", label: "Formatlar", el: crud(formats) },
    { path: "/advantages", label: "Afzalliklar", el: crud(advantages) },
    { path: "/results", label: "Natijalar", el: crud(testimonials) },
    { path: "/faq", label: "FAQ", el: crud(faq) },
    { path: "/reviews", label: "Fikrlar", el: crud(reviews) },
    { path: "/hero", label: "Bosh sahifa kartasi", el: crud(heroCards) },
  ] },
  { group: "Sozlamalar", items: [
    { path: "/settings", label: "Umumiy va aloqa", el: () => <GeneralSettings /> },
    { path: "/telegram", label: "Telegram", el: () => <TelegramSettings /> },
    { path: "/integration", label: "Google integratsiyasi", el: () => <Integration /> },
    { path: "/admins", label: "Adminlar", el: (me) => <Admins me={me} /> },
  ] },
];
const ALL = NAV.flatMap((g) => g.items);

function useRoute() {
  const read = () => location.hash.replace(/^#/, "") || "/dashboard";
  const [path, setPath] = useState(read);
  useEffect(() => {
    const f = () => setPath(read());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return path;
}

function Shell({ me, onLogout }: { me: Admin; onLogout: () => void }) {
  const path = useRoute();
  const [open, setOpen] = useState(false);
  const page = ALL.find((p) => p.path === path) ?? ALL[0];
  useEffect(() => setOpen(false), [path]);

  return (
    <div className="min-h-screen lg:flex">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto bg-brand-900 p-4 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-6 flex items-center justify-between"><AdminLogo light /><span className="text-xs text-white/60">Admin</span></div>
        <nav className="flex-1 space-y-5" aria-label="Admin menyu">
          {NAV.map((g) => (
            <div key={g.group}>
              <p className="mb-1 px-3 text-xs uppercase tracking-wide text-white/50">{g.group}</p>
              {g.items.map((it) => (
                <a key={it.path} href={`#${it.path}`} className={`block rounded-lg px-3 py-2 text-sm ${it.path === page.path ? "bg-white/15 font-medium" : "text-white/80 hover:bg-white/10"}`}>{it.label}</a>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-6 border-t border-white/15 pt-4 text-sm">
          <p className="mb-2 text-white/70">{me.login}</p>
          <button className="rounded-lg border border-white/30 px-3 py-1.5 hover:bg-white/10" onClick={onLogout}>Chiqish</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm" onClick={() => setOpen(true)} aria-label="Menyuni ochish">Menyu</button>
          <span className="text-sm font-medium">{page.label}</span>
        </div>
        <main className="p-4 sm:p-8">{page.el(me)}</main>
      </div>
    </div>
  );
}

const ME_KEY = "apexedu:admin:me";
const readMe = (): Admin | null => {
  try { return getToken() ? (JSON.parse(localStorage.getItem(ME_KEY) ?? "null") as Admin | null) : null; } catch { return null; }
};
const storeMe = (a: Admin | null) => {
  try { if (a) localStorage.setItem(ME_KEY, JSON.stringify(a)); else localStorage.removeItem(ME_KEY); } catch { /* ignore */ }
};

export default function AdminApp() {
  // Oldin kirgan bo'lsa, panel darhol ko'rinadi; tasdiqlash va ma'lumotlar fonda bitta so'rovda (adminInit) keladi
  const [me, setMe] = useState<Admin | null>(readMe);
  const [booting, setBooting] = useState(() => !!getToken() && !readMe());
  const [fatal, setFatal] = useState("");

  const boot = useCallback(() => {
    if (!getToken()) { setBooting(false); return; }
    setFatal("");
    startInit((a) => { setMe(a); storeMe(a); })
      .catch((e) => { if (getToken()) setFatal(errText(e)); })
      .finally(() => setBooting(false));
    // Dashboard uchun arizalar parallel yuklanadi
    revalidate("applications", fetchApplications, 30000).catch(() => undefined);
  }, []);
  useEffect(boot, [boot]);

  useEffect(() => {
    const f = () => { clearAll(); storeMe(null); setMe(null); };
    window.addEventListener("admin:logout", f);
    return () => window.removeEventListener("admin:logout", f);
  }, []);

  if (booting && !me) return <Loading text="Yuklanmoqda..." />;
  if (fatal && !me) return <div className="p-8"><ErrorBox message={fatal} onRetry={boot} /></div>;
  if (!me) return <Login onLogin={(a) => { setMe(a); storeMe(a); boot(); }} />;
  return <Shell me={me} onLogout={() => { setToken(null); clearAll(); storeMe(null); setMe(null); }} />;
}
