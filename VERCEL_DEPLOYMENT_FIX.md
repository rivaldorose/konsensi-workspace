# Vercel Deployment Fix

## Probleem

Vercel bouwt oude commits (bijv. `2022bc1`) in plaats van de nieuwste commit (`d473807` of later).

## Oplossing

### Optie 1: Handmatige Redeploy (Aanbevolen)

1. Ga naar https://vercel.com/dashboard
2. Selecteer je project "konsensi-workspace"
3. Ga naar de **"Deployments"** tab
4. Klik op **"Deploy"** knop bovenaan
5. Selecteer **"Deploy latest commit"** of kies specifiek de `main` branch
6. Wacht tot de deployment compleet is

### Optie 2: Redeploy Bestaande Deployment

1. Ga naar https://vercel.com/dashboard
2. Selecteer je project
3. Ga naar **"Deployments"** tab
4. Zoek de nieuwste deployment (zou commit `d473807` of hoger moeten zijn)
5. Klik op de **drie puntjes (⋯)** naast die deployment
6. Kies **"Redeploy"**
7. Selecteer **"Use existing Build Cache"** (sneller) of zonder cache (als cache problemen geeft)

### Optie 3: GitHub Webhook Controleren

Als Vercel niet automatisch deployt bij nieuwe commits:

1. Ga naar Vercel Dashboard → Project Settings → Git
2. Controleer of de GitHub integratie correct is verbonden
3. Test de webhook door een nieuwe commit te pushen
4. Als nodig, disconnect en reconnect de GitHub integratie

## Verificatie

Na een nieuwe deployment, controleer in Vercel Dashboard:
- De deployment moet commit `d473807` of hoger zijn
- De build moet succesvol zijn zonder TypeScript errors
- Geen `newPersonInput` errors in de build logs

## Huidige Status

- ✅ **Lokale build**: Succesvol
- ✅ **Code in repository**: Correct (commit `d473807`)
- ❌ **Vercel deployment**: Bouwt nog oude commit `2022bc1`

## Belangrijke Commits

- `2022bc1`: Oude commit met `newPersonInput` bug ❌
- `7467d16`: Fix voor `newPersonInput` → `selectedUserId` ✅
- `349402f`: Fix voor marketing hook TypeScript error ✅
- `d473807`: Nieuwste commit met alle fixes ✅

