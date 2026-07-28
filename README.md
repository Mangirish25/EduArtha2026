# EduVaani

EduVaani is a production-oriented AI learning app for Indian adult and elderly learners. It explains English educational content in the learner's native language through teaching, examples, summaries, and quiz practice.

## Run locally

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example`.

```bash
GOOGLE_API_KEY=your_google_ai_studio_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

`GOOGLE_API_KEY` is used only by server API routes. The `NEXT_PUBLIC_` Supabase values are required by Supabase Auth in the browser. Legacy projects can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Do not expose a Supabase secret key or service-role key with a `NEXT_PUBLIC_` prefix. Browser Supabase clients should use a publishable key, or a legacy anon key, with Row Level Security enabled.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor to create the learning history table and row-level security policies.

Enable Google Auth in Supabase Auth providers to use Google login.

## Features

- Landing page with dark mode, feature cards, testimonials, and FAQ
- Dashboard with profile, history preview, learning stats, quiz score, and streaks
- Explain screen with modes, Indian language output, PDF upload, OCR image upload, YouTube transcript import, quiz generation, follow-up chat, bookmarks/favorites UI, sharing, and PDF export
- Voice mode with browser speech recognition and text-to-speech controls
- Settings for theme, default language, speech speed, pitch, voice, and high contrast
- Local history fallback plus Supabase sync when configured
- PWA manifest and offline cache shell
