# Directory Message Board

A lightweight message board for communities, developer directories, and open-source projects.

Visitors can post messages, optionally enhance them with AI (emoji mode or translation), and submit them for moderation. Admins review incoming messages before they appear publicly.

## Features

- Public directory feed with approved messages
- Post form in a side sheet
- AI moderation before submission
- Optional AI enhancements:
  - `original` (no changes)
  - `emoji` (emoji-only version)
  - `translate` (to a selected language)
- Admin dashboard for approving/rejecting submissions
- Session-based admin authentication
- Neon Postgres storage
- Built with Next.js App Router + Tailwind + shadcn/ui

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Neon Serverless Postgres (`@neondatabase/serverless`)
- Vercel AI SDK (`ai`)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL=postgres://...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

Notes:

- `DATABASE_URL` is required for all database reads/writes.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` are required for admin login.
- No admin credential fallbacks are stored in source code.

### 3) Create database tables

This project expects a `guestbook_messages` table and uses an `admin_sessions` table (auto-created when the first admin session is created).

Run this SQL once on your Postgres database:

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

CREATE INDEX IF NOT EXISTS idx_guestbook_messages_status ON guestbook_messages (status);
CREATE INDEX IF NOT EXISTS idx_guestbook_messages_approved_at ON guestbook_messages (approved_at DESC);
```

### 4) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Create a production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## App Structure

- `app/page.tsx` - Public directory page
- `components/post-message-sheet.tsx` - Submission form UI
- `app/actions/message-actions.ts` - Submit/approve/reject actions
- `app/actions/ai-actions.ts` - AI moderation/translation/emoji transforms
- `app/admin/login/page.tsx` - Admin login screen
- `app/admin/page.tsx` - Admin moderation dashboard
- `lib/auth.ts` - Admin auth + session cookie helpers
- `lib/db.ts` - Database access helpers

## Customizing for Your OSS Project

You can quickly adapt this app for:

- Contributor wall
- Release shout-outs
- Event attendee board
- Community testimonials
- Sponsor or partner directory notes

Common customizations:

- Change branding and copy in `app/page.tsx`
- Add fields to the submission form in `components/post-message-sheet.tsx`
- Update validation/moderation rules in `app/actions/message-actions.ts`
- Adjust moderation workflow in `components/admin-message-list.tsx`

## Moderation Flow

1. User submits a message.
2. AI moderation runs first.
3. If accepted, message is saved as `pending`.
4. Admin approves or rejects in `/admin`.
5. Only `approved` messages are shown on the public page.

## Security Notes

- Store all secrets in environment variables only.
- Use a strong `ADMIN_PASSWORD` in production.
- Use HTTPS and secure environment management in deployment.
- Consider password hashing + full user auth if you need multi-admin support.

## Deployment

You can deploy to any platform that supports Next.js and environment variables.

Minimum production env vars:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## License

Choose a license that fits your project (for example, MIT) and add a `LICENSE` file if needed.
