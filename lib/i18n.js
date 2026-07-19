// Sayt tillari: uz (lotin, asl), oz (kirill — avtomatik transliteratsiya),
// ru / en (interfeys lug'at orqali tarjima qilinadi, kontent asl tilida qoladi).

export const SITE_LANGS = [
  { code: "uz", short: "O'Z", name: "O'zbekcha" },
  { code: "oz", short: "ЎЗ", name: "Ўзбекча" },
  { code: "ru", short: "РУ", name: "Русский" },
  { code: "en", short: "EN", name: "English" },
];

const STORAGE_KEY = "site_lang";

// ---------- Lug'at (kalitlar oddiy ' apostrof bilan yoziladi) ----------
const DICT = {
  "Men haqimda": { ru: "Обо мне", en: "About me" },
  "Voqealar": { ru: "События", en: "News" },
  "Tashabbuslar": { ru: "Инициативы", en: "Initiatives" },
  "Safarlar": { ru: "Поездки", en: "Trips" },
  "O'ZBEKISTON RESPUBLIKASI": { ru: "РЕСПУБЛИКА УЗБЕКИСТАН", en: "REPUBLIC OF UZBEKISTAN" },
  "YOSHLAR PARLAMENTI RAISI": { ru: "ПРЕДСЕДАТЕЛЬ МОЛОДЁЖНОГО ПАРЛАМЕНТА", en: "CHAIRMAN OF THE YOUTH PARLIAMENT" },
  "Yoshlar parlamenti raisi": { ru: "Председатель Молодёжного парламента", en: "Chairman of the Youth Parliament" },
  "Ijtimoiy tarmoqlardagi": { ru: "Официальные страницы", en: "Official pages" },
  "rasmiy sahifalar": { ru: "в социальных сетях", en: "on social media" },
  "Sayt bo'yicha qidiruv": { ru: "Поиск по сайту", en: "Site search" },
  "So'zni kiriting": { ru: "Введите слово", en: "Type a word" },
  "Qidirilmoqda...": { ru: "Идёт поиск...", en: "Searching..." },
  "Hech narsa topilmadi": { ru: "Ничего не найдено", en: "No results found" },
  "Voqea": { ru: "Событие", en: "News" },
  "Tashabbus": { ru: "Инициатива", en: "Initiative" },
  "Safar": { ru: "Поездка", en: "Trip" },
  "Video": { ru: "Видео", en: "Video" },
  "Mukofot": { ru: "Награда", en: "Award" },
  "Sahifa": { ru: "Страница", en: "Page" },
  "Bosh sahifa": { ru: "Главная", en: "Home" },
  "Tashrif": { ru: "Визит", en: "Visit" },
  "Bo'lim": { ru: "Раздел", en: "Section" },

  "So'nggi yangiliklar": { ru: "Последние новости", en: "Latest news" },
  "Barcha so'nggi yangiliklar": { ru: "Все последние новости", en: "All latest news" },
  "Partiya raisi ijtimoiy tarmoqlarda:": { ru: "Председатель партии в социальных сетях:", en: "The party chairman on social media:" },
  "Mediateka": { ru: "Медиатека", en: "Media library" },

  "Xorijga tashriflar": { ru: "Зарубежные визиты", en: "Foreign visits" },
  "Hududlarga tashriflar": { ru: "Визиты в регионы", en: "Regional visits" },
  "Tashrif buyurilmagan": { ru: "Визитов не было", en: "No visits" },
  "1 marta → ko'p marta": { ru: "1 раз → много раз", en: "once → many times" },
  "Vatanimiz": { ru: "Наша Родина", en: "Our homeland" },

  "Instagram sahifasini ochish ↗": { ru: "Открыть страницу Instagram ↗", en: "Open Instagram page ↗" },
  "Facebook sahifasini ochish ↗": { ru: "Открыть страницу Facebook ↗", en: "Open Facebook page ↗" },
  "X sahifasini ochish ↗": { ru: "Открыть страницу X ↗", en: "Open X page ↗" },
  "LinkedIn profilini ochish ↗": { ru: "Открыть профиль LinkedIn ↗", en: "Open LinkedIn profile ↗" },
  "Facebook sahifasidagi postlar, e'lonlar va yangiliklar bilan shu yerdan tanishishingiz mumkin.": {
    ru: "Здесь вы можете ознакомиться с постами, объявлениями и новостями на странице Facebook.",
    en: "Here you can follow posts, announcements and news from the Facebook page.",
  },
  "X (Twitter) sahifasidagi fikrlar va postlar bilan shu yerdan tanishishingiz mumkin.": {
    ru: "Здесь вы можете ознакомиться с мыслями и постами на странице X (Twitter).",
    en: "Here you can follow thoughts and posts from the X (Twitter) page.",
  },
  "LinkedIn sahifasidagi postlar, video va rasmlar bilan shu yerdan tanishishingiz mumkin.": {
    ru: "Здесь вы можете ознакомиться с постами, видео и фотографиями на странице LinkedIn.",
    en: "Here you can follow posts, videos and photos from the LinkedIn page.",
  },
  "Instagram sahifasidagi postlar bilan shu yerdan tanishishingiz mumkin.": {
    ru: "Здесь вы можете ознакомиться с постами на странице Instagram.",
    en: "Here you can follow posts from the Instagram page.",
  },

  "Yangiliklar": { ru: "Новости", en: "News" },
  "So'nggi faoliyat, chiqishlar va e'lonlar bilan tanishing.": {
    ru: "Ознакомьтесь с последней деятельностью, выступлениями и объявлениями.",
    en: "Explore the latest activities, speeches and announcements.",
  },
  "Global tashabbuslar": { ru: "Глобальные инициативы", en: "Global initiatives" },
  "Ustuvor yo'nalishlar va olib borilayotgan loyihalar haqida qisqacha ma'lumot.": {
    ru: "Кратко о приоритетных направлениях и текущих проектах.",
    en: "A brief overview of priority areas and ongoing projects.",
  },
  "Xalqaro safarlar": { ru: "Международные поездки", en: "International trips" },
  "Konferensiyalar, forumlar va tashriflar xronologiyasi.": {
    ru: "Хронология конференций, форумов и визитов.",
    en: "A timeline of conferences, forums and visits.",
  },
  "Rasmiy profil": { ru: "Официальный профиль", en: "Official profile" },
  "Faoliyat yo'nalishi, tarjimai hol va e'tirof etilgan yutuqlar haqida qisqacha ma'lumot.": {
    ru: "Кратко о направлениях деятельности, биографии и признанных достижениях.",
    en: "A brief overview of activities, biography and recognized achievements.",
  },

  "Maqom": { ru: "Статус", en: "Status" },
  "Tarjimai hol": { ru: "Биография", en: "Biography" },
  "Mukofotlar": { ru: "Награды", en: "Awards" },
  "To'liq ism": { ru: "Полное имя", en: "Full name" },
  "Yo'nalish": { ru: "Направление", en: "Field" },
  "Joriy faoliyat": { ru: "Текущая деятельность", en: "Current position" },
  "Ta'lim": { ru: "Образование", en: "Education" },
  "Manzil": { ru: "Адрес", en: "Location" },
  "Qisqacha": { ru: "Кратко", en: "In brief" },
  "Faoliyat tamoyillari": { ru: "Принципы деятельности", en: "Working principles" },
  "Kasbiy faoliyat": { ru: "Профессиональная деятельность", en: "Professional career" },
  "Ijtimoiy va boshqa faoliyat": { ru: "Общественная и иная деятельность", en: "Social and other activities" },
  "Batafsil ↗": { ru: "Подробнее ↗", en: "More ↗" },

  "Sahifalar": { ru: "Страницы", en: "Pages" },
  "Bog'lanish": { ru: "Контакты", en: "Contact" },
  "Ijtimoiy tarmoqlar": { ru: "Социальные сети", en: "Social media" },
  "© 2026 OTABEK SOBITOV. Barcha huquqlar himoyalangan.": {
    ru: "© 2026 OTABEK SOBITOV. Все права защищены.",
    en: "© 2026 OTABEK SOBITOV. All rights reserved.",
  },
  "tomonidan yaratilgan": { ru: "— разработчик сайта", en: "— website developer" },
  "Matbuot xizmati": { ru: "Пресс-служба", en: "Press service" },
  "Murojaat": { ru: "Обращение", en: "Inquiries" },
  "Oliy Majlis Qonunchilik palatasi huzuridagi Yoshlar parlamenti raisining rasmiy veb-sahifasi.": {
    ru: "Официальный веб-сайт председателя Молодёжного парламента при Законодательной палате Олий Мажлиса.",
    en: "The official website of the Chairman of the Youth Parliament under the Legislative Chamber of the Oliy Majlis.",
  },
};

