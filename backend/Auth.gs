/** Admin autentifikatsiyasi: parol xeshi, imzolangan token, adminlarni boshqarish */
const HASH_ROUNDS = 800;
const TOKEN_TTL_SEC = 7 * 24 * 3600;

function hex_(bytes) {
  return bytes.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}
function newSalt_() {
  return Utilities.getUuid().replace(/-/g, '');
}
function hashPassword_(password, salt) {
  let h = salt + ':' + password;
  for (let i = 0; i < HASH_ROUNDS; i++) {
    h = hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + salt, Utilities.Charset.UTF_8));
  }
  return h;
}
function safeEqual_(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function tokenSecret_() {
  const p = PropertiesService.getScriptProperties();
  let s = p.getProperty('TOKEN_SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('TOKEN_SECRET', s); }
  return s;
}
function signToken_(obj) {
  const p = Utilities.base64EncodeWebSafe(JSON.stringify(obj));
  const sig = Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(p, tokenSecret_()));
  return p + '.' + sig;
}
function readToken_(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length !== 2) return null;
    const sig = Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(parts[0], tokenSecret_()));
    if (!safeEqual_(sig, parts[1])) return null;
    const payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());
    if (!payload.e || payload.e < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
// h — parol xeshining boshlanishi: parol o'zgarsa eski tokenlar yaroqsiz bo'ladi
function issueToken_(id, passwordHash) {
  return signToken_({ i: String(id), h: String(passwordHash).slice(0, 12), e: Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC });
}

const ADMINS_CACHE_KEY = 'admins_v1';
function clearAdminsCache_() { CacheService.getScriptCache().remove(ADMINS_CACHE_KEY); }
function adminsLite_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get(ADMINS_CACHE_KEY);
  if (hit) return JSON.parse(hit);
  const list = readRows_('Admins').map(r => ({ id: String(r.id), login: String(r.login), active: isTrue_(r.active), h: String(r.password_hash).slice(0, 12) }));
  cache.put(ADMINS_CACHE_KEY, JSON.stringify(list), 300);
  return list;
}

function authenticate_(token) {
  const p = readToken_(token);
  if (!p) throw new ValidationError('unauthorized');
  const a = adminsLite_().find(x => x.id === p.i);
  if (!a || !a.active || a.h !== p.h) throw new ValidationError('unauthorized');
  return a;
}

function adminLogin_(b) {
  const login = str_(b.login, 60).toLowerCase();
  const pw = String(b.password == null ? '' : b.password).slice(0, 200);
  const cache = CacheService.getScriptCache();
  const key = 'lf_' + login.replace(/[^\w.-]/g, '');
  const fails = Number(cache.get(key) || '0');
  if (fails >= 5) throw new ValidationError('too_many_attempts');

  const row = readRows_('Admins').find(r => String(r.login).toLowerCase() === login && isTrue_(r.active));
  const ok = row && safeEqual_(hashPassword_(pw, String(row.salt)), String(row.password_hash));
  if (!ok) {
    cache.put(key, String(fails + 1), 900);
    Utilities.sleep(400);
    throw new ValidationError('invalid_credentials');
  }
  cache.remove(key);
  return { token: issueToken_(row.id, row.password_hash), admin: { id: String(row.id), login: String(row.login) } };
}

/** BIR MARTA qo'lda: Script Properties'ga INITIAL_ADMIN_LOGIN va INITIAL_ADMIN_PASSWORD qo'ying, so'ng shuni ishga tushiring. */
function createFirstAdmin() {
  const p = PropertiesService.getScriptProperties();
  const login = p.getProperty('INITIAL_ADMIN_LOGIN');
  const pw = p.getProperty('INITIAL_ADMIN_PASSWORD');
  if (!login || !pw) throw new Error("Script Properties'da INITIAL_ADMIN_LOGIN va INITIAL_ADMIN_PASSWORD kerak");
  if (readRows_('Admins').length) throw new Error('Admin allaqachon mavjud');
  createAdminRow_(login, pw);
  p.deleteProperty('INITIAL_ADMIN_LOGIN');
  p.deleteProperty('INITIAL_ADMIN_PASSWORD');
  console.log("Birinchi admin yaratildi, vaqtincha sozlamalar o'chirildi");
}

function validateLogin_(login) {
  if (!/^[A-Za-z0-9._-]{3,30}$/.test(login)) throw new ValidationError('invalid_login');
}
function validatePassword_(pw) {
  if (pw.length < 8 || pw.length > 100) throw new ValidationError('weak_password');
}
function createAdminRow_(loginRaw, password) {
  const login = str_(loginRaw, 30);
  validateLogin_(login);
  validatePassword_(String(password));
  if (readRows_('Admins').some(r => String(r.login).toLowerCase() === login.toLowerCase())) throw new ValidationError('login_taken');
  const salt = newSalt_();
  const id = 'ad' + Date.now().toString(36);
  appendRow_('Admins', [id, login, hashPassword_(String(password), salt), salt, true, nowIso_(new Date())]);
  clearAdminsCache_();
  return id;
}

function adminListAdmins_() {
  return readRows_('Admins').map(r => ({ id: String(r.id), login: String(r.login), active: isTrue_(r.active), created_at: String(r.created_at) }));
}
function adminCreateAdmin_(b) {
  return { id: withLock_(() => createAdminRow_(b.login, b.password)) };
}
function activeOthers_(id) {
  return readRows_('Admins').filter(r => String(r.id) !== String(id) && isTrue_(r.active));
}
function adminUpdateAdmin_(b, me) {
  const id = String(b.id);
  const target = readRows_('Admins').find(r => String(r.id) === id);
  if (!target) throw new ValidationError('not_found');
  const patch = {};
  if (b.active !== undefined) {
    const act = b.active === true || b.active === 'true';
    if (!act) {
      if (id === me.id) throw new ValidationError('self_action');
      if (!activeOthers_(id).length) throw new ValidationError('last_admin');
    }
    patch.active = act;
  }
  if (b.password) {
    validatePassword_(String(b.password));
    patch.salt = newSalt_();
    patch.password_hash = hashPassword_(String(b.password), patch.salt);
  }
  if (b.login !== undefined) {
    const login = str_(b.login, 30);
    validateLogin_(login);
    if (readRows_('Admins').some(r => String(r.id) !== id && String(r.login).toLowerCase() === login.toLowerCase())) throw new ValidationError('login_taken');
    patch.login = login;
  }
  withLock_(() => updateRowById_('Admins', id, patch));
  clearAdminsCache_();
  return { token: patch.password_hash && id === me.id ? issueToken_(id, patch.password_hash) : null };
}
function adminDeleteAdmin_(b, me) {
  const id = String(b.id);
  if (id === me.id) throw new ValidationError('self_action');
  const target = readRows_('Admins').find(r => String(r.id) === id);
  if (!target) throw new ValidationError('not_found');
  if (isTrue_(target.active) && !activeOthers_(id).length) throw new ValidationError('last_admin');
  withLock_(() => deleteRowById_('Admins', id));
  clearAdminsCache_();
  return { ok: true };
}
function adminChangePassword_(b, me) {
  const row = readRows_('Admins').find(r => String(r.id) === me.id);
  if (!row || !safeEqual_(hashPassword_(String(b.currentPassword || ''), String(row.salt)), String(row.password_hash))) {
    throw new ValidationError('invalid_credentials');
  }
  return adminUpdateAdmin_({ id: me.id, password: b.newPassword }, me);
}
