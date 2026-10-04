import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { test } from 'node:test';

const script = resolve(import.meta.dirname, '../scripts/check-store-credentials.sh');

// Fake values in Google's shapes (offline: nothing is sent anywhere).
const good = {
  EXTENSION_ID: 'cncilbdakhabnocnjokbonggomndedgp',
  PUBLISHER_ID: '0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b',
  CLIENT_ID: '123456789012-abcdefghijklmnop.apps.googleusercontent.com',
  CLIENT_SECRET: 'GOCSPX-fake-secret',
  REFRESH_TOKEN: '1//fake-refresh-token',
};

function check(values: Record<string, string>) {
  const run = spawnSync('bash', [script], {
    env: { PATH: process.env.PATH, STORE_CHECK_OFFLINE: '1', ...values },
    encoding: 'utf8',
  });
  return { ok: run.status === 0, out: run.stdout + run.stderr };
}

test('well-formed credentials pass the offline check', () => {
  assert.equal(check(good).ok, true);
});

test('an empty publisher ID is named, with the command to set it', () => {
  const { ok, out } = check({ ...good, PUBLISHER_ID: '' });
  assert.equal(ok, false);
  assert.match(out, /CWS_PUBLISHER_ID is empty/);
  assert.match(out, /gh secret set CWS_PUBLISHER_ID/);
});

test('values in the wrong secrets are caught before Google is asked', () => {
  assert.match(check({ ...good, CLIENT_ID: good.CLIENT_SECRET }).out, /CWS_CLIENT_ID isn't an OAuth client ID/);
  assert.match(check({ ...good, CLIENT_SECRET: good.CLIENT_ID }).out, /CWS_CLIENT_SECRET holds a client ID/);
  assert.match(check({ ...good, PUBLISHER_ID: good.REFRESH_TOKEN }).out, /CWS_PUBLISHER_ID holds an OAuth value/);
});

test('no secret value is ever printed', () => {
  const { out } = check({ ...good, CLIENT_ID: 'not-a-client-id-SECRETMARKER' });
  assert.doesNotMatch(out, /SECRETMARKER/);
});
