"use client";

import { useEffect, useState } from "react";
import { formatDateDMY } from "@/components/socials";

export function extractYoutubeId(url) {
  const m = String(url || "").match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

function PlayBadge({ small }) {
  return (
    <span className={`video-play${small ? " small" : ""}`}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 6.5v11l9-5.5-9-5.5Z" />
      </svg>
    </span>
  );
}

export default function VideoGallery({ videos }) {
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPlaying(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  const items = (videos || [])
    .map((v) => ({ ...v, ytId: extractYoutubeId(v.youtube_url) }))
    .filter((v) => v.ytId);

  if (!items.length) {
    return (
      <section className="container video-gallery" id="mediateka">
        <h2 className="home-news-title">Mediateka</h2>
        <p className="home-news-empty">
          Hozircha video yo&rsquo;q — admin paneldagi &ldquo;Videolar&rdquo;
          bo&rsquo;limidan YouTube havolasi qo&rsquo;shing.
        </p>
      </section>
    );
  }

  const [featured, ...rest] = items;
  const smalls = rest.slice(0, 4);

  return (
    <section className="container video-gallery" id="mediateka">
      <h2 className="home-news-title">Mediateka</h2>

      <div className="video-grid">
        <button
          className="video-card featured"
          onClick={() => setPlaying(featured)}
          aria-label={featured.title}
        >
          <img
            src={`https://i.ytimg.com/vi/${featured.ytId}/hqdefault.jpg`}
            alt={featured.title}
          />
          <span className="video-shade" />
          <PlayBadge />
          <span className="video-caption">
            <b>{featured.title}</b>
            {featured.date && <i>{formatDateDMY(featured.date)}</i>}
          </span>
        </button>

        {smalls.length > 0 && (
          <div className="video-side">
            {smalls.map((v) => (
              <button
                key={v.id}
                className="video-card"
                onClick={() => setPlaying(v)}
                aria-label={v.title}
              >
                <img
                  src={`https://i.ytimg.com/vi/${v.ytId}/hqdefault.jpg`}
                  alt={v.title}
                />
                <span className="video-shade" />
                <PlayBadge small />
              </button>
            ))}
          </div>
        )}
      </div>

      {playing && (
        <div className="video-modal" onClick={() => setPlaying(null)}>
          <button className="video-modal-close" aria-label="Yopish">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26">
              <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
            </svg>
          </button>
          <div className="video-modal-frame" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${playing.ytId}?autoplay=1`}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
