import { useState } from "react";
import { useSiteData } from "./hooks/useSiteData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Advantages from "./components/Advantages";
import Courses from "./components/Courses";
import CtaBand from "./components/CtaBand";
import Formats from "./components/Formats";
import Teachers from "./components/Teachers";
import Testimonials from "./components/Testimonials";
import Reviews from "./components/Reviews";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import ApplyForm from "./components/ApplyForm";
import Footer from "./components/Footer";
import FloatingCta from "./components/FloatingCta";
import { useRevealAll } from "./hooks/useReveal";
import { pickPhone } from "./lib/contact";

export default function App() {
  const { data, loading, error, retry } = useSiteData();
  const [preset, setPreset] = useState({ courseId: "", groupId: "", n: 0 });
  useRevealAll(data);

  if (loading) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-900 text-white/80" role="status">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-saffron" />
      <p>Yuklanmoqda...</p>
    </div>;
  if (error || !data) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Sahifani yuklab bo'lmadi. Iltimos, birozdan so'ng qayta urinib ko'ring.</p>
        <button onClick={retry} className="rounded-lg bg-brand-600 px-5 py-2.5 text-white">Qayta urinish</button>
      </div>
    );
  }

  const apply = (courseId: string, groupId = "") => {
    setPreset((p) => ({ courseId, groupId, n: p.n + 1 }));
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  const phone = pickPhone(data.settings.phones);

  return (
    <>
      <Header name={data.settings.academyName} phone={phone} />
      <main>
        <Hero settings={data.settings} heroCards={data.heroCards} groups={data.groups} phone={phone} />
        <Marquee name={data.settings.academyName} />
        <About name={data.settings.academyName} />
        <Advantages items={data.advantages} />
        <Courses courses={data.courses} groups={data.groups} onApply={apply} />
        <CtaBand name={data.settings.academyName} phone={phone} />
        <Formats formats={data.formats} />
        <Teachers teachers={data.teachers} name={data.settings.academyName} />
        <Testimonials items={data.testimonials} />
        <Reviews reviews={data.reviews} />
        <Faq items={data.faqs} phone={phone} name={data.settings.academyName} />
        <ApplyForm key={preset.n} courses={data.courses} groups={data.groups} formats={data.formats} presetCourse={preset.courseId} presetGroup={preset.groupId} callPhone={phone} telegram={data.settings.telegram} name={data.settings.academyName} />
        <Contact settings={data.settings} />
      </main>
      <Footer name={data.settings.academyName} phone={phone} />
      <FloatingCta phone={phone} />
    </>
  );
}