const PATTERNS = [
  {
    re: /^(\d+) marta tashrif buyurgan$/,
    ru: (m) => `Посещено ${m[1]} раз`,
    en: (m) => (m[1] === "1" ? "Visited 1 time" : `Visited ${m[1]} times`),
  },
];

// ---------- Lotin → Kirill transliteratsiya ----------
const BRAND_SKIP = new Set([
  "instagram", "facebook", "twitter", "linkedin", "telegram", "youtube",
]);

const DIGRAPHS = [
  [/O'/g, "Ў"], [/o'/g, "ў"], [/G'/g, "Ғ"], [/g'/g, "ғ"],
  [/SH/g, "Ш"], [/Sh/g, "Ш"], [/sh/g, "ш"],
  [/CH/g, "Ч"], [/Ch/g, "Ч"], [/ch/g, "ч"],
  [/YO/g, "Ё"], [/Yo/g, "Ё"], [/yo/g, "ё"],
  [/YU/g, "Ю"], [/Yu/g, "Ю"], [/yu/g, "ю"],
  [/YA/g, "Я"], [/Ya/g, "Я"], [/ya/g, "я"],
  [/YE/g, "Е"], [/Ye/g, "Е"], [/ye/g, "е"],
];

const SINGLES = {
  A: "А", a: "а", B: "Б", b: "б", D: "Д", d: "д", E: "Е", e: "е",
  F: "Ф", f: "ф", G: "Г", g: "г", H: "Ҳ", h: "ҳ", I: "И", i: "и",
  J: "Ж", j: "ж", K: "К", k: "к", L: "Л", l: "л", M: "М", m: "м",
  N: "Н", n: "н", O: "О", o: "о", P: "П", p: "п", Q: "Қ", q: "қ",
  R: "Р", r: "р", S: "С", s: "с", T: "Т", t: "т", U: "У", u: "у",
  V: "В", v: "в", X: "Х", x: "х", Y: "Й", y: "й", Z: "З", z: "з",
  "'": "ъ",
};

