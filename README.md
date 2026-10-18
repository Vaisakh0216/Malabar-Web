# Malabar Closet (working name)

Mobile-first marketplace for Calicut boutiques, built for the Malabar Fashion Week launch.

## Run it

```
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD and the WhatsApp number
npm run dev                   # http://localhost:3000, admin at /admin (user: admin)
```

## Database (Supabase)

1. In Supabase, open SQL Editor → New query, paste `supabase/schema.sql` and run it.
2. In Vercel (Project → Settings → Environment Variables) add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `ADMIN_PASSWORD` and `NEXT_PUBLIC_WHATSAPP_NUMBER`, then redeploy.

The service role key is read only on the server. Without the two Supabase settings, local development stores
orders in `data/*.json`.

## What works

- Home page with Fashion Week banner, boutique tiles, collections and best sellers
- Boutique, collection and category pages with price filter and sorting
- Product page with sizes, same-day delivery promise, returns info and seller details
- Custom design requests on customisable products (prepaid only, no returns)
- Bag, checkout with Kozhikode pincode check, cash on delivery or online payment
- Order confirmation with WhatsApp help; "Talk to an expert" WhatsApp button on every page
- Admin panel: orders and statuses, custom requests, boutique payouts after commission

## Before launch

- Replace the sample catalogue in `lib/catalog.ts` with real boutiques, products and photos
- Run `supabase/schema.sql` and set the Supabase keys on Vercel (see above)
- Connect the payment gateway; until then online orders get a payment link by hand
- Fill in the brand name, WhatsApp number and grievance officer in `lib/config.ts`
- Confirm serviceable pincodes and the 4 pm cut-off with the delivery partner
