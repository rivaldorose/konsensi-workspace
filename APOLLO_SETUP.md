# Apollo API Setup

## Environment Variables

### Local Development

Voeg de volgende regel toe aan je `.env.local` bestand:

```env
APOLLO_API_KEY=FhD3IJp1A3_ky6C5--r6oQ
```

### Vercel Deployment

**Ja, je moet de Apollo API key ook in Vercel zetten!**

1. Ga naar je [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecteer je project (konsensi-workspace)
3. Ga naar **Settings** > **Environment Variables**
4. Voeg een nieuwe variable toe:
   - **Name**: `APOLLO_API_KEY`
   - **Value**: `FhD3IJp1A3_ky6C5--r6oQ`
   - **Environment**: Selecteer alle (Production, Preview, Development)
5. Klik op **Save**
6. **Belangrijk**: Je moet een nieuwe deployment triggeren na het toevoegen van environment variables
   - Ga naar **Deployments** tab
   - Klik op de drie puntjes naast de laatste deployment
   - Klik op **Redeploy**

## API Endpoint

De Apollo API wordt aangeroepen via een server-side Next.js API route:
- **Path**: `/api/apollo/search`
- **Method**: POST
- **Auth**: Vereist (gebruiker moet ingelogd zijn)

## Gebruik

De API wordt automatisch gebruikt wanneer je op "Generate Leads" klikt op de `/partners/discovery` pagina.

## Apollo API Documentatie

Voor meer informatie over de Apollo API, zie:
- [Apollo API Documentation](https://apolloio.github.io/apollo-api-docs/)