function transliterateWord(word) {
  const bare = word.replace(/[^A-Za-z']/g, "");
  if (!bare) return word;
  if (BRAND_SKIP.has(bare.toLowerCase())) return word;
  // c (ch dan tashqari) yoki w bo'lgan so'z — chet so'z, tegilmaydi
  if (/[cCwW]/.test(word.replace(/[cC][hH]/g, ""))) return word;
  let out = word;
  for (const [re, to] of DIGRAPHS) out = out.replace(re, to);
  out = out.replace(/(^|[^A-Za-zА-Яа-яЁёЎўҒғҚқҲҳ])E/g, "$1Э");
  out = out.replace(/(^|[^A-Za-zА-Яа-яЁёЎўҒғҚқҲҳ])e/g, "$1э");
  out = out.replace(/[A-Za-z']/g, (ch) => SINGLES[ch] ?? ch);
  return out;
}

export function latinToCyrillic(text) {
  const norm = text.replace(/[’‘ʻʼ`]/g, "'");
  if (/https?:\/\/|www\.|@/.test(norm)) return text;
  return norm
    .split(/(\s+)/)
    .map((tok) => (/\S/.test(tok) ? transliterateWord(tok) : tok))
    .join("");
}

// ---------- DOM tarjimon ----------
function normalize(s) {
  return s.replace(/[’‘ʻʼ`]/g, "'").replace(/\s+/g, " ").trim();
}

// Lug'atda topilmagan matnlar server orqali avtomatik tarjima qilinadi
// (natijalar bazada keshlanadi, shuning uchun har matn faqat bir marta tarjima bo'ladi).
const REMOTE_CACHE = { ru: new Map(), en: new Map() };
let pendingNodes = new Map(); // source text -> Set<textNode>
let flushTimer = null;

// Brend/nomlar tarjima qilinmaydi.
const NO_TRANSLATE = new Set([
  "telegram", "instagram", "facebook", "linkedin", "youtube", "twitter",
  "x", "x (twitter)", "sobitov", "otabek sobitov", "in", "big buck bunny", "abdurahmonov",
]);

function needsRemote(orig) {
  const t = normalize(orig);
  if (t.length < 2) return false;
  if (!/[A-Za-zÀ-ɏЀ-ӿ]/.test(t)) return false;
  if (/https?:\/\/|www\.|@/.test(t)) return false;
  if (NO_TRANSLATE.has(t.toLowerCase())) return false;
  return true;
}

function enqueueRemote(node, orig) {
  const src = orig.trim();
  if (!src) return;
  if (!pendingNodes.has(src)) pendingNodes.set(src, new Set());
  pendingNodes.get(src).add(node);
  if (!flushTimer) flushTimer = setTimeout(flushRemote, 200);
}

async function flushRemote() {
  flushTimer = null;
  const lang = currentLang;
  if (lang !== "ru" && lang !== "en") {
    pendingNodes = new Map();
    return;
  }
  const batch = pendingNodes;
  pendingNodes = new Map();
  const cache = REMOTE_CACHE[lang];
  const texts = [...batch.keys()].filter((s) => !cache.has(s)).slice(0, 80);
  if (texts.length) {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, texts }),
      });
      if (res.ok) {
        const data = await res.json();
        for (const [src, tr] of Object.entries(data.translations || {})) {
          if (tr) cache.set(src, tr);
        }
      }
    } catch {}
  }
  if (currentLang !== lang) return;
  for (const [src, nodes] of batch) {
    const tr = cache.get(src);
    if (!tr) continue;
    for (const node of nodes) {
      const orig = ORIG_TEXT.get(node);
      if (orig === undefined || orig.trim() !== src) continue;
      const lead = orig.match(/^\s*/)[0];
      const trail = orig.match(/\s*$/)[0];
      if (node.nodeValue !== lead + tr + trail) {
        node.nodeValue = lead + tr + trail;
      }
    }
  }
  if (observer) observer.takeRecords();
}

