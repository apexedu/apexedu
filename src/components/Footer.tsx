import Logo from "./Logo";

export default function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-brand-900 py-8 text-sm text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
        <div className="rounded-xl bg-white px-4 py-2">
          <Logo name={name} className="h-14 w-auto" />
        </div>
        <p>© {new Date().getFullYear()} {name}</p>
      </div>
    </footer>
  );
}
