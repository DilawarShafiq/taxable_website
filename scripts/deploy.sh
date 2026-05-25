#!/bin/bash
# Full deploy script: creates secrets, builds image via Cloud Build, deploys to Cloud Run
# Usage: FIREBASE_API_KEY=xxx FIREBASE_APP_ID=xxx RESEND_API_KEY=xxx ./scripts/deploy.sh
set -e

PROJECT="taxable-ai-2026"
REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/$PROJECT/taxable-ai/app"

: "${DB_PASS:=TaxableAI2026!Secure}"
: "${GMAIL_USER:?Need GMAIL_USER (e.g. noreply@taxable.ai)}"
: "${GMAIL_APP_PASSWORD:?Need GMAIL_APP_PASSWORD}"
: "${GMAIL_LEADS_EMAIL:=leads@taxable.ai}"
: "${SITE_URL:=https://taxable.ai}"

# Firebase config is now baked in from the registered web app
FIREBASE_API_KEY="AIzaSyBKim4vx1GC6jPk2ZOompEIMWCQUDO1vHo"
FIREBASE_AUTH_DOMAIN="taxable-ai-2026.firebaseapp.com"
FIREBASE_STORAGE_BUCKET="taxable-ai-2026.firebasestorage.app"
FIREBASE_MESSAGING_SENDER_ID="322958252133"
FIREBASE_APP_ID="1:322958252133:web:887cc056a1642104850e8c"

echo "▶ Creating/updating secrets in Secret Manager..."
create_or_update_secret() {
  local name="$1"
  local value="$2"
  if gcloud secrets describe "$name" --project="$PROJECT" &>/dev/null; then
    echo -n "$value" | gcloud secrets versions add "$name" --data-file=- --project="$PROJECT"
  else
    echo -n "$value" | gcloud secrets create "$name" --data-file=- --project="$PROJECT"
  fi
}

create_or_update_secret "db-password" "$DB_PASS"
create_or_update_secret "gmail-user" "$GMAIL_USER"
create_or_update_secret "gmail-app-password" "$GMAIL_APP_PASSWORD"
create_or_update_secret "anthropic-vertex-project" "taxable-ai-2026"

echo "▶ Ensuring Artifact Registry repo exists..."
gcloud artifacts repositories create taxable-ai \
  --repository-format=docker \
  --location="$REGION" \
  --project="$PROJECT" 2>/dev/null || true

echo "▶ Configuring Docker auth for Artifact Registry..."
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

echo "▶ Submitting Cloud Build..."
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --project="$PROJECT" \
  --substitutions="\
_FIREBASE_API_KEY=$FIREBASE_API_KEY,\
_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN,\
_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET,\
_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID,\
_FIREBASE_APP_ID=$FIREBASE_APP_ID,\
_SITE_URL=$SITE_URL,\
_DB_PASS=$DB_PASS,\
_GMAIL_USER=$GMAIL_USER,\
_GMAIL_APP_PASSWORD=$GMAIL_APP_PASSWORD,\
_GMAIL_LEADS_EMAIL=$GMAIL_LEADS_EMAIL"

echo ""
echo "✓ Deploy complete. Get the service URL:"
gcloud run services describe taxable-ai --region="$REGION" --project="$PROJECT" \
  --format="value(status.url)"
