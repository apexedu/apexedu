import { useState } from "react";
import { useSiteData } from "./hooks/useSiteData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Courses from "./components/Courses";
import Teachers from "./components/Teachers";
import Formats from "./components/Formats";
import Advantages from "./components/Advantages";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import ApplyForm from "./components/ApplyForm";
import Footer from "./components/Footer";

export default function App() {
  const { data, loading, error, retry } = useSiteData();
  const [preset, setPreset] = useState({ courseId: "", groupId: "", n: 0 });

  if (loading) return <p className="p-10 text-center text-slate-600" role="status">Yuklanmoqda...</p>;
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
  const firstCourse = data.courses[0];

  return (
    <>
      <Header name={data.settings.academyName} />
      <main>
        <Hero settings={data.settings} course={firstCourse} groups={data.groups.filter((g) => g.courseId === firstCourse?.id)} />
        <About name={data.settings.academyName} />
        <Courses courses={data.courses} groups={data.groups} onApply={apply} />
        <Teachers teachers={data.teachers} />
        <Formats formats={data.formats} />
        <Advantages items={data.advantages} />
        <Testimonials items={data.testimonials} />
        <Faq items={data.faqs} />
        <ApplyForm key={preset.n} courses={data.courses} groups={data.groups} formats={data.formats} presetCourse={preset.courseId} presetGroup={preset.groupId} />
        <Contact settings={data.settings} />
      </main>
      <Footer name={data.settings.academyName} />
    </>
  );
}
