/** Arizalar va fikrlarni qabul qilish */

// Idempotentlik: mijoz so'rovni qayta yuborsa (timeout/tarmoq xatosi), ikkinchi yozuv yaratilmaydi
function seen_(reqId) {
  return reqId ? CacheService.getScriptCache().get('req_' + reqId) : null;
}
function remember_(reqId, id) {
  if (reqId) CacheService.getScriptCache().put('req_' + reqId, id, 21600);
}
function cleanReqId_(v) {
  return str_(v, 64).replace(/[^\w-]/g, '');
}

function submitApplication_(b) {
  const fullName = str_(b.fullName, 80);
  if (fullName.length < 2) throw new ValidationError('invalid_name');

  // Telefon: +998XXXXXXXXX ko'rinishida, probelsiz saqlanadi (Sheets va Telegram uchun)
  let digits = String(b.phone == null ? '' : b.phone).replace(/\D/g, '');
  if (digits.length === 9) digits = '998' + digits;
  if (digits.length !== 12 || digits.indexOf('998') !== 0) throw new ValidationError('invalid_phone');
  const phone = '+' + digits;

  // Tekshiruv keshlangan public ma'lumot orqali (har safar 3 ta sheet o'qilmaydi)
  const pub = getPublicData_();
  const course = pub.courses.find(c => c.id === String(b.courseId));
  if (!course) throw new ValidationError('invalid_course');
  let group = null;
  if (b.groupId) {
    group = pub.groups.find(g => g.id === String(b.groupId) && g.courseId === course.id);
    if (!group) throw new ValidationError('invalid_group');
  }
  let format = null;
  if (b.formatId) {
    format = pub.formats.find(f => f.id === String(b.formatId));
    if (!format) throw new ValidationError('invalid_format');
  }
  let age = '';
  if (b.age !== '' && b.age != null) {
    const n = parseInt(b.age, 10);
    if (!(n >= 3 && n <= 100)) throw new ValidationError('invalid_age');
    age = String(n);
  }

  const comment = str_(b.comment, 500);
  const source = str_(b.source, 100) || 'direct';
  const utmSource = str_(b.utmSource, 100);
  const utmMedium = str_(b.utmMedium, 100);
  const utmCampaign = str_(b.utmCampaign, 100);

  const reqId = cleanReqId_(b.requestId);
  const early = seen_(reqId);
  if (early) return { id: early };

  const cache = CacheService.getScriptCache();
  const rlKey = 'rl_' + digits;
  if (cache.get(rlKey)) throw new ValidationError('rate_limited');

  const now = new Date();
  let id, duplicate = false;
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const again = seen_(reqId); // kutish paytida birinchi so'rov tugagan bo'lishi mumkin
    if (again) {
      id = again;
      duplicate = true;
    } else {
      const props = PropertiesService.getScriptProperties();
      const seq = Number(props.getProperty('APP_SEQ') || '0') + 1;
      props.setProperty('APP_SEQ', String(seq));
      id = 'APP-' + String(seq).padStart(5, '0');
      appendRow_('Applications', [
        id, nowIso_(now), cell_(fullName), phone, course.name,
        group ? group.name : '', format ? format.name : '',
        age, cell_(comment), cell_(source), cell_(utmSource), cell_(utmMedium), cell_(utmCampaign),
      ]);
      remember_(reqId, id);
      cache.put(rlKey, '1', 60);
    }
  } finally {
    lock.releaseLock();
  }
  if (duplicate) return { id: id };

  // Telegram xatosi arizani bekor qilmaydi (ariza allaqachon saqlangan)
  try {
    sendTelegram_(buildApplicationMessage_({
      id: id, date: now, fullName: fullName, phone: phone, course: course.name,
      group: group ? group.name : '', format: format ? format.name : '',
      age: age, comment: comment, source: source,
    }));
  } catch (err) {
    console.error('Telegram yuborishda xato: ' + err.message);
  }
  return { id: id };
}

function submitReview_(b) {
  const name = str_(b.name, 60);
  const text = str_(b.text, 500);
  const rating = parseInt(b.rating, 10);
  if (name.length < 2) throw new ValidationError('invalid_name');
  if (text.length < 10) throw new ValidationError('invalid_text');
  if (!(rating >= 1 && rating <= 5)) throw new ValidationError('invalid_rating');

  const reqId = cleanReqId_(b.requestId);
  const early = seen_(reqId);
  if (early) return { id: early };

  const cache = CacheService.getScriptCache();
  const rlKey = 'rlr_' + name.toLowerCase().replace(/\s+/g, '').slice(0, 40);
  if (cache.get(rlKey)) throw new ValidationError('rate_limited');

  const now = new Date();
  let id;
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const again = seen_(reqId);
    if (again) return { id: again };
    const props = PropertiesService.getScriptProperties();
    const seq = Number(props.getProperty('REV_SEQ') || '0') + 1;
    props.setProperty('REV_SEQ', String(seq));
    id = 'REV-' + String(seq).padStart(5, '0');
    // approved = FALSE: admin tasdiqlamaguncha saytda ko'rinmaydi
    appendRow_('Reviews', [id, nowIso_(now), cell_(name), rating, cell_(text), false]);
    remember_(reqId, id);
    cache.put(rlKey, '1', 60);
  } finally {
    lock.releaseLock();
  }
  return { id: id };
}