function translateString(orig, lang, node) {
  if (lang === "uz") return orig;
  const norm = normalize(orig);
  if (!norm) return orig;
  if (lang === "oz") return latinToCyrillic(orig);
  const hit = DICT[norm];
  const lead = orig.match(/^\s*/)[0];
  const trail = orig.match(/\s*$/)[0];
  if (hit && hit[lang]) return lead + hit[lang] + trail;
  for (const p of PATTERNS) {
    const m = norm.match(p.re);
    if (m) return lead + p[lang](m) + trail;
  }
  const remote = REMOTE_CACHE[lang]?.get(orig.trim());
  if (remote) return lead + remote + trail;
  if (node && needsRemote(orig)) enqueueRemote(node, orig);
  return orig;
}

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "TEXTAREA", "TITLE"]);
const ORIG_TEXT = typeof WeakMap !== "undefined" ? new WeakMap() : null;

let currentLang = "uz";
let observer = null;

function eligible(node) {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName) || el.hasAttribute("data-no-i18n")) return false;
    el = el.parentElement;
  }
  return true;
}

function walk(root, lang) {
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = tw.nextNode())) {
    if (!eligible(node)) continue;
    let orig = ORIG_TEXT.get(node);
    if (orig === undefined) {
      orig = node.nodeValue;
      ORIG_TEXT.set(node, orig);
    }
    const out = translateString(orig, lang, node);
    if (node.nodeValue !== out) node.nodeValue = out;
  }
}

function applyAttrs(lang) {
  document.querySelectorAll("input[placeholder]").forEach((el) => {
    if (!el.dataset.i18nPlaceholder) el.dataset.i18nPlaceholder = el.placeholder;
    const out = translateString(el.dataset.i18nPlaceholder, lang);
    if (el.placeholder !== out) el.placeholder = out;
  });
}

export function getSiteLang() {
  if (typeof localStorage === "undefined") return "uz";
  const saved = localStorage.getItem(STORAGE_KEY);
  return SITE_LANGS.some((l) => l.code === saved) ? saved : "uz";
}

export function applyLanguage(lang) {
  if (typeof document === "undefined") return;
  currentLang = lang;
  pendingNodes = new Map();
  walk(document.body, lang);
  applyAttrs(lang);
  document.documentElement.lang =
    lang === "oz" ? "uz-Cyrl" : lang === "uz" ? "uz" : lang;
  if (observer) observer.takeRecords();
}

export function setSiteLang(code) {
  localStorage.setItem(STORAGE_KEY, code);
  applyLanguage(code);
  window.dispatchEvent(new CustomEvent("site-lang", { detail: code }));
}

export function initLanguage() {
  if (typeof document === "undefined") return;
  applyLanguage(getSiteLang());
  if (observer) return;
  observer = new MutationObserver((muts) => {
    if (currentLang === "uz") return;
    for (const m of muts) {
      if (m.type === "childList") {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) walk(n, currentLang);
          else if (n.nodeType === 3 && eligible(n)) {
            ORIG_TEXT.set(n, n.nodeValue);
            const out = translateString(n.nodeValue, currentLang, n);
            if (n.nodeValue !== out) n.nodeValue = out;
          }
        });
      } else if (m.type === "characterData") {
        const n = m.target;
        if (n.nodeType === 3 && eligible(n)) {
          ORIG_TEXT.set(n, n.nodeValue);
          const out = translateString(n.nodeValue, currentLang, n);
          if (n.nodeValue !== out) n.nodeValue = out;
        }
      }
    }
    observer.takeRecords();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
