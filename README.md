# OTABEK SOBITOV — Next.js sayt + Admin panel

Bu loyiha Next.js (App Router) asosida qurilgan, kontenti SQLite (lokal fayl yoki Turso bulut bazasi) da saqlanadigan va xavfsiz admin panelga ega shaxsiy sayt.

## Tuzilma

- **Ochiq sahifalar:** Bosh sahifa, Men haqimda, Voqealar, Tashabbuslar, Safarlar — barchasi SQLite bazasidan real vaqtda o‘qiydi.
- **Admin panel** (`/admin`): login qilib, barcha kontentni (matn, yangiliklar, tashabbuslar, safarlar, mukofotlar) qo‘shish/tahrirlash/o‘chirish mumkin.
- **Baza:** SQLite, `@libsql/client` orqali. Lokal rejimda `data/sobitov.db` fayli, productionda (masalan Vercel) — Turso bulut bazasi (`TURSO_DATABASE_URL` berilganda).
- **Xavfsizlik:**
  - Admin paroli bazada faqat **bcrypt hash** ko‘rinishida saqlanadi (ochiq matnda emas).
  - Kirishdan so‘ng **JWT sessiya tokeni** beriladi va faqat serverga ko‘rinadigan, JavaScript orqali o‘qib bo‘lmaydigan **httpOnly cookie**da saqlanadi (8 soat amal qiladi).
  - `/admin/*` sahifalari va yozish uchun barcha API'lar (`POST`/`PUT`/`DELETE`) **middleware** orqali himoyalangan — tokensiz kirish imkonsiz.
  - Login endpointida **rate limit** bor (10 daqiqada 8 ta noto‘g‘ri urinishdan keyin bloklanadi).
  - Faqat `GET` so‘rovlari (ya’ni saytni ko‘rish) tokensiz ochiq — bu saytning o‘zi ishlashi uchun kerak.

## O‘rnatish

```bash
npm install
cp .env.example .env.local
```

`.env.local` faylini oching va quyidagilarni albatta o‘zgartiring:

- `ADMIN_USERNAME` — admin login
- `ADMIN_PASSWORD` — admin parol (kamida 8 belgi)
- `JWT_SECRET` — uzun tasodifiy satr. Yaratish uchun: `openssl rand -base64 48`

Keyin admin foydalanuvchini bazada yarating:

```bash
npm run seed
```

## Ishga tushirish (rivojlantirish rejimi)

```bash
npm run dev
```

Sayt: http://localhost:3000
Admin: http://localhost:3000/admin/login

## Production uchun build

```bash
npm run build
npm run start
```

## Vercel'da joylashtirish (Turso bilan)

Vercel serverless bo‘lgani uchun lokal SQLite fayli ishlamaydi — baza [Turso](https://turso.tech) bulutida saqlanadi:

1. turso.tech da bepul akkaunt oching, yangi database yarating.
2. Database URL (`libsql://...`) va auth token oling.
3. Lokal `.env.local` ga `TURSO_DATABASE_URL` va `TURSO_AUTH_TOKEN` ni yozing.
4. Lokal kontentni bulutga ko‘chiring: `npm run migrate` (admin foydalanuvchi ham ko‘chadi).
5. Vercel loyihasining **Settings → Environment Variables** bo‘limiga qo‘shing: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`.
6. Rasm yuklash ishlashi uchun Vercel'da **Storage → Blob** store yarating (`BLOB_READ_WRITE_TOKEN` avtomatik ulanadi).
7. Redeploy qiling.

VPS'da esa hech qanday Turso kerak emas — `TURSO_DATABASE_URL` ni bo‘sh qoldirsangiz lokal `data/sobitov.db` fayli ishlatiladi. `pm2` bilan ishga tushirish tavsiya etiladi (`pm2 start npm --name sobitov -- start`) va baza faylini muntazam zaxiralang.

## Kontentni tahrirlash

Admin panelga kirgach:

1. **Men haqimda** — Maqom (ism, yo‘nalish, ta’lim va h.k.), Tarjimai hol matni va Mukofotlar shu yerdan boshqariladi.
2. **Voqealar** — yangiliklar qo‘shish, turini (Voqea / Chiqish / Matbuot e’lon) tanlash, tartibini belgilash.
3. **Tashabbuslar** — loyihalar kartochkalari, "Asosiy karta" belgisi katta/kichik ko‘rinishni belgilaydi.
4. **Safarlar** — tashriflar xronologiyasi.

Barcha `[qavs ichidagi]` matnlar — hali to‘ldirilmagan joylar, admin paneldan to‘ldiring.
