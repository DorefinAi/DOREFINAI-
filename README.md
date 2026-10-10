# DOREFINAI-

Company website for Dorefin AI, built with Next.js (App Router).

## Run locally

```
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (password is `ADMIN_PASSWORD` from `.env.local`)

## What's inside

- **Pages:** Home, Products, a page per product, About, Careers, Contact, Privacy, Terms.
- **Contact form:** posts to `/api/contact` and stores each message.
- **Admin:** inbox for contact messages, and an editor for all site copy.
- **Themes:** dark and light, switched from the navigation.

## Storage

Messages and edited copy are saved as JSON in `data/` (ignored by git). This needs a host with a persistent disk; it will not persist on serverless hosting.

Default copy lives in `lib/content.ts`.
