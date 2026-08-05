# Deploying the Apps Script Web App

This step is done manually in your own Google account — it can't be automated from here.

1. Create the Google Sheet and its two tabs as described in `docs/sheets-schema.md`.
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete the default boilerplate `Code.gs` content and paste in the contents of `apps-script/Code.gs` from this repo.
4. Click **Deploy → New deployment**.
   - Type: **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
5. Authorize the requested permissions (it needs access to this Sheet).
6. Copy the generated **Web app URL** — that's the endpoint the Astro site will call for both reading the menu (`GET`) and submitting orders (`POST`).
7. Share that URL so it can be wired into the site's config (see `src/lib/config.ts`, added in Fase 6).

## Notes / limitations

- The Web app URL is public and unauthenticated by design (matches the spec — no login flow requested). Anyone with the URL can POST fake orders; there's no rate limiting or spam protection. Documented as a known limitation in the README.
- Every code change to `Code.gs` requires a **new deployment version** (or "Manage deployments → Edit → New version") to take effect on the existing URL.
