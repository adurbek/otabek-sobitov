# SOBITOV — Next.js sayt + Admin panel

Bu loyiha Next.js (App Router) asosida qurilgan, kontenti SQLite bazasida saqlanadigan va xavfsiz admin panelga ega shaxsiy sayt.

## Tuzilma

- **Ochiq sahifalar:** Bosh sahifa, Men haqimda, Voqealar, Tashabbuslar, Safarlar — barchasi SQLite bazasidan real vaqtda o‘qiydi.
- **Admin panel** (`/admin`): login qilib, barcha kontentni (matn, yangiliklar, tashabbuslar, safarlar, mukofotlar) qo‘shish/tahrirlash/o‘chirish mumkin.
- **Baza:** SQLite, `better-sqlite3` orqali, fayl sifatida `data/sobitov.db` da saqlanadi.
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

## Muhim: joylashtirish (deploy) haqida

`better-sqlite3` fayl asosida ishlaydigan baza bo‘lgani uchun, **doimiy fayl tizimiga ega** muhitda ishlashi kerak:

- ✅ **Mos keladi:** oddiy VPS (masalan DigitalOcean, Hetzner), Railway, Render, yoki Docker konteyner — bu yerlarda `data/sobitov.db` fayli doim saqlanib qoladi.
- ❌ **Mos kelmaydi:** Vercel kabi "serverless" platformalar — ularda fayl tizimi vaqtinchalik bo‘lib, har bir so‘rovda ma’lumotlar yo‘qolib ketishi mumkin.

VPS'da ishga tushirishda `pm2` yoki shunga o‘xshash process manager ishlatishni tavsiya qilaman (`pm2 start npm --name sobitov -- start`).

`data/sobitov.db` faylini muntazam zaxira (backup) qilib turing — bu yerda saytning butun kontenti saqlanadi.

## Kontentni tahrirlash

Admin panelga kirgach:

1. **Men haqimda** — Maqom (ism, yo‘nalish, ta’lim va h.k.), Tarjimai hol matni va Mukofotlar shu yerdan boshqariladi.
2. **Voqealar** — yangiliklar qo‘shish, turini (Voqea / Chiqish / Matbuot e’lon) tanlash, tartibini belgilash.
3. **Tashabbuslar** — loyihalar kartochkalari, "Asosiy karta" belgisi katta/kichik ko‘rinishni belgilaydi.
4. **Safarlar** — tashriflar xronologiyasi.

Barcha `[qavs ichidagi]` matnlar — hali to‘ldirilmagan joylar, admin paneldan to‘ldiring.
