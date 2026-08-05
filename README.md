# TailorMind Take-Home — Restaurant Menu & Cart

**Live site:** https://luhpaco.github.io/tailormind-menu-takehome/

Take-home assignment for the Full-stack Senior AI-empowered application at TailorMind. An Astro site reads a restaurant menu from Google Sheets, offers a client-side shopping cart, and submits orders as a new row in another Sheet tab via a Google Apps Script Web App.

## Stack

- [Astro](https://astro.build) — static site, vanilla TypeScript, no UI framework
- Google Sheets as the backend (`menu` and `orders` tabs — schema in [`docs/sheets-schema.md`](docs/sheets-schema.md))
- Google Apps Script Web App as the read/write bridge ([`apps-script/Code.gs`](apps-script/Code.gs))
- GitHub Pages, deployed via GitHub Actions

## Try it live

The Google Sheet behind the live site is open for hands-on testing: **[Google Sheet](https://docs.google.com/spreadsheets/d/19BQVcpog1Z5r5LoK6eh2YdfAMS3X5IhShMNsdwj-Z9E/edit?usp=sharing)**

- `menu` tab — editable by anyone with the link. Add, edit, or remove a row, then refresh the [live site](https://luhpaco.github.io/tailormind-menu-takehome/): the menu is fetched client-side at page load, so there's no redeploy involved.
- `orders` tab — protected (view-only for anyone but the owner), so you can watch orders land as they're submitted through the site without being able to edit or delete them.

## Running locally

```sh
npm install
npm run dev
```

Without a `PUBLIC_APPS_SCRIPT_URL` env var set, the site reads from a local mock menu (`public/mock/menu.json`) and shows an explicit "backend not configured" message if you try to submit an order — see [`apps-script/README.md`](apps-script/README.md) for how to deploy the real backend.

```sh
npm run test
```

runs the unit tests for the cart calculation logic (add/remove/quantity/subtotals/total).

## How to make a pizza

Mix flour, water, yeast, and salt into a dough, then let it rest for about an hour until it doubles in size. Stretch it out into a round base, spread a thin layer of tomato sauce, add cheese and your preferred toppings, and bake at high heat (250°C/480°F or more) for 8–10 minutes, until the crust is golden and the cheese is bubbling.

## What I'd do with another hour

Add unit tests for the Apps Script's `doPost` validation logic (currently only manually verified against the real deployment, since Google Apps Script isn't trivial to unit-test in isolation). I'd also add a lightweight e2e test (Playwright) covering the full add-to-cart-to-order flow, a honeypot field or similar to reduce spam on the public Apps Script endpoint, and loading skeletons instead of plain-text loading states for a more polished feel.

## Assumptions

- The spec repeats the "include a short pizza-making paragraph in the README" requirement in points 1 and 4 (unrelated context each time). Interpreted as the same request — included once, above.
- `menu` tab extended beyond the spec's stated minimum (name/description/price) with `id`, `category`, and `image_url`, to support grouping the menu and showing product images.
- Order items are stored as a single JSON cell per order (`items_json`), not flattened columns or one row per item — matches the spec's literal "adds **one row**" wording, which only offers "JSON or flattened" as options.
- Deployed on GitHub Pages (the spec left the platform choice open).
- The cart's order POST uses `Content-Type: text/plain` to avoid the CORS preflight that Apps Script Web Apps can't handle well; this keeps the response body readable so the UI can show a real success/error message instead of firing blind.
- The menu is fetched client-side at page-load time, not at Astro build time — so edits made directly in the Sheet show up without a redeploy, which is the actual point of using Sheets as a live backend.
- An empty menu or a failed fetch shows an explicit state in the UI; there's no silent fallback to mock data in production.
- Email validation is basic and client-side only (`type="email"` + a simple regex) — no real-address verification.
- Currency is PEN, displayed as `S/ 12.50`; prices are stored as plain numbers in the Sheet.
- UI copy is in Spanish; this README, code, and comments are in English.
- No automated tests beyond targeted unit tests on the cart's calculation logic — see "What I'd do with another hour."
- The cart persists in `localStorage`, so it survives a page reload.
- The Apps Script Web App URL is public and unauthenticated by design (the spec didn't ask for a login flow) — anyone with the URL could POST fake orders. There's no rate limiting or spam protection.
- `image_url` is optional per menu row; the sample data ships without real images, so cards fall back to a placeholder background.
- The Sheet is shared with edit access so reviewers can add products and see them reflected live, but `orders` is protected (Data > Protect sheets and ranges, owner-only edit) — sharing edit access to the whole file was the only way to keep both tabs in one spreadsheet as the spec asks, without exposing submitted orders (including test names/emails) to tampering. Menu vandalism, if it happens, is recoverable via Sheets' version history.
