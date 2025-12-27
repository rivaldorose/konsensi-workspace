# Vercel Deployment Setup

## Project Naam

Voor Vercel project naam gebruik je:
```
konsensiworkspace
```

of met underscore:
```
konsensi_workspace
```

**Belangrijk**: 
- Geen spaties gebruiken
- Alleen letters, cijfers en underscores
- Kan niet beginnen met een cijfer

## Stap 1: Import Project in Vercel

1. Ga naar https://vercel.com/dashboard
2. Klik op **"Add New Project"**
3. Selecteer je GitHub repository: `rivaldorose/konsensi-workspace`
4. Vercel detecteert automatisch Next.js

## Stap 2: Project Configuratie

- **Framework Preset**: Next.js (automatisch gedetecteerd)
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (standaard)
- **Output Directory**: `.next` (standaard)
- **Install Command**: `npm install` (standaard)

## Stap 3: Environment Variables

Ga naar **Environment Variables** en voeg toe:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dnurvstvaukbjdbfhrgs.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Kk9ODgppGmjm-GOtM5EaVg_W-BvDfH2` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://konsensiworkspace.vercel.app` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `Konsensi Workspace` | Production, Preview, Development |

**Let op**: Na de eerste deployment, vervang `NEXT_PUBLIC_APP_URL` met je echte Vercel URL.

## Stap 4: Deploy

1. Klik op **"Deploy"**
2. Wacht tot deployment compleet is
3. Je krijgt een URL zoals: `https://konsensiworkspace.vercel.app`
4. Update daarna `NEXT_PUBLIC_APP_URL` met deze URL

## Stap 5: Custom Domain (Optioneel)

Als je een custom domain wilt:
1. Ga naar **Settings** → **Domains**
2. Voeg je domain toe
3. Volg de DNS instructies

## Troubleshooting

### Build Fails
- Check of alle environment variables zijn toegevoegd
- Check de build logs voor specifieke errors

### Environment Variables niet geladen
- Zorg dat ze allemaal `NEXT_PUBLIC_` prefix hebben voor client-side variabelen
- Trigger een nieuwe deployment na het toevoegen van variabelen

### Database connectie werkt niet
- Check of de Supabase URL en key correct zijn
- Check of RLS policies correct zijn ingesteld in Supabase

