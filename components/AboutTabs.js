"use client";

import { useEffect, useState } from "react";

const HASH_TABS = ["maqom", "tarjima", "mukofot", "aloqa"];

export default function AboutTabs({ about, awards, timeline = [] }) {
  const [tab, setTab] = useState("maqom");
  const principles = safeParsePrinciples(about?.principles);

  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace("#", "");
      if (HASH_TABS.includes(h)) setTab(h);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const hasContact =
    about?.contact_email || about?.contact_phone || about?.contact_address;

  const bioSections = [
    { h: "Ta’lim", t: about?.bio_education },
    { h: "Kasbiy faoliyat", t: about?.bio_career },
    { h: "Ijtimoiy va boshqa faoliyat", t: about?.bio_social },
  ].filter((s) => s.t);

  return (
    <>
      <div className="subtabs">
        <button className={tab === "maqom" ? "active" : ""} onClick={() => setTab("maqom")}>
          Maqom
        </button>
        <button className={tab === "tarjima" ? "active" : ""} onClick={() => setTab("tarjima")}>
          Tarjimai hol
        </button>
        <button className={tab === "mukofot" ? "active" : ""} onClick={() => setTab("mukofot")}>
          Mukofotlar
        </button>
        <button className={tab === "aloqa" ? "active" : ""} onClick={() => setTab("aloqa")}>
          Aloqa
        </button>
      </div>

      {tab === "maqom" && (
        <div className="subpanel active">
          <div className="prose about-bio">
            <h3>Qisqacha</h3>
            {about?.photo_url && (
              <figure className="about-photo-float">
                <img src={about.photo_url} alt={about?.full_name || "Portret"} />
              </figure>
            )}
            <p>{about?.summary || "[Bu yerga o‘zingiz haqingizdagi qisqa tanishtiruv matni yoziladi.]"}</p>
            {principles.length > 0 && (
              <>
                <h3>Faoliyat tamoyillari</h3>
                <ol>
                  {principles.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </>
            )}
            {about?.link_url && (
              <a
                className="about-link-btn"
                href={about.link_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Batafsil ↗
              </a>
            )}
          </div>
        </div>
      )}

      {tab === "tarjima" && (
        <div className="subpanel active">
          {timeline.length > 0 ? (
            <div className="tl">
              {timeline.map((item) => (
                <div className="tl-item" key={item.id}>
                  <div className="tl-year">{item.year}</div>
                  <div className="tl-body">
                    {item.title && <h4 className="tl-title">{item.title}</h4>}
                    {String(item.text || "")
                      .split(/\r?\n+/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : bioSections.length > 0 ? (
            <div className="prose" style={{ maxWidth: 760 }}>
              {bioSections.map((s, i) => (
                <div key={i}>
                  <h3>{s.h}</h3>
                  <p>{s.t}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="home-news-empty">
              Tarjimai hol hali qo‘shilmagan — admin panelidan yillar bo‘yicha
              bosqichlarni qo‘shing.
            </p>
          )}
        </div>
      )}

      {tab === "mukofot" && (
        <div className="subpanel active">
          <div className="awards-grid">
            {awards.length === 0 && (
              <div className="award-card">
                <span className="yr">[Yil]</span>
                <h4>[Mukofot hali qo‘shilmagan]</h4>
                <p>Admin panelidan mukofot qo‘shing.</p>
              </div>
            )}
            {awards.map((a) => (
              <div className="award-card" key={a.id}>
                {a.image_url && (
                  <div className="award-img">
                    <img src={a.image_url} alt={a.title} />
                  </div>
                )}
                <span className="yr">{a.year}</span>
                <h4>{a.title}</h4>
                {a.description && <p>{a.description}</p>}
                {a.link_url && (
                  <a
                    className="award-link"
                    href={a.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Batafsil ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "aloqa" && (
        <div className="subpanel active">
          {hasContact ? (
            <div className="contact-grid">
              {about?.contact_email && (
                <a className="contact-item" href={`mailto:${about.contact_email}`}>
                  <span className="contact-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="contact-text">
                    <b>Email</b>
                    {about.contact_email}
                  </span>
                </a>
              )}
              {about?.contact_phone && (
                <a className="contact-item" href={`tel:${about.contact_phone.replace(/\s+/g, "")}`}>
                  <span className="contact-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                      <path d="M4 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 7a2 2 0 0 1 1-3Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="contact-text">
                    <b>Telefon</b>
                    {about.contact_phone}
                  </span>
                </a>
              )}
              {about?.contact_address && (
                <div className="contact-item">
                  <span className="contact-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <span className="contact-text">
                    <b>Manzil</b>
                    {about.contact_address}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="home-news-empty">
              Aloqa ma’lumotlari hali qo‘shilmagan — admin panelidagi «Men
              haqimda» bo‘limidan email, telefon yoki manzilni kiriting.
            </p>
          )}
        </div>
      )}
    </>
  );
}

function safeParsePrinciples(raw) {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}
