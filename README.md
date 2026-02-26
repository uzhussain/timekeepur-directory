# Directory Message Board

A clean, moderated message board for communities and OSS directories.

Built with **Next.js**, powered by **Vercel AI Gateway** for AI workflows, and backed by **Neon Postgres**.

## Features

- Public feed of approved messages
- Message submission sheet with AI enhancement options (`original`, `emoji`, `translate`)
- AI moderation before save
- Admin queue for approve/reject
- Session-based admin authentication

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Vercel AI SDK + Vercel AI Gateway
- Neon Serverless Postgres

## Quick Start

1. Install dependencies

```bash
pnpm install
```

2. Copy env file and set values

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AI_GATEWAY_API_KEY`

3. Create the `guestbook_messages` table

```sql
CREATE TABLE IF NOT EXISTS guestbook_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  original_message TEXT,
  enhanced_type TEXT NOT NULL DEFAULT 'original',
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'pending',
  moderation_notes TEXT,
  moderated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);
```

`admin_sessions` is created automatically on first admin login.

4. Start the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - local development
- `pnpm build` - production build
- `pnpm start` - start production server
- `pnpm lint` - lint checks

## OSS Notes

- Read `CONTRIBUTING.md` before opening a PR
- See `SECURITY.md` for responsible disclosure
- Follow `CODE_OF_CONDUCT.md` for community standards

## Official Author

**Uzair Hussain**  
Website: https://www.timekeepur.com/  
GitHub: https://github.com/uzhussain

## License

MIT. See `LICENSE`.
