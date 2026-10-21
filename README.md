# Portfolio RIFS

Next.js 15 portfolio with a Supabase-backed admin panel.

## Requirements

- Node.js **20 or newer** (Next.js 15 refuses to start on Node 18.8)
- npm 10+

If you use nvm, `nvm use` picks up `.nvmrc`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the Supabase and Resend credentials. The app still runs
without them, but the admin panel and contact form stay disabled.

## Access

The dev server listens on **http://localhost:3000**. Do not open the project
through the Laragon/Apache virtual host (`http://localhost/Portfolio_RIFS`):
Apache serves the folder as static files and returns 404 because Next.js is not
running behind it.

To reach the app from another device, use the `Network` URL printed by
`npm run dev` and allow port 3000 through the firewall.

## Scripts

- `npm run dev` - development server on port 3000
- `npm run build` - production build
- `npm run start` - serve the production build
- `npm run lint` - ESLint
