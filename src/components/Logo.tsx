import { useState } from "react";

interface Props { name: string; className?: string }

// Logo faylini almashtirish uchun: public/assets/logo.png
export default function Logo({ name, className = "h-16 w-auto sm:h-20" }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="text-lg font-bold text-brand-600">{name}</span>;
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/logo.png`}
      alt={name}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
