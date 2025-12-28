# User Profile Aanmaken

## Aanbevolen Methode: Via Supabase Dashboard

1. Ga naar je Supabase Dashboard
2. Klik op **Authentication** in de sidebar
3. Klik op **Users**
4. Klik op **Add user** (groene knop)
5. Vul in:
   - **Email**: je email adres
   - **Password**: een sterk wachtwoord
   - **Auto Confirm User**: vink dit aan als je geen email verificatie wilt
6. Klik op **Create user**

Het profiel wordt automatisch aangemaakt door de trigger `handle_new_user()`.

## Admin Gebruiker Maken

Na het aanmaken van de gebruiker via de dashboard:

1. Noteer de **User ID** (UUID) van de aangemaakte gebruiker
2. Run dit SQL script in de SQL Editor:

```sql
UPDATE public.users
SET role = 'admin'
WHERE id = 'USER_ID_HIER';
```

Vervang `USER_ID_HIER` met de daadwerkelijke UUID van de gebruiker.

## Check of Profiel bestaat

Run dit om te checken of je profiel bestaat:

```sql
SELECT id, email, full_name, role, created_at
FROM public.users
ORDER BY created_at DESC;
```

