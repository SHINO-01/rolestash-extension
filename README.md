# rolestash-extension

[![Release](https://github.com/SHINO-01/rolestash-extension/actions/workflows/release.yml/badge.svg)](https://github.com/SHINO-01/rolestash-extension/actions/workflows/release.yml)
[![Latest](https://img.shields.io/github/v/release/SHINO-01/rolestash-extension)](https://github.com/SHINO-01/rolestash-extension/releases/latest)

Packaging and Chrome Web Store releases for **Rolestash**. The code lives in
[SHINO-01/rolestash](https://github.com/SHINO-01/rolestash) and is pinned here as
the `source/` git submodule, always at a released tag.

This repo holds no application code. It decides **what ships**: which source
release, with which permissions, with what store listing. It also produces
the artifact that gets uploaded.

```
source release vX.Y.Z ──► Detect ──► Verify ──────────────────► GitHub Release ──► Chrome Web Store
(SHINO-01/rolestash)        daily or   audit · build · manifest    pin + CHANGELOG     approval required,
                           manual     policy gate · smoke E2E     zip + SHA256 +      upload + submit
                                                                  provenance          for review
```

Full design: [CI/CD guide](https://github.com/SHINO-01/rolestash/blob/dev/docs/guides/ci-cd.md)
and [ADR-0008](https://github.com/SHINO-01/rolestash/blob/dev/docs/adr/0008-two-repo-release-pipeline.md).

## Layout

| Path                              | What                                                                  |
| --------------------------------- | --------------------------------------------------------------------- |
| `source/`                         | Submodule → SHINO-01/rolestash at the released tag                     |
| `policy/manifest-policy.json`     | Permissions the shipped manifest must match **exactly** (plus the accounts-only pair) |
| `store/`                          | Store listing text, permission justifications, screenshots (1280×800) |
| `CHANGELOG.md`                    | One entry per release, generated from the source release notes       |
| `scripts/check-package.ts`        | The manifest policy gate                                              |
| `scripts/changelog.ts`            | Adds CHANGELOG entries                                                |
| `.github/workflows/release.yml`   | Detect → Verify → GitHub Release → Chrome Web Store                   |
| `.github/workflows/integration.yml` | Health + integration checks (reused by release, runs on PRs)        |

## Shipping

Releases start in the source repo (`npm run release -- patch` on `dev`, then
push). This repo picks up the new tag on its daily run at 06:17 Sydney. To
ship now: **Actions → Release → Run workflow**. When the run pauses on
_Chrome Web Store_, review and approve it.

## One-time setup

1. **Repository settings.** From a clone of SHINO-01/rolestash, run
   `bash scripts/setup-github.sh`. It configures both repos: rulesets, security
   features, Actions restrictions, and the `chrome-web-store` environment.
2. **First store upload (manual, once).** Download the zip from the latest
   [release](https://github.com/SHINO-01/rolestash-extension/releases/latest),
   create the item in the
   [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole),
   upload the zip, and fill in the listing from [`store/listing.md`](store/listing.md).
   Use `https://rolestash.com/privacy` as
   the privacy policy URL. Submit it for review.
3. **API credentials.** Follow
   [chrome-webstore-upload-keys](https://github.com/fregante/chrome-webstore-upload-keys)
   to get a client ID, client secret and refresh token. The publisher ID is in
   the dashboard's account settings.
4. **Enable automatic publishing.** Run
   `bash scripts/setup-github.sh --store` and paste the values. Secrets go into
   the protected environment, and the extension ID becomes the
   `CWS_EXTENSION_ID` variable. From then on, _Release_ uploads and submits each
   new version after you approve it.
   Then run **Actions → Check store credentials** (and approve it): it checks
   every value is set and in the right secret, and that Google accepts the
   client ID, secret and refresh token together, without printing any of
   them. _Release_ runs the same check before each upload. To fix one value:
   `gh secret set CWS_<NAME> --repo SHINO-01/rolestash-extension --env chrome-web-store`.
5. **Turn accounts on (launch).** Set three repository _variables_. They're
   public values and they aren't secrets:
   - `WXT_SUPABASE_URL`;
   - `WXT_SUPABASE_ANON_KEY` (the publishable key);
   - `WXT_GOOGLE_CLIENT_ID`.

   While they're unset, the release build has no backend, as before launch.
   Once they're set, the build adds `identity` and `externally_connectable`
   (`rolestash.com/board/*` only). The policy gate allows those two only
   together, and the smoke tests check accounts mode.

## Changing what ships

- **Store text or screenshots:** edit `store/`, open a PR (runs _Integration_),
  then update the listing in the dashboard. The API uploads packages, not
  listing text.
- **Permissions:** a new permission in the source fails the policy gate. If it's
  intended, update `policy/manifest-policy.json` and justify it in
  `store/listing.md` in the same PR.
- **Rollback:** the Web Store has none. Revert on the source `dev` branch and
  release a higher patch version.

## Security

- The build runs in _Verify_ with a read-only token and no secrets. Store
  credentials exist only in the approval-gated `chrome-web-store` environment,
  whose job runs no source code (only the verified zip and a lockfile-pinned
  upload CLI).
- Every release zip has SHA-256 checksums and a
  [build provenance attestation](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds).
  Verify with `gh attestation verify <zip> -R SHINO-01/rolestash-extension`.
- Actions are pinned to commit SHAs and kept current by Dependabot.
