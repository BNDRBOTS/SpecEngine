# SpecEngine

Architectural Intelligence System — generates Prisma schemas, API routes, and stack recommendations from plain-English system descriptions. Gated behind Gumroad license verification.

---

## Required Environment Variables

Set these in Netlify → Site → Environment Variables (or in `.env.local` for local dev):

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ Yes | Long random string. Generate at randomkeygen.com |
| `GUMROAD_PRODUCT_ID` | ✅ Yes | Your Gumroad product ID (from product URL) |
| `GUMROAD_WEBHOOK_SECRET` | Optional | Gumroad webhook secret for ping route verification |
| `NEXT_PUBLIC_GUMROAD_URL` | Optional | Your Gumroad product page URL (shown on lock screen) |

---

## Local Development

```bash
cp .env.example .env.local
# Fill in .env.local values, then:
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy

Push to GitHub. Netlify auto-deploys on merge to `main`.

Make sure all required environment variables are set in Netlify before deploying.

---

## Architecture

- `app/page.tsx` — UI only. No business logic in the browser bundle.
- `app/api/generate/route.ts` — Session-gated. Runs architecture generation server-side.
- `app/api/gumroad/verify/route.ts` — Validates Gumroad license, issues HttpOnly JWT cookie.
- `app/api/auth/me/route.ts` — Checks if current session is valid.
- `app/api/auth/logout/route.ts` — Clears session cookie.
- `app/api/gumroad/ping/route.ts` — Gumroad webhook receiver (verifies signature if secret is set).
- `middleware.ts` — Server-level guard on `/api/generate`.
