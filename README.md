# Konsensi Workspace

Team workspace management platform for Konsensi.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **UI Components**: shadcn/ui + custom components
- **State**: React Query + React Context
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: Tip-Tap Editor
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Konsensi Workspace"
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── context/         # React context providers
└── styles/          # Global styles
```

## Features

- Apps management
- Partners management
- Events tracking
- Chat functionality
- Documentation
- Marketing tools
- Contracts management
- Roadmap planning
- Analytics
- Notifications
- Search
- Settings

## Development

This project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality

# Marketing Hook Fix Verified Mon Dec 29 12:20:32 CET 2025
