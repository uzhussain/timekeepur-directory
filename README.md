# Directory Message Board

A clean, moderated message board for communities and OSS directories.

Built with Next.js, powered by **Vercel AI Gateway** for AI workflows, and backed by **Neon Postgres**.

## Features

- Public feed of approved messages
- Submission form with optional AI enhancement (`original`, `emoji`, `translate`)
- AI moderation before messages are saved
- Admin dashboard to approve or reject submissions
- Session-based admin auth with secure cookies

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Vercel AI SDK + Vercel AI Gateway
- Neon Serverless Postgres

## Quick Start

### 1) Install

```bash
npm install
```

### 2) Set environment variables

Create `.env.local`:

```bash
DATABASE_URL=postgres://...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
AI_GATEWAY_API_KEY=...
```

### 3) Create the `guestbook_messages` table

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

### 4) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - local development
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint checks

## Key Files

- `app/page.tsx` - public directory UI
- `components/post-message-sheet.tsx` - message submission form
- `app/actions/ai-actions.ts` - moderation/translation/emoji generation
- `app/actions/message-actions.ts` - submission + moderation actions
- `app/admin/login/page.tsx` - admin login
- `app/admin/page.tsx` - admin moderation dashboard
- `lib/db.ts` - Neon database queries
- `lib/auth.ts` - admin auth/session logic

## Customize for OSS

- Update branding and copy in `app/page.tsx`
- Add or remove form fields in `components/post-message-sheet.tsx`
- Tune AI behavior in `app/actions/ai-actions.ts`
- Adjust moderation logic in `app/actions/message-actions.ts`

## Security Notes

- Keep all secrets in environment variables
- Use a strong `ADMIN_PASSWORD` in production
- Use HTTPS in production

## License

Add the license that matches your project (for example, MIT).
