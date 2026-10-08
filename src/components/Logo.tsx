import { useState } from "react";

// Logo faylini almashtirish uchun: public/assets/logo.png
export default function Logo({ name, light }: { name: string; light?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={`text-lg font-bold ${light ? "text-white" : "text-brand-600"}`}>{name}</span>;
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/logo.png`}
      alt={name}
      className="h-18 w-auto sm:h-20"
      onError={() => setFailed(true)}
    />
  );
}
