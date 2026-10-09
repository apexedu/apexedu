/** ApexEdu backend — umumiy yordamchi funksiyalar va konfiguratsiya */
const TZ = 'Asia/Tashkent';

// Har bir sheet va uning ustunlari (birinchi qator — sarlavha)
const SCHEMA = {
  Applications: ['id', 'created_at', 'full_name', 'phone', 'course', 'group', 'format', 'age', 'comment', 'source', 'utm_source', 'utm_medium', 'utm_campaign'],
  Courses: ['id', 'name', 'description', 'order', 'active'],
  Groups: ['id', 'course_id', 'name', 'description', 'schedule', 'order', 'active'],
  Teachers: ['id', 'full_name', 'position', 'bio', 'photo_url', 'order', 'active'],
  Formats: ['id', 'name', 'description', 'order', 'active'],
  Advantages: ['id', 'title', 'text', 'order', 'active'],
  HeroCards: ['id', 'title', 'course_id', 'order', 'active'],
  Testimonials: ['id', 'name', 'result', 'text', 'order', 'active'],
  FAQ: ['id', 'question', 'answer', 'order', 'active'],
  Reviews: ['id', 'created_at', 'name', 'rating', 'text', 'approved'],
  Settings: ['key', 'value'],
  Admins: ['id', 'login', 'password_hash', 'salt', 'active', 'created_at'], // 3-bosqichda ishlatiladi
};
// Shu ustunlardan boshqalari oddiy matn (@) formatida saqlanadi
const NON_TEXT_COLS = ['order', 'active', 'rating', 'approved'];

class ValidationError extends Error {}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function str_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}
// Excel/Sheets formula inyeksiyasidan himoya
function cell_(s) {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}
function isTrue_(v) {
  return String(v).toUpperCase() === 'TRUE';
}
function nowIso_(d) {
  return Utilities.formatDate(d, TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
