/**
 * Tezlik uchun: keshni doim "issiq" ushlab turadi.
 * installTriggers() ni skript muharririda BIR MARTA qo'lda ishga tushiring.
 */
function warmCache() {
  clearPublicCache_();
  getPublicData_();
}

// Oddiy trigger: Sheets'da qo'lda biror katak o'zgartirilsa, kesh darhol yangilanadi
function onEdit() {
  try { warmCache(); } catch (e) { clearPublicCache_(); }
}

function installTriggers() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'warmCache')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('warmCache').timeBased().everyMinutes(5).create();
  warmCache();
  console.log('installTriggers() yakunlandi');
}
