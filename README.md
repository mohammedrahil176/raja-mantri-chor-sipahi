# Raja Mantri Chor Sipahi (Online Multiplayer)

A real-time multiplayer implementation of the classic Indian 4-player deduction game using React, Tailwind CSS, and Supabase Realtime PostgreSQL.

## Features
- **Create / Join Rooms**: 6-character room codes for easy sharing.
- **Real-Time Multiplayer**: Instant state synchronization across 4 different devices via WebSockets.
- **Secure Hidden Roles**: Built with Row Level Security and Secure RPCs. No player can inspect network traffic to find another player's role.
- **Host Controls**: Auto-transfer of host privileges and robust room management.
- **Reconnection**: Safely refresh the page or switch tabs; your session is restored automatically.

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- Backend: Supabase (PostgreSQL + Realtime)

## Supabase Setup
This game requires a Supabase backend to synchronize state.

1. Create a free project on [Supabase](https://supabase.com/).
2. Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor.
3. Get your API keys from Project Settings > API.
4. Rename `.env.example` to `.env.local` and add your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Development
```bash
npm install
npm run dev
```

## Deployment (Vercel / Netlify)
When deploying to Vercel or Netlify, make sure to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your project's Environment Variables settings.
