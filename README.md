This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Supabase Integration (Dynamic Data)

Pages `app/posts/page.tsx` and `app/announcements/page.tsx` now attempt to fetch data from Supabase. If environment variables are missing, they fall back to the existing static arrays so local development still works.

### 1. Environment Variables
Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
```

Restart the dev server after adding these.

### 2. Database Schema (SQL)
Run in Supabase SQL Editor:

```sql
create table if not exists public.categories (
	id bigserial primary key,
	name text not null unique,
	slug text generated always as (replace(lower(name), ' ', '-')) stored,
	created_at timestamptz default now()
);

create table if not exists public.posts (
	id bigserial primary key,
	title text not null,
	excerpt text not null,
	content text not null,
	author text not null,
	date date not null default current_date,
	image text,
	category_id bigint references public.categories(id) on delete set null,
	likes int default 0,
	comments int default 0,
	views int default 0,
	created_at timestamptz default now()
);

create table if not exists public.announcements (
	id bigserial primary key,
	title text not null,
	content text not null,
	date date not null,
	time text not null,
	type text not null,
	priority text check (priority in ('low','medium','high')) default 'medium',
	is_pinned boolean default false,
	created_at timestamptz default now()
);

create table if not exists public.gallery (
	id bigserial primary key,
	filename text,
	src text not null,
	created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery enable row level security;

-- Public read policies
create policy if not exists "public_read_categories" on public.categories for select using ( true );
create policy if not exists "public_read_posts" on public.posts for select using ( true );
create policy if not exists "public_read_announcements" on public.announcements for select using ( true );
create policy if not exists "public_read_gallery" on public.gallery for select using ( true );
```

### 3. Optional Seed Data
Insert some starter records mirroring the static arrays to validate UI quickly.

### 4. Extending
- Add auth + admin pages for create/update/delete.
- Migrate gallery, activities, leaders to tables.
- Add pagination ("Load More").
- Replace counts (likes/views/comments) with real-time tracking or server actions.

### 5. Notes
- The Supabase client is initialized in `lib/supabaseClient.ts` using public anon key (safe for read-only public data with RLS).
- Server Components perform the fetch at request time; consider ISR or caching if performance becomes an issue.
