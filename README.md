# Safe Haven

A private, encrypted social platform built for trusted communities. Safe Haven lets users connect in secure circles, share messages, and express themselves — with Spotify integration showing what they're listening to in real time.

---

## Stack

- **Next.js 16** (App Router, `src/` structure)
- **Supabase** — auth (email + OTP), database, SSR sessions
- **Tailwind CSS** — styling
- **Spotify Web API** — OAuth 2.0, real-time now-playing widget
- **ngrok** — HTTPS tunnel for local Spotify OAuth during development

---

## Features

- Email/password signup with OTP email verification
- Secure login with Supabase Auth and cookie-based SSR sessions
- Protected routes via `src/proxy.ts` (Next.js 16 route middleware)
- Dashboard with real user data (name, greeting, avatar initials)
- Spotify "On the Aux" widget — shows currently playing track, progress bar, album art
- Communities, Messaging, Notifications, and Profile pages (UI complete, data wiring in progress)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-ngrok-url.ngrok-free.app
SPOTIFY_REDIRECT_URI=https://your-ngrok-url.ngrok-free.app/callback
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 3. Run the dev server

```bash
npm run dev
```

### 4. Spotify OAuth (local dev)

Spotify requires an HTTPS redirect URI. Use [ngrok](https://ngrok.com) to tunnel localhost:

```bash
ngrok http 3000
```

Update `.env.local`, `src/app/api/spotify/connect/route.ts`, `src/app/callback/route.ts`, and `next.config.ts` (`allowedDevOrigins`) with the new ngrok URL each time it changes.

Add the ngrok callback URL to your Spotify app's redirect URIs at [developer.spotify.com](https://developer.spotify.com/dashboard).

---

## Project Structure

```
src/
  app/
    (auth)/
      login/          # Login page
      signup/         # Signup page with OTP verification
    (main)/
      dashboard/      # Main dashboard
      communities/    # Communities browser
      messaging/      # Direct messages
      notifications/  # Notification feed
      profile/        # User profile
    api/
      spotify/
        connect/      # Initiates Spotify OAuth
        now-playing/  # Fetches current track, handles token refresh
      auth/
        logout/       # Clears Supabase session
    callback/         # Spotify OAuth callback (exchanges code for tokens)
    auth/callback/    # Supabase email verification callback
  components/
    dashboard/
      SpotifyWidget   # Real-time Spotify now-playing widget
  lib/
    supabase/
      client.ts       # Browser Supabase client
      server.ts       # Server-side Supabase client (SSR cookies)
  proxy.ts            # Route protection middleware (Next.js 16)
supabase/
  spotify_tokens.sql  # Schema for storing Spotify OAuth tokens
```

---

## What's Left

- [ ] Wire Communities page to real Supabase data (schema + queries)
- [ ] Wire Messaging to real conversations (schema + real-time subscriptions)
- [ ] Wire Notifications to real events
- [ ] Wire Profile to real user data (bio, avatar upload, gallery)
- [ ] Google OAuth login
- [ ] Forgot password flow
- [ ] Production deployment (Vercel + permanent redirect URI for Spotify)
- [ ] Replace ngrok dependency with a stable domain for Spotify OAuth

---

## Supabase Setup

Run `supabase/spotify_tokens.sql` in your Supabase SQL editor to create the `spotify_tokens` table required for the Spotify integration.
