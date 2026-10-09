/**
 * Telegram integratsiyasi.
 * Sozlamalar Script Properties'da (Project Settings → Script properties):
 *   TELEGRAM_BOT_TOKEN   — bot tokeni (hech qachon kodga yozilmaydi)
 *   TELEGRAM_CHAT_IDS    — vergul/probel/yangi qator bilan ajratilgan chat ID'lar
 *   TELEGRAM_ENABLED     — 'false' bo'lsa xabar yuborilmaydi (boshqa qiymat — yoqilgan)
 */
function telegramConfig_() {
  const p = PropertiesService.getScriptProperties();
  return {
    enabled: p.getProperty('TELEGRAM_ENABLED') !== 'false',
    token: (p.getProperty('TELEGRAM_BOT_TOKEN') || '').trim(),
    chatIds: (p.getProperty('TELEGRAM_CHAT_IDS') || '').split(/[\s,;]+/).filter(Boolean),
  };
}

function esc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildApplicationMessage_(a) {
  const lines = ['🆕 <b>Yangi ariza</b>', '', '👤 Ism: ' + esc_(a.fullName), '📞 Telefon: ' + esc_(a.phone), '📚 Kurs: ' + esc_(a.course)];
  if (a.group) lines.push('📖 Guruh: ' + esc_(a.group));
  if (a.format) lines.push('💻 Format: ' + esc_(a.format));
  if (a.age) lines.push('🎂 Yosh: ' + esc_(a.age));
  if (a.comment) lines.push('💬 Izoh: ' + esc_(a.comment));
  if (a.source && a.source !== 'direct') lines.push('🔗 Manba: ' + esc_(a.source));
  lines.push('', '🕐 ' + Utilities.formatDate(a.date, TZ, 'dd.MM.yyyy HH:mm') + '  (' + a.id + ')');
  return lines.join('\n');
}

/** Barcha chat ID'larga yuboradi. Natija: {sent, failed, skipped} */
function sendTelegram_(html) {
  const c = telegramConfig_();
  if (!c.enabled || !c.token || !c.chatIds.length) return { sent: 0, failed: 0, skipped: true };

  const url = 'https://api.telegram.org/bot' + c.token + '/sendMessage';
  const reqs = c.chatIds.map(id => ({
    url: url,
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: id, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
    muteHttpExceptions: true,
  }));
  const res = UrlFetchApp.fetchAll(reqs);
  let sent = 0, failed = 0;
  res.forEach((r, i) => {
    if (r.getResponseCode() === 200) { sent++; return; }
    failed++;
    // Log'ga token yoki URL yozilmaydi — faqat chat ID va javob matni
    console.error('Telegram xatosi (chat ' + c.chatIds[i] + '): ' + r.getResponseCode() + ' ' + r.getContentText());
  });
  return { sent: sent, failed: failed, skipped: false };
}

/** Skript muharririda qo'lda ishga tushiring: Telegram ulanishini tekshirish */
function testTelegram() {
  const r = sendTelegram_('✅ <b>ApexEdu</b>: Telegram ulanishi ishlayapti.');
  console.log(JSON.stringify(r));
  return r;
}
