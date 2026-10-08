import type { SiteData } from "../types";

// VAQTINCHALIK MA'LUMOTLAR (1-bosqich). 2-bosqichda Google Sheets'dan keladi.
export const mockSiteData: SiteData = {
  settings: {
    academyName: "ApexEdu Academy",
    heroTitle: "Turk tilini tizimli va ishonch bilan o'rganing",
    heroText:
      "Kichik guruhlar, tajribali o'qituvchilar va aniq daraja tizimi. Offline yoki online — o'zingizga qulay formatni tanlang.",
    phones: ["+998 XX XXX XX XX", "+998 XX XXX XX XX"],
    telegram: "apexedu_admin",
    address: "Toshkent shahri, manzil keyinroq kiritiladi",
    workingHours: "Dushanba–Shanba, 09:00–19:00",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Tashkent",
    stats: [
      { value: "500+", label: "bitiruvchi" },
      { value: "5 yil", label: "tajriba" },
      { value: "4", label: "daraja guruhi" },
    ],
  },
  courses: [
    { id: "c1", name: "Turk tili", description: "Noldan CEFR sertifikatigacha: grammatika, nutq va imtihonga tayyorgarlik." },
    { id: "c2", name: "Ingliz tili", description: "Umumiy ingliz tili va suhbat amaliyoti." },
  ],
  groups: [
    { id: "g1", courseId: "c1", name: "A1–A2", description: "Boshlang'ich daraja: asosiy grammatika va kundalik iboralar.", schedule: "Haftada 3 marta, 90 daqiqa" },
    { id: "g2", courseId: "c1", name: "B1–B2", description: "O'rta daraja: erkin yozish va tushunish.", schedule: "Haftada 3 marta, 90 daqiqa" },
    { id: "g3", courseId: "c1", name: "CEFR", description: "Xalqaro imtihonga maqsadli tayyorgarlik.", schedule: "Haftada 4 marta, 120 daqiqa" },
    { id: "g4", courseId: "c1", name: "So'zlashuv", description: "Nutqni rivojlantirish va so'zlashuv klubi.", schedule: "Haftada 2 marta, 90 daqiqa" },
    { id: "g5", courseId: "c2", name: "Beginner", description: "Noldan boshlovchilar uchun.", schedule: "Haftada 3 marta, 90 daqiqa" },
    { id: "g6", courseId: "c2", name: "Intermediate", description: "Mavjud bilimlarni mustahkamlash.", schedule: "Haftada 3 marta, 90 daqiqa" },
  ],
  teachers: [
    { id: "t1", fullName: "Ismi Familiyasi", position: "Turk tili o'qituvchisi", bio: "Turkiyada ta'lim olgan, 6 yillik o'qitish tajribasi. (Vaqtincha matn)" },
    { id: "t2", fullName: "Ismi Familiyasi", position: "CEFR imtihon bo'yicha mutaxassis", bio: "Imtihon strategiyasi va yozma nutq bo'yicha mentor. (Vaqtincha matn)" },
    { id: "t3", fullName: "Ismi Familiyasi", position: "Ingliz tili o'qituvchisi", bio: "Suhbat va grammatikani uyg'unlashtiruvchi metodika. (Vaqtincha matn)" },
  ],
  formats: [
    { id: "f1", name: "Offline", description: "Markazda, kichik guruhda jonli muloqot bilan." },
    { id: "f2", name: "Online", description: "Istalgan joydan jonli darslar, yozuvlar va chat orqali yordam." },
  ],
  advantages: [
    { id: "a1", title: "Kichik guruhlar", text: "Har bir talabaga yetarlicha e'tibor beriladi." },
    { id: "a2", title: "Aniq daraja tizimi", text: "A1 dan CEFR gacha — qayerdan boshlashni birga aniqlaymiz." },
    { id: "a3", title: "Amaliy nutq", text: "Darsning katta qismi gapirish va tinglashga ajratiladi." },
    { id: "a4", title: "Bepul konsultatsiya", text: "Darajangizga mos guruhni tanlashda yordam beramiz." },
  ],
  testimonials: [
    { id: "r1", name: "Talaba ismi", result: "B1 darajasi, 6 oyda", text: "Darslar tushunarli va tartibli o'tdi. (Vaqtincha sharh)" },
    { id: "r2", name: "Talaba ismi", result: "CEFR imtihoni topshirildi", text: "Imtihonga tayyorgarlik juda aniq tuzilgan edi. (Vaqtincha sharh)" },
  ],
  faqs: [
    { id: "q1", question: "Noldan boshlasam bo'ladimi?", answer: "Ha. A1–A2 guruhi aynan noldan boshlovchilar uchun mo'ljallangan." },
    { id: "q2", question: "Darajamni qanday bilaman?", answer: "Ariza qoldiring — qisqa suhbat orqali darajangizni bepul aniqlaymiz." },
    { id: "q3", question: "Online va offline farqi nima?", answer: "Dastur bir xil. Farqi faqat darsda qatnashish usulida." },
    { id: "q4", question: "Dars narxi qancha?", answer: "Narx guruh va formatga bog'liq. Aniq ma'lumot uchun biz bilan bog'laning." },
  ],
  reviews: [
    { id: "v1", name: "Talaba ismi", rating: 5, text: "Darslar qiziqarli, o'qituvchilar har bir savolga javob beradi. (Vaqtincha sharh)", date: "2026-09-12" },
    { id: "v2", name: "Talaba ismi", rating: 5, text: "Online formatda ham juda qulay o'qidim. (Vaqtincha sharh)", date: "2026-09-20" },
    { id: "v3", name: "Ota-ona ismi", rating: 4, text: "Farzandim uchun guruhni to'g'ri tanlab berishdi. (Vaqtincha sharh)", date: "2026-09-28" },
  ],
};
