# Vercel Environment Variables

Dit document bevat alle environment variables die je nodig hebt voor Vercel deployment.

## Environment Variables voor Vercel

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://dnurvstvaukbjdbfhrgs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Kk9ODgppGmjm-GOtM5EaVg_W-BvDfH2
```

### App Configuratie
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Konsensi Workspace
```

## Hoe toe te voegen in Vercel

1. Ga naar je Vercel Dashboard: https://vercel.com/dashboard
2. Selecteer je project (of maak een nieuw project aan)
3. Ga naar **Settings** → **Environment Variables**
4. Voeg de volgende variabelen toe:

### Voor Production, Preview, en Development:

**1. NEXT_PUBLIC_SUPABASE_URL**
- Value: `https://dnurvstvaukbjdbfhrgs.supabase.co`
- Environments: Production, Preview, Development

**2. NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Value: `sb_publishable_Kk9ODgppGmjm-GOtM5EaVg_W-BvDfH2`
- Environments: Production, Preview, Development

**3. NEXT_PUBLIC_APP_URL**
- Value: `https://your-app.vercel.app` (vervang met je echte Vercel URL na deployment)
- Environments: Production, Preview, Development

**4. NEXT_PUBLIC_APP_NAME**
- Value: `Konsensi Workspace`
- Environments: Production, Preview, Development

## Belangrijk

- ⚠️ Vervang `NEXT_PUBLIC_APP_URL` met je echte Vercel URL na de eerste deployment
- ✅ Alle variabelen die met `NEXT_PUBLIC_` beginnen zijn publiek toegankelijk (veilig voor client-side code)
- 🔒 Gebruik **niet** de secret key in environment variables met `NEXT_PUBLIC_` prefix
- 📝 Na het toevoegen van environment variables, moet je een nieuwe deployment triggeren

## Snelle Copy-Paste voor Vercel Dashboard

Gebruik deze waarden direct in het Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://dnurvstvaukbjdbfhrgs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Kk9ODgppGmjm-GOtM5EaVg_W-BvDfH2
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Konsensi Workspace
```

