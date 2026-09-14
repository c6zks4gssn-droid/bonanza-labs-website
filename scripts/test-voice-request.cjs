// Exercise form submission without external requests or email delivery.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync('src/components/voice-request.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
async function scenario(response, fields = {}) {
  const states = []; const writes = []; let slot = 0; let payload;
  const values = { name: 'Test Persoon', businessName: 'Fictief Testbedrijf', email: 'test@example.invalid', phone: '0612345678', sector: 'Bouw', callType: 'Offerte-aanvragen voor nieuw werk', details: '', website: '', ...fields };
  const module = { exports: {} };
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(compiled, { exports: module.exports, module,
    require: id => id === 'react' ? { useState: initial => { const i = slot++; states[i] = initial; return [initial, value => { states[i] = value; writes.push([i, value]); }]; }, useRef: value => ({ current: value }) } : id === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : { default: 'a' },
    FormData: class { get(key) { return values[key]; } },
    window: { location: { href: 'https://example.invalid/bonanza-voice' } },
    fetch: async (_url, options) => { payload = JSON.parse(options.body); if (response instanceof Error) throw response; return { ok: response.ok, json: async () => response.body }; },
  });
  const form = module.exports.default();
  await form.props.onSubmit({ preventDefault() {}, currentTarget: {} });
  return { states, writes, payload };
}
(async () => {
  const accepted = await scenario({ ok: true, body: { success: true, id: 'lead_test', notified: false } });
  assert.equal(accepted.states[1], true);
  assert.equal(accepted.payload.company, undefined, 'business name must not enter the spam trap');
  assert.match(accepted.payload.message, /Bedrijfsnaam: Fictief Testbedrijf/);
  assert.match(accepted.payload.message, /Gesprekstype: Offerte-aanvragen/);
  assert.match(accepted.payload.message, /Telefoon: 0612345678/);
  assert.equal(accepted.payload.source, 'contact-form');
  for (const response of [{ ok: true, body: { success: true } }, { ok: false, body: { error: 'Opslag niet beschikbaar' } }, new Error('offline')]) {
    const result = await scenario(response);
    assert.equal(result.states[1], false);
    assert.ok(result.states[2]);
    assert.equal(result.states[0], false);
  }
  for (const fields of [{ website: 'spam' }, { phone: '12' }, { email: 'ongeldig' }]) {
    const result = await scenario({ ok: true, body: { success: true, id: 'lead_test' } }, fields);
    assert.equal(result.payload, undefined);
    assert.equal(result.states[1], false);
  }
  console.log('7 Voice form cases passed; no external requests.');
})().catch(error => { console.error(error); process.exitCode = 1; });
