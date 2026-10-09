/**
 * BIR MARTA qo'lda ishga tushiriladi: setup()
 * Kerakli sheet'larni, sarlavhalarni va formatni yaratadi, bo'sh sheet'larga namunaviy ma'lumot qo'yadi.
 * Qayta ishga tushirsangiz ham mavjud ma'lumotni o'chirmaydi.
 */
const SEED = {
  Courses: [
    ['c1', 'Turk tili', 'Noldan CEFR sertifikatigacha: grammatika, nutq va imtihonga tayyorgarlik.', 1, true],
    ['c2', 'Ingliz tili', 'Umumiy ingliz tili va suhbat amaliyoti.', 2, true],
  ],
  Groups: [
    ['g1', 'c1', 'A1–A2', "Boshlang'ich daraja: asosiy grammatika va kundalik iboralar.", 'Haftada 3 marta, 90 daqiqa', 1, true],
    ['g2', 'c1', 'B1–B2', "O'rta daraja: erkin yozish va tushunish.", 'Haftada 3 marta, 90 daqiqa', 2, true],
    ['g3', 'c1', 'CEFR', 'Xalqaro imtihonga maqsadli tayyorgarlik.', 'Haftada 4 marta, 120 daqiqa', 3, true],
    ['g4', 'c1', "So'zlashuv", "Nutqni rivojlantirish va so'zlashuv klubi.", 'Haftada 2 marta, 90 daqiqa', 4, true],
    ['g5', 'c2', 'Beginner', 'Noldan boshlovchilar uchun.', 'Haftada 3 marta, 90 daqiqa', 1, true],
    ['g6', 'c2', 'Intermediate', 'Mavjud bilimlarni mustahkamlash.', 'Haftada 3 marta, 90 daqiqa', 2, true],
  ],
  Teachers: [
    ['t1', 'Ismi Familiyasi', "Turk tili o'qituvchisi", "Turkiyada ta'lim olgan, 6 yillik o'qitish tajribasi. (Vaqtincha matn)", '', 1, true],
    ['t2', 'Ismi Familiyasi', "CEFR imtihon bo'yicha mutaxassis", "Imtihon strategiyasi va yozma nutq bo'yicha mentor. (Vaqtincha matn)", '', 2, true],
    ['t3', 'Ismi Familiyasi', "Ingliz tili o'qituvchisi", "Suhbat va grammatikani uyg'unlashtiruvchi metodika. (Vaqtincha matn)", '', 3, true],
  ],
  HeroCards: [
    ['h1', "Turk tili: daraja yo'li", 'c1', 1, true],
    ['h2', "Ingliz tili: daraja yo'li", 'c2', 2, true],
  ],
  Formats: [
    ['f1', 'Offline', 'Markazda, kichik guruhda jonli muloqot bilan.', 1, true],
    ['f2', 'Online', 'Istalgan joydan jonli darslar, yozuvlar va chat orqali yordam.', 2, true],
  ],
  Advantages: [
    ['a1', 'Kichik guruhlar', "Har bir talabaga yetarlicha e'tibor beriladi.", 1, true],
    ['a2', 'Aniq daraja tizimi', "A1 dan CEFR gacha — qayerdan boshlashni birga aniqlaymiz.", 2, true],
    ['a3', 'Amaliy nutq', 'Darsning katta qismi gapirish va tinglashga ajratiladi.', 3, true],
    ['a4', 'Bepul konsultatsiya', 'Darajangizga mos guruhni tanlashda yordam beramiz.', 4, true],
  ],
  Testimonials: [
    ['r1', 'Talaba ismi', 'B1 darajasi, 6 oyda', "Darslar tushunarli va tartibli o'tdi. (Vaqtincha sharh)", 1, true],
    ['r2', 'Talaba ismi', 'CEFR imtihoni topshirildi', 'Imtihonga tayyorgarlik juda aniq tuzilgan edi. (Vaqtincha sharh)', 2, true],
  ],
  FAQ: [
    ['q1', "Noldan boshlasam bo'ladimi?", "Ha. A1–A2 guruhi aynan noldan boshlovchilar uchun mo'ljallangan.", 1, true],
    ['q2', 'Darajamni qanday bilaman?', "Ariza qoldiring — qisqa suhbat orqali darajangizni bepul aniqlaymiz.", 2, true],
    ['q3', "Online va offline farqi nima?", "Dastur bir xil. Farqi faqat darsda qatnashish usulida.", 3, true],
    ['q4', "Dars narxi qancha?", "Narx guruh va formatga bog'liq. Aniq ma'lumot uchun biz bilan bog'laning.", 4, true],
  ],
  Reviews: [
    ['v1', '2026-09-12T10:00:00+05:00', 'Talaba ismi', 5, "Darslar qiziqarli, o'qituvchilar har bir savolga javob beradi. (Vaqtincha sharh)", true],
    ['v2', '2026-09-20T10:00:00+05:00', 'Talaba ismi', 5, "Online formatda ham juda qulay o'qidim. (Vaqtincha sharh)", true],
  ],
  Settings: [
    ['academyName', 'ApexEdu Academy'],
    ['heroTitle', "Turk tilini tizimli va ishonch bilan o'rganing"],
    ['heroText', "Kichik guruhlar, tajribali o'qituvchilar va aniq daraja tizimi. Offline yoki online — o'zingizga qulay formatni tanlang."],
    ['phones', '+998 XX XXX XX XX\n+998 XX XXX XX XX'],
    ['telegram', 'apexedu_admin'],
    ['address', 'Toshkent shahri, manzil keyinroq kiritiladi'],
    ['workingHours', 'Dushanba–Shanba, 09:00–19:00'],
    ['mapUrl', 'https://www.google.com/maps/search/?api=1&query=Tashkent'],
    ['instagram', ''],
    ['facebook', ''],
    ['youtube', ''],
    ['stats', '[{"value":"500+","label":"bitiruvchi"},{"value":"5 yil","label":"tajriba"},{"value":"4","label":"daraja guruhi"}]'],
  ],
};

function setup() {
  const ss = ss_();
  Object.keys(SCHEMA).forEach(name => {
    const cols = SCHEMA[name];
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    const rows = Math.max(sh.getMaxRows() - 1, 1);
    cols.forEach((c, i) => {
      if (NON_TEXT_COLS.indexOf(c) === -1) sh.getRange(2, i + 1, rows, 1).setNumberFormat('@');
    });
    if (SEED[name] && sh.getLastRow() <= 1) {
      sh.getRange(2, 1, SEED[name].length, cols.length).setValues(SEED[name]);
    }
  });
  // Mavjud Settings'ga yangi kalitlarni qo'shish (setup() qayta ishga tushirilganda)
  const st = ss.getSheetByName('Settings');
  const have = readRows_('Settings').map(r => String(r.key));
  SEED.Settings.forEach(r => { if (have.indexOf(r[0]) < 0) st.appendRow(r); });
  // Standart bo'sh varaqni olib tashlash
  ss.getSheets().forEach(s => {
    if (!SCHEMA[s.getName()] && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
  clearPublicCache_();
  console.log('setup() yakunlandi');
}
