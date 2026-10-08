import Logo from "./Logo";

export default function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-brand-900 py-8 text-sm text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 sm:flex-row sm:items-center sm:px-6">
        <Logo name={name} light />
        <p>© {new Date().getFullYear()} {name}</p>
      </div>
    </footer>
  );
}
