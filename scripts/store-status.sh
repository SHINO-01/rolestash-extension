#!/usr/bin/env bash
# Prints what the Chrome Web Store says about the item: its published and
# submitted revisions, the last upload, and any problem the store reports.
# "Does not meet the requirements to be published" says nothing on its own;
# this shows the store's reason. Never prints a secret.
#
# Reads EXTENSION_ID, PUBLISHER_ID, CLIENT_ID, CLIENT_SECRET and REFRESH_TOKEN.
set -euo pipefail

summary="${GITHUB_STEP_SUMMARY:-/dev/null}"
token="$(curl -sS --max-time 30 https://oauth2.googleapis.com/token \
  --data-urlencode "client_id=${CLIENT_ID}" \
  --data-urlencode "client_secret=${CLIENT_SECRET}" \
  --data-urlencode "refresh_token=${REFRESH_TOKEN}" \
  --data-urlencode "grant_type=refresh_token" | jq -r '.access_token // empty')"
[ -n "$token" ] || { echo "::error::Couldn't get an access token (run Check store credentials)."; exit 1; }

status="$(curl -sS --max-time 30 -H "Authorization: Bearer ${token}" \
  "https://chromewebstore.googleapis.com/v2/publishers/${PUBLISHER_ID}/items/${EXTENSION_ID}:fetchStatus")"
draft="$(curl -sS --max-time 30 -H "Authorization: Bearer ${token}" \
  "https://www.googleapis.com/chromewebstore/v1.1/items/${EXTENSION_ID}?projection=DRAFT")"

echo "Store status (v2 fetchStatus):"
jq . <<<"$status" || echo "$status"
echo "Draft item (v1.1):"
jq . <<<"$draft" || echo "$draft"
{
  echo '**Chrome Web Store status**'
  echo '```json'
  jq . <<<"$status" 2>/dev/null || echo "$status"
  echo '```'
  echo '**Draft item**'
  echo '```json'
  jq . <<<"$draft" 2>/dev/null || echo "$draft"
  echo '```'
} >>"$summary"
