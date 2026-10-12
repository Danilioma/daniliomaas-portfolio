# Danilio Maas | Personal website

Premium bilingual (English / Dutch) personal branding website built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **GSAP + ScrollTrigger**, **Lenis** and **Lucide**.

## Features

- Password gate with a full-screen welcome experience (login stored in `localStorage`, shown only once)
- English / Dutch with a language switcher (`locales/en.json`, `locales/nl.json`), choice is remembered
- Career Journey: Education (incl. current internship) and Work experience as separate timelines
- "Why companies choose me" orbit, animated banner, content/craft accordion
- Fullscreen contact overlay (opened by "Start a conversation") and a dedicated `/contact` page
- Downloadable CV (`public/cv/CV-Danilio-Maas.pdf`)
- SEO: metadata, Open Graph, Twitter cards, JSON-LD (Person), `robots.ts`, `sitemap.ts`

## Requirements

Node.js 18.18 or newer (Node 20 LTS recommended).

## Install and run

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000
```

Production check before you deploy:

```bash
npm run typecheck
npm run build
npm start
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your public URL (SEO, sitemap, Open Graph). Example: `https://danilio-maas.vercel.app` |
| `NEXT_PUBLIC_ACCESS_HASH` | Optional. SHA-256 hash of the access password. If empty, the default hash in `lib/site.ts` is used |

Create a hash for a new password:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
```

### About the password gate

The gate runs in the browser. The password is only stored as a SHA-256 hash, but anyone with technical knowledge can still read the page source or guess the password. Treat it as a "soft gate" that keeps casual visitors out, not as real security. Do not publish anything on this site that must stay private. For real protection use Vercel Deployment Protection (password / Vercel Authentication) in the project settings.

## Content

- All text lives in `locales/en.json` and `locales/nl.json` (same keys in both files).
- Photos: `public/images/` (`portrait.jpg`, `street.jpg`, `og.jpg` for social sharing).
- CV: replace `public/cv/CV-Danilio-Maas.pdf` to update the download.
- Contact details and social links: `lib/site.ts`.
- The contact form opens the visitor's email app (`mailto:`). To receive messages directly, connect a form service or an API route (for example Resend) in `components/ContactScene.tsx`.

## Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/danilio-maas-site.git
git push -u origin main
```

Tip: create the repository as **private** if you do not want the photos and CV to be publicly downloadable from GitHub.

## Deploy to Vercel

1. Go to https://vercel.com/new and import the GitHub repository.
2. Framework preset: **Next.js** (detected automatically). Build command and output directory stay default.
3. Add the environment variables from the table above (at least `NEXT_PUBLIC_SITE_URL`).
4. Click **Deploy**. Every push to `main` deploys automatically.
5. Optional: add a custom domain under **Settings, Domains** and update `NEXT_PUBLIC_SITE_URL`.

## Project structure

```
app/            layout, pages (home, contact), robots, sitemap, global CSS
components/     UI sections, contact scene, password gate, motion helpers
hooks/          useMagnetic, useMouseParallax, useLockBodyScroll
lib/            site config, i18n provider, gsap setup, sha256
locales/        en.json, nl.json
public/         images, cv
```

## Notes

- Light theme only.
- Animations respect `prefers-reduced-motion`.
- Lighthouse scores depend on hosting and image sizes; images use `next/image` (AVIF/WebP).
