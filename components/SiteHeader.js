"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SOCIALS } from "@/components/socials";
import { SITE_LANGS, getSiteLang, setSiteLang } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/men-haqimda", label: "Men haqimda" },
  { href: "/voqealar", label: "Voqealar" },
  { href: "/tashabbuslar", label: "Tashabbuslar" },
  { href: "/safarlar", label: "Safarlar" },
];

export default function SiteHeader({ active }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("uz");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 280);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setResults(null);
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchOpen]);

  useEffect(() => {
    setLang(getSiteLang());
    const onLang = (e) => setLang(e.detail);
    window.addEventListener("site-lang", onLang);
    return () => window.removeEventListener("site-lang", onLang);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = () => setLangOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [langOpen]);

  function chooseLang(code) {
    setSiteLang(code);
    setLangOpen(false);
  }

  const currentLang = SITE_LANGS.find((l) => l.code === lang) || SITE_LANGS[0];

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <header>
      <div className="container header-inner">
        <button
          className="burger-btn"
          aria-label="Menyuni ochish"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link href="/" className="brand" data-no-i18n>
          <span className="brand-name">Otabek Sobitov</span>
        </Link>

        <nav className="main-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={active === item.href ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <div className="lang-wrap" data-no-i18n>
            <button
              className="lang-current"
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((v) => !v);
              }}
              aria-label="Tilni tanlash"
            >
              {currentLang.short} <small>▾</small>
            </button>
            {langOpen && (
              <div className="lang-menu">
                {SITE_LANGS.map((l) => (
                  <button
                    key={l.code}
                    className={l.code === lang ? "active" : ""}
                    onClick={() => chooseLang(l.code)}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="icon-btn"
            aria-label="Qidiruv"
            onClick={() => setSearchOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`drawer-overlay${drawerOpen ? " show" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`drawer${drawerOpen ? " open" : ""}`}>
        <button
          className="drawer-close"
          aria-label="Menyuni yopish"
          onClick={() => setDrawerOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
          </svg>
        </button>

        <p className="drawer-title">Yoshlar parlamenti raisi</p>
        <hr className="drawer-hr" />

        <div className="drawer-langs" data-no-i18n>
          {SITE_LANGS.map((l) => (
            <button
              key={l.code}
              className={lang === l.code ? "active" : ""}
              onClick={() => chooseLang(l.code)}
            >
              {l.name}
            </button>
          ))}
        </div>

        <nav className="drawer-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={active === item.href ? "active" : ""}
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <hr className="drawer-hr" />

        <p className="drawer-subtitle">
          Ijtimoiy tarmoqlardagi
          <br />
          rasmiy sahifalar
        </p>
        <ul className="drawer-socials">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                <span className="soc-icon">{s.icon}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <hr className="drawer-hr" />
      </aside>

      <div className={`search-overlay${searchOpen ? " open" : ""}`}>
        <button
          className="search-close"
          aria-label="Qidiruvni yopish"
          onClick={() => setSearchOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="30" height="30">
            <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
          </svg>
        </button>

        <div className="search-box">
          <p className="search-title">Sayt bo&rsquo;yicha qidiruv</p>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="So'zni kiriting"
              aria-label="Qidiruv so'zi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              ref={searchInputRef}
            />
            <button type="submit" aria-label="Qidirish">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="19" height="19">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.8-3.8" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          {searchOpen && query.trim().length >= 2 && (
            <div className="search-results">
              {searching && results === null && (
                <p className="search-status">Qidirilmoqda...</p>
              )}
              {results && results.length === 0 && !searching && (
                <p className="search-status">Hech narsa topilmadi</p>
              )}
              {results &&
                results.map((r, i) => (
                  <a
                    className="search-result"
                    key={`${r.href}-${i}`}
                    href={r.href}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span className="sr-type">{r.type}</span>
                    <span className="sr-title">{r.title}</span>
                    {r.snippet && <span className="sr-snippet">{r.snippet}</span>}
                  </a>
                ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
