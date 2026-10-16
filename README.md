# NextJS-Base

A starter kit for Next.js front ends with a public site and an admin panel, by [Mohd Amir Khan](https://khanamir.me). It is built to sit on top of [LaravelAPI-Base](https://github.com/madmak787/LaravelAPI-Base), so login, the admin area and site settings work as soon as both are running.

## What's included

- **Next.js 15 App Router** with route groups: `(frontend)` for the public site, `admin/sign-in` and `admin/(authenticated)` for the protected admin panel
- **Admin pages ready to copy:** dashboard, profile, settings, and example form and table pages
- **Auth:** a Zustand store (`src/stores/useAuth.ts`) that keeps the Sanctum token and guards admin pages
- **Site settings:** loaded from the API into a Zustand store (`src/stores/useSettings.ts`)
- **API client:** an Axios helper (`src/lib/utils.ts`) that adds the Bearer token to every request
- **UI:** Tailwind CSS, shadcn/ui (Radix), Lucide icons, dark mode with `next-themes`, toasts with Sonner
- **Forms:** React Hook Form with Zod validation

## Structure

```
src/
  app/
    (frontend)/        public pages
    admin/sign-in/     admin login
    admin/(authenticated)/  protected admin pages
  components/ui/       shadcn/ui components
  stores/              Zustand stores (auth, settings)
  lib/  hooks/  providers/  types/
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_API_URL` to the URL of your LaravelAPI-Base instance (for example `http://localhost:8000/api`).

## Deploy

`.github/workflows/deploy.yml` builds and deploys the `Development`, `Staging`, `UAT` and `Production` branches. Set the URLs and secrets for your own project before using it.
