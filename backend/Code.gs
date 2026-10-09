/** ApexEdu Academy — Web App kirish nuqtalari (doGet / doPost) */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : '';
    if (action === 'public') return json_({ ok: true, data: getPublicData_() });
    if (action === 'ping') return json_({ ok: true, data: 'pong' });
    return json_({ ok: false, error: 'not_found' });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'server_error' });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (String(body.action).indexOf('admin') === 0) return json_({ ok: true, data: handleAdmin_(body) });
    if (body.action === 'submitApplication') return json_({ ok: true, data: submitApplication_(body) });
    if (body.action === 'submitReview') return json_({ ok: true, data: submitReview_(body) });
    return json_({ ok: false, error: 'not_found' });
  } catch (err) {
    if (err instanceof ValidationError) return json_({ ok: false, error: err.message });
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'server_error' });
  }
}
