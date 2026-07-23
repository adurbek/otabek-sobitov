"use client";

import { useEffect, useState } from "react";

const HASH_TABS = ["maqom", "tarjima", "mukofot"];

export default function AboutTabs({ about, awards }) {
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
      </div>

      {tab === "maqom" && (
        <div className="subpanel active">
          <div className="about-grid">
            <div>
              {about?.photo_url ? (
                <div className="about-photo has-img">
                  <img src={about.photo_url} alt={about?.full_name || "Portret"} />
                </div>
              ) : (
                <div className="about-photo">[Portret rasmi]</div>
              )}
              <ul className="about-facts">
                <li><span>To‘liq ism</span><span>{about?.full_name || "[Ism Familiya]"}</span></li>
                <li><span>Yo‘nalish</span><span>{about?.direction || "[Faoliyat sohasi]"}</span></li>
                <li><span>Joriy faoliyat</span><span>{about?.position || "[Lavozim / loyiha nomi]"}</span></li>
                <li><span>Ta’lim</span><span>{about?.education || "[O‘quv muassasasi va yo‘nalish]"}</span></li>
              </ul>
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
            <div className="prose">
              <h3>Qisqacha</h3>
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
            </div>
          </div>
        </div>
      )}

      {tab === "tarjima" && (
        <div className="subpanel active">
          <div className="prose" style={{ maxWidth: 760 }}>
            <h3>Ta’lim</h3>
            <p>{about?.bio_education || "[Ta’lim haqida ma’lumot shu yerga yoziladi.]"}</p>
            <h3>Kasbiy faoliyat</h3>
            <p>{about?.bio_career || "[Kasbiy faoliyat haqida ma’lumot shu yerga yoziladi.]"}</p>
            <h3>Ijtimoiy va boshqa faoliyat</h3>
            <p>{about?.bio_social || "[Ijtimoiy faoliyat haqida ma’lumot shu yerga yoziladi.]"}</p>
          </div>
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
                <p>{a.description}</p>
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
