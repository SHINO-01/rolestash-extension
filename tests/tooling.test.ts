import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { addEntry, sectionFor } from '../scripts/changelog.ts';
import { checkManifest, type Policy } from '../scripts/check-package.ts';

const root = resolve(import.meta.dirname, '..');
const policy = JSON.parse(readFileSync(resolve(root, 'policy/manifest-policy.json'), 'utf8')) as Policy;

const good = {
  manifest_version: 3,
  version: '0.2.0',
  permissions: ['activeTab', 'scripting', 'storage', 'unlimitedStorage', 'contextMenus', 'alarms'],
  optional_permissions: ['notifications'],
  host_permissions: policy.hostPermissions,
  optional_host_permissions: ['https://*/*', 'http://*/*'],
  content_scripts: [{ matches: policy.hostPermissions, js: ['content-scripts/launcher.js'] }],
  web_accessible_resources: [{ resources: ['widget.html', 'icon/48.png'], matches: ['<all_urls>'] }],
};
const withAccounts = {
  ...good,
  permissions: [...good.permissions, 'identity'],
  externally_connectable: { matches: ['https://rolestash.com/board/*'] },
};

test('a manifest matching policy passes', () => {
  assert.deepEqual(checkManifest(good, policy, '0.2.0'), []);
});

test('an accounts build passes with identity and exactly the web board', () => {
  assert.deepEqual(checkManifest(withAccounts, policy, '0.2.0'), []);
});

test('accounts pieces never appear alone or widened', () => {
  const noBoard = checkManifest({ ...withAccounts, externally_connectable: undefined }, policy);
  assert.match(noBoard.join('\n'), /externally_connectable must be exactly/);
  const wide = checkManifest(
    { ...withAccounts, externally_connectable: { matches: ['https://rolestash.com/*'] } },
    policy,
  );
  assert.match(wide.join('\n'), /externally_connectable must be exactly/);
  const ids = checkManifest(
    { ...withAccounts, externally_connectable: { matches: ['https://rolestash.com/board/*'], ids: ['*'] } },
    policy,
  );
  assert.match(ids.join('\n'), /externally_connectable must be exactly/);
  const boardOnly = checkManifest({ ...good, externally_connectable: withAccounts.externally_connectable }, policy);
  assert.match(boardOnly.join('\n'), /only in accounts builds/);
});

test('the development key and new optional permissions fail', () => {
  assert.match(checkManifest({ ...good, key: 'MIIB' }, policy).join('\n'), /development build/);
  const tabs = checkManifest({ ...good, optional_permissions: ['notifications', 'tabs'] }, policy);
  assert.match(tabs.join('\n'), /optional_permissions not allowed by policy: tabs/);
});

test('permission creep fails the gate', () => {
  const errors = checkManifest({ ...good, permissions: [...good.permissions, 'tabs'] }, policy);
  assert.match(errors.join('\n'), /not allowed by policy: tabs/);
});

test('dropping a permission asks to tighten the policy', () => {
  const errors = checkManifest({ ...good, permissions: ['activeTab'] }, policy);
  assert.match(errors.join('\n'), /tighten the policy/);
});

test('host access, content scripts, weak CSP and wrong versions fail', () => {
  const errors = checkManifest(
    {
      ...good,
      manifest_version: 2,
      host_permissions: ['<all_urls>'],
      content_scripts: [{ matches: ['<all_urls>'], js: ['x.js'] }],
      externally_connectable: { matches: ['https://evil.example/*'] },
      content_security_policy: { extension_pages: "script-src 'self' 'unsafe-eval'" },
    },
    policy,
    '9.9.9',
  );
  assert.equal(errors.length, 6);
});

test('the policy matches what the source ships today', () => {
  const manifestPath = resolve(root, 'source/.output/chrome-mv3/manifest.json');
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
  } catch {
    return; // not built in this run; CI builds before running the gate
  }
  assert.deepEqual(checkManifest(manifest, policy), []);
});

const CHANGELOG = '# Changelog\n\nIntro.\n\n## [0.1.0] — 2026-09-30\n\nFirst.\n';

test('adds a release entry on top, once', () => {
  const next = addEntry(CHANGELOG, '0.2.0', '2026-10-05', '### Fixed\n\n- Bug', 'https://github.com/o/r');
  assert.match(next, /Intro\.\n\n## \[0\.2\.0\] — 2026-10-05\n\nBuilt from source \[v0\.2\.0\]\(https:\/\/github\.com\/o\/r\/releases\/tag\/v0\.2\.0\)/);
  assert.equal(sectionFor(next, '0.1.0'), 'First.');
  assert.equal(addEntry(next, '0.2.0', '2026-10-06', 'again', 'x'), next);
  assert.match(addEntry('# Changelog\n', '1.0.0', 'd', '', 'u'), /_No notes in the source release\._/);
});

test('the widget script runs only on the job sites, and exposes only its frame and icon', () => {
  const everywhere = checkManifest(
    { ...good, content_scripts: [{ matches: ['<all_urls>'], js: ['content-scripts/launcher.js'] }] },
    policy,
  );
  assert.match(everywhere.join('\n'), /content_scripts match pages outside hostPermissions: <all_urls>/);
  const frames = checkManifest(
    { ...good, content_scripts: [{ matches: policy.hostPermissions, all_frames: true }] },
    policy,
  );
  assert.match(frames.join('\n'), /must not run in all frames/);
  const exposed = checkManifest(
    { ...good, web_accessible_resources: [{ resources: ['board.html'], matches: ['<all_urls>'] }] },
    policy,
  );
  assert.match(exposed.join('\n'), /web_accessible_resources not allowed by policy: board.html/);
  const wider = checkManifest({ ...good, host_permissions: [...policy.hostPermissions, 'file:///*'] }, policy);
  assert.match(wider.join('\n'), /host_permissions not allowed by policy: file:\/\/\/\*/);
});
