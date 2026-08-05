# Google Sheets schema

One Google Sheet (spreadsheet) with two tabs. **Tab names and column order matter** — the Apps Script (`apps-script/Code.gs`) reads by fixed column position, not by header text, so the header row is for human readability only. Row 1 is always the header row; data starts at row 2.

## Tab: `menu`

| Column | Field | Type | Notes |
|---|---|---|---|
| A | `id` | string | Unique per row (e.g. `p1`, `p2`). Used as the cart line-item key. |
| B | `name` | string | Product name. |
| C | `description` | string | Short description shown on the card. |
| D | `price` | number | Plain number, no currency symbol (e.g. `12.5`). Displayed in the UI as PEN (`S/ 12.50`). |
| E | `category` | string | Free text used to group cards in the UI (e.g. `Pizzas`, `Bebidas`, `Postres`). |
| F | `image_url` | string | Public URL to an image. Can be left empty — the UI falls back to a placeholder. |

## Tab: `orders`

| Column | Field | Type | Notes |
|---|---|---|---|
| A | `timestamp` | string (ISO datetime) | Set server-side by the Apps Script at insert time — not sent by the client. |
| B | `customer_name` | string | From the checkout form. |
| C | `customer_email` | string | From the checkout form, basic format validated client-side. |
| D | `items_json` | string | JSON array of cart items, e.g. `[{"id":"p1","name":"Margarita","price":12.5,"qty":2}]`. Stored as a single cell — see the plan's rationale (spec says "adds **one row**", and offers JSON or flattened columns; JSON keeps that single-row guarantee regardless of cart size. |
| E | `total` | number | Plain number (PEN), computed client-side from the cart and sent in the POST payload. |

## Setup steps (for the real Sheet, done by the project owner)

1. Create a new Google Sheet.
2. Rename the first tab to exactly `menu`, add the header row from the table above, and fill in product rows.
3. Add a second tab named exactly `orders`, with the header row from the table above (data rows get appended automatically by the Apps Script — leave them empty).
4. Continue with `apps-script/Code.gs` to wire up `doGet`/`doPost` against this Sheet.
