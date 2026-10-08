import Section from "./Section";

export default function About({ name }: { name: string }) {
  return (
    <Section id="about" title={`${name} haqida`}>
      <div className="grid gap-8 md:grid-cols-2">
        <p className="leading-relaxed text-slate-700">
          Biz tilni yodlash emas, ishlatish orqali o'rgatamiz. Har bir guruh darajasiga mos dastur bilan ishlaydi,
          shuning uchun talaba o'z tezligida va tushunib oldinga siljiydi.
        </p>
        <p className="leading-relaxed text-slate-700">
          Darslar kichik guruhlarda o'tadi. O'qituvchi har bir talabaning xatosini ko'radi va darhol to'g'rilaydi.
          Maqsad — sertifikat olish, o'qish yoki ishlash uchun tilni haqiqatan ham bilish.
        </p>
      </div>
    </Section>
  );
}
