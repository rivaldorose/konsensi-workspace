# Supabase Database Setup

Dit bestand bevat het database schema voor Konsensi Workspace.

## Installatie

1. Ga naar je Supabase Dashboard: https://supabase.com/dashboard
2. Selecteer je project
3. Ga naar de **SQL Editor**
4. Kopieer de inhoud van `migrations/001_initial_schema.sql`
5. Plak het in de SQL Editor
6. Klik op **Run** om het schema aan te maken

## Database Schema

Het schema bevat de volgende tabellen:

### Users
Extends Supabase auth.users met extra informatie:
- `id` (UUID, references auth.users)
- `email`
- `full_name`
- `avatar_url`
- `role` (admin, manager, member)
- `created_at`, `updated_at`

### Apps
Beheer van alle apps/producten:
- Basis info (name, description, icon)
- Status (idea, development, beta, live, paused, archived)
- URLs (production, staging, github)
- Owner en team members
- Tech stack (JSON)
- Metrics (JSON)

### Partners
Partnership management:
- Contact informatie
- Status (to_contact, in_gesprek, active, paused)
- Financiële informatie (annual_value)
- Next actions
- Tags en notes

### Events
Events en campagnes:
- Type (pilot, launch, funding, partnership, campaign, other)
- Status (planning, active, completed, on_hold)
- Prioriteit
- Budget tracking
- Success criteria
- Team members

### Goals
Quarterly goals:
- Category (product, partnerships, funding, marketing, operations, team)
- Status (not_started, on_track, at_risk, completed)
- Progress tracking
- Link naar events

## Security

Alle tabellen hebben **Row Level Security (RLS)** ingeschakeld met de volgende regels:

- **View**: Alle team members kunnen alles bekijken
- **Create**: Team members kunnen items aanmaken (wordt owner)
- **Update**: Owners, team members en managers kunnen items updaten
- **Delete**: Alleen owners en admins kunnen items verwijderen

## Features

- ✅ Auto-update `updated_at` timestamps via triggers
- ✅ Auto-create user profile bij signup via trigger
- ✅ Indexes voor betere performance
- ✅ Views voor eenvoudigere queries
- ✅ Type checking via CHECK constraints

## Test Data (Optioneel)

Na het runnen van het schema kun je test data toevoegen:

```sql
-- Insert test user (je moet eerst inloggen via Supabase Auth)
-- De trigger maakt automatisch een user profile aan

-- Insert test apps
INSERT INTO public.apps (name, description, category, owner_id, status)
VALUES (
  'Test App',
  'Een test applicatie',
  'Product',
  (SELECT id FROM public.users LIMIT 1),
  'development'
);

-- Insert test partners
INSERT INTO public.partners (name, type, sector, contact_name, contact_email, owner_id, status)
VALUES (
  'Test Partner',
  'Technologie',
  'SaaS',
  'John Doe',
  'john@partner.com',
  (SELECT id FROM public.users LIMIT 1),
  'active'
);
```

## Volgende Stappen

1. Run het SQL schema in Supabase SQL Editor
2. Test de verbinding via `/test-supabase` pagina
3. Maak een test account aan via Supabase Auth
4. Begin met het bouwen van de frontend features

