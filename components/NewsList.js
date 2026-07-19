"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { key: "barchasi", label: "Barchasi", tag: null },
  { key: "chiqish", label: "Chiqishlar", tag: "Chiqish" },
  { key: "matbuot", label: "Matbuot e’lonlari", tag: "Matbuot e’lon" },
];

export default function NewsList({ news }) {
  const [tab, setTab] = useState("barchasi");
  const activeTag = TABS.find((t) => t.key === tab)?.tag;
  const items = activeTag ? news.filter((n) => n.tag === activeTag) : news;

  return (
    <>
      <div className="subtabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="subpanel active">
        <div className="news-list">
          {items.length === 0 && (
            <div className="news-row">
              <div className="news-thumb">[Rasm]</div>
              <div className="news-body">
                <h4>Hozircha yangilik yo‘q</h4>
                <div className="date">Admin panelidan yangilik qo‘shing.</div>
              </div>
            </div>
          )}
          {items.map((n) => (
            <Link className="news-row" key={n.id} href={`/voqealar/${n.id}`}>
              <div className="news-thumb">
                {n.image_url ? <img src={n.image_url} alt={n.title} /> : "[Rasm]"}
              </div>
              <div className="news-body">
                <span className="news-tag">{n.tag}</span>
                <h4>{n.title}</h4>
                <div className="date">{n.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
