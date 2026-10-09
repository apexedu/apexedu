export const digitsOf = (s: string) => s.replace(/\D/g, "");

// Birinchi haqiqiy telefon raqamni tanlaydi (bo'lmasa — birinchisini)
export const pickPhone = (phones: string[]): string | undefined =>
  phones.find((p) => digitsOf(p).length >= 9) ?? phones[0];

export const telHref = (p: string) => `tel:${p.replace(/\s/g, "")}`;
