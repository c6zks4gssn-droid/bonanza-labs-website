const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require.resolve('../src/lib/payment-result.ts'), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const { paymentResult } = context.exports;
for (const [session, expected] of [
  [null, 'unverified'],
  [{ payment_status: 'paid', status: 'complete' }, 'paid'],
  [{ payment_status: 'unpaid', status: 'complete' }, 'pending'],
  [{ payment_status: 'unpaid', status: 'open' }, 'unverified'],
  [{ payment_status: 'unpaid', status: 'expired' }, 'unverified'],
  [{ payment_status: 'no_payment_required', status: 'complete' }, 'unverified'],
]) {
  const result = paymentResult(session);
  assert.equal(result.kind, expected);
  assert.equal(result.confirmed, expected === 'paid');
}
console.log('6 payment-result cases passed; no external requests.');
