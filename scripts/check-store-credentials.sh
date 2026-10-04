#!/usr/bin/env bash
# Checks the Chrome Web Store credentials before an upload, and explains what's
# wrong in plain words. Never prints a secret: only which one is at fault and
# Google's error code.
#
# Reads EXTENSION_ID, PUBLISHER_ID, CLIENT_ID, CLIENT_SECRET and REFRESH_TOKEN
# from the environment (the chrome-web-store environment's secrets).
# STORE_CHECK_OFFLINE=1 skips the call to Google (used by the tests).
set -euo pipefail

summary="${GITHUB_STEP_SUMMARY:-/dev/null}"
fail() {
  echo "::error title=Chrome Web Store credentials::$1"
  printf '**Chrome Web Store credentials:** %s\n' "$1" >>"$summary"
  exit 1
}

declare -A names=(
  [EXTENSION_ID]="vars.CWS_EXTENSION_ID"
  [PUBLISHER_ID]="CWS_PUBLISHER_ID"
  [CLIENT_ID]="CWS_CLIENT_ID"
  [CLIENT_SECRET]="CWS_CLIENT_SECRET"
  [REFRESH_TOKEN]="CWS_REFRESH_TOKEN"
)
for var in EXTENSION_ID PUBLISHER_ID CLIENT_ID CLIENT_SECRET REFRESH_TOKEN; do
  if [ -z "${!var:-}" ]; then
    fail "${names[$var]} is empty. Set it again: gh secret set ${names[$var]} --repo SHINO-01/rolestash-extension --env chrome-web-store"
  fi
done

# Shapes Google uses. A value in the wrong secret is the usual mistake, because
# the setup script asks for them one after another with hidden input.
[[ "$EXTENSION_ID" =~ ^[a-p]{32}$ ]] ||
  fail "vars.CWS_EXTENSION_ID isn't an extension ID (32 letters a–p)."
[[ "$CLIENT_ID" =~ \.apps\.googleusercontent\.com$ ]] ||
  fail "CWS_CLIENT_ID isn't an OAuth client ID (it ends in .apps.googleusercontent.com). The values may have gone into the wrong secrets."
[[ "$CLIENT_SECRET" != *.apps.googleusercontent.com && "$CLIENT_SECRET" != 1//* ]] ||
  fail "CWS_CLIENT_SECRET holds a client ID or a refresh token. The values may have gone into the wrong secrets."
[[ "$PUBLISHER_ID" != *.apps.googleusercontent.com && "$PUBLISHER_ID" != 1//* && "$PUBLISHER_ID" != GOCSPX-* ]] ||
  fail "CWS_PUBLISHER_ID holds an OAuth value. It's the first ID in the developer dashboard's address."
[[ "$REFRESH_TOKEN" == 1//* ]] ||
  echo "::warning title=Chrome Web Store credentials::CWS_REFRESH_TOKEN doesn't start with 1// as Google's refresh tokens usually do."

if [ "${STORE_CHECK_OFFLINE:-}" = "1" ]; then
  echo "Credentials are set and look right (offline check)."
  exit 0
fi

# Exchange the refresh token for an access token, exactly as the upload does.
response="$(curl -sS --max-time 30 https://oauth2.googleapis.com/token \
  --data-urlencode "client_id=${CLIENT_ID}" \
  --data-urlencode "client_secret=${CLIENT_SECRET}" \
  --data-urlencode "refresh_token=${REFRESH_TOKEN}" \
  --data-urlencode "grant_type=refresh_token")"
error="$(jq -r '.error // empty' <<<"$response")"
case "$error" in
  "") ;;
  invalid_client)
    fail "Google doesn't recognise CWS_CLIENT_ID with CWS_CLIENT_SECRET (invalid_client: $(jq -r '.error_description // ""' <<<"$response")). Copy both again from the OAuth client in the Cloud project rolestash-cws-upload, and check that client still exists." ;;
  invalid_grant)
    fail "CWS_REFRESH_TOKEN was rejected (invalid_grant): it was revoked, expired (the app was left in Testing), or made with a different client. Create a new one with the same client." ;;
  unauthorized_client)
    fail "CWS_REFRESH_TOKEN was made with a different OAuth client than CWS_CLIENT_ID (unauthorized_client). Create a new token with this client." ;;
  *)
    fail "Google refused the token exchange (${error})." ;;
esac
scope="$(jq -r '.scope // ""' <<<"$response")"
[[ "$scope" == *chromewebstore* ]] ||
  fail "The refresh token works but wasn't granted the Chrome Web Store scope (got: ${scope:-none}). Create it again with the chromewebstore scope."

echo "Chrome Web Store credentials work (scope: ${scope})."
printf '**Chrome Web Store credentials:** working.\n' >>"$summary"
