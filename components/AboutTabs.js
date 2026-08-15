"use client";

import { useEffect, useState } from "react";

const HASH_TABS = ["tarjima", "mukofot"];

export default function AboutTabs({ about, awards, timeline = [] }) {
  const [tab, setTab] = useState("tarjima");

  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace("#", "");
      if (HASH_TABS.includes(h)) setTab(h);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const bioSections = [
    { h: "Ta’lim", t: about?.bio_education },
    { h: "Kasbiy faoliyat", t: about?.bio_career },
    { h: "Ijtimoiy va boshqa faoliyat", t: about?.bio_social },
  ].filter((s) => s.t);

  return (
    <>
      <div className="subtabs">
        <button className={tab === "tarjima" ? "active" : ""} onClick={() => setTab("tarjima")}>
          Tarjimai hol
        </button>
        <button className={tab === "mukofot" ? "active" : ""} onClick={() => setTab("mukofot")}>
          Mukofotlar
        </button>
      </div>

      {tab === "tarjima" && (
        <div className="subpanel active">
          <div className="prose about-bio about-intro-block">
            {about?.photo_url && (
              <figure className="about-photo-float">
                <img src={about.photo_url} alt={about?.full_name || "Portret"} />
              </figure>
            )}
            <p>
              Otabek Sobitov — Oʻzbekiston Respublikasi Oliy Majlisi Qonunchilik
              palatasi huzuridagi Yoshlar parlamenti Raisi, OʻzLiDeP Siyosiy
              Kengashi a’zosi hamda amaliy psixologiya yoʻnalishi boʻyicha
              magistr. U 10 yildan ortiq vaqt davomida yoshlar siyosati,
              parlament faoliyati, jamoatchilik boshqaruvi va fuqarolik
              jamiyatini rivojlantirish yoʻnalishlarida samarali faoliyat yuritib
              kelmoqda.
            </p>
          </div>
          <div className="prose about-bio" style={{ maxWidth: 820 }}>
            <h3>Ilmiy va jamoatchilik faoliyati</h3>
            <p>
              Otabek Sobitov yoshlar siyosati, siyosiy jarayonlar, huquqiy
              psixologiya, tashkiliy psixologiya hamda qonunchilik
              yoʻnalishlarida 30 dan ortiq ilmiy maqola va tezislar muallifi
              hisoblanadi. Shuningdek, “Boshqaruv koʻnikmalari” qoʻllanma, “Yangi
              Oʻzbekistonda yosh rahbar kadrlarning lavozimga tayinlashining
              ijtimoiy-psixologik mexanizmlari” ilmiy monografiya muallifi.
            </p>
            <p>
              U respublika miqyosidagi koʻplab loyihalar, forumlar va xalqaro
              konferensiyalar tashabbuskori hamda tashkilotchisi sifatida
              faoliyat yuritib, yoshlarning siyosiy faolligini oshirish, parlament
              diplomatiyasini rivojlantirish va xalqaro hamkorlikni
              kengaytirishga munosib hissa qoʻshib kelmoqda.
            </p>
          </div>
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

    </>
  );
}
