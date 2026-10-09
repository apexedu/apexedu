/** Sheets bilan ishlash va public ma'lumotlarni yig'ish */
function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function readRows_(name) {
  const sh = ss_().getSheetByName(name);
  if (!sh) return [];
  const v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  const head = v[0];
  return v.slice(1)
    .filter(r => String(r[0]) !== '')
    .map(r => { const o = {}; head.forEach((k, i) => { o[k] = r[i]; }); return o; });
}

function activeSorted_(name) {
  return readRows_(name)
    .filter(r => isTrue_(r.active))
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

function appendRow_(name, values) {
  ss_().getSheetByName(name).appendRow(values);
}

const PUBLIC_CACHE_KEY = 'public_v1';

function clearPublicCache_() {
  CacheService.getScriptCache().remove(PUBLIC_CACHE_KEY);
}

function getPublicData_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get(PUBLIC_CACHE_KEY);
  if (hit) return JSON.parse(hit);

  const s = {};
  readRows_('Settings').forEach(r => { s[String(r.key)] = r.value; });
  let stats = [];
  try { stats = JSON.parse(s.stats || '[]'); } catch (e) { stats = []; }

  const data = {
    settings: {
      academyName: String(s.academyName || 'ApexEdu Academy'),
      heroTitle: String(s.heroTitle || ''),
      heroText: String(s.heroText || ''),
      phones: String(s.phones || '').split(/[\n,;]+/).map(x => x.trim()).filter(Boolean),
      telegram: String(s.telegram || '').replace(/^@/, ''),
      address: String(s.address || ''),
      workingHours: String(s.workingHours || ''),
      mapUrl: String(s.mapUrl || ''),
      instagram: String(s.instagram || ''),
      facebook: String(s.facebook || ''),
      youtube: String(s.youtube || ''),
      stats: stats,
    },
    courses: activeSorted_('Courses').map(r => ({ id: String(r.id), name: String(r.name), description: String(r.description) })),
    groups: activeSorted_('Groups').map(r => ({ id: String(r.id), courseId: String(r.course_id), name: String(r.name), description: String(r.description), schedule: String(r.schedule) })),
    heroCards: activeSorted_('HeroCards').map(r => ({ id: String(r.id), title: String(r.title), courseId: String(r.course_id) })),
    teachers: activeSorted_('Teachers').map(r => ({ id: String(r.id), fullName: String(r.full_name), position: String(r.position), bio: String(r.bio), photo: r.photo_url ? String(r.photo_url) : undefined })),
    formats: activeSorted_('Formats').map(r => ({ id: String(r.id), name: String(r.name), description: String(r.description) })),
    advantages: activeSorted_('Advantages').map(r => ({ id: String(r.id), title: String(r.title), text: String(r.text) })),
    testimonials: activeSorted_('Testimonials').map(r => ({ id: String(r.id), name: String(r.name), result: String(r.result), text: String(r.text) })),
    faqs: activeSorted_('FAQ').map(r => ({ id: String(r.id), question: String(r.question), answer: String(r.answer) })),
    reviews: readRows_('Reviews')
      .filter(r => isTrue_(r.approved))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, 20)
      .map(r => ({ id: String(r.id), name: String(r.name), rating: Number(r.rating) || 5, text: String(r.text), date: String(r.created_at).slice(0, 10) })),
  };

  try { cache.put(PUBLIC_CACHE_KEY, JSON.stringify(data), 600); } catch (e) { /* kesh to'lsa — e'tibor bermaymiz */ }
  return data;
}
