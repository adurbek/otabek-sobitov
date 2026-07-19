import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroCarousel from "@/components/HeroCarousel";
import VideoGallery from "@/components/VideoGallery";
import VisitsMap from "@/components/VisitsMap";
import SocialFeeds from "@/components/SocialFeeds";
import { SOCIALS, formatDateDMY } from "@/components/socials";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const adminSlides = db
    .prepare(
      "SELECT id, title, date, image_url FROM slides ORDER BY sort_order ASC, id DESC LIMIT 8"
    )
    .all();
  const newsSlides = db
    .prepare(
      "SELECT id, title, date, image_url FROM news WHERE image_url IS NOT NULL AND image_url != '' ORDER BY sort_order ASC, date DESC, id DESC LIMIT 5"
    )
    .all();
  const slides = adminSlides.length ? adminSlides : newsSlides;
  const latestNews = db
    .prepare(
      "SELECT id, title, date, image_url FROM news ORDER BY sort_order ASC, date DESC, id DESC LIMIT 6"
    )
    .all();
  const videos = db
    .prepare(
      "SELECT id, title, date, youtube_url FROM videos ORDER BY sort_order ASC, date DESC, id DESC LIMIT 5"
    )
    .all();
  const mapVisits = db
    .prepare("SELECT scope, code, visits FROM map_visits")
    .all();

  return (
    <>
      <SiteHeader active="/" />

      <HeroCarousel slides={slides} />

      <section className="home-news container">
        <h2 className="home-news-title">So&rsquo;nggi yangiliklar</h2>

        {latestNews.length === 0 ? (
          <p className="home-news-empty">
            Hozircha yangilik yo&rsquo;q — admin panel orqali voqea
            qo&rsquo;shing.
          </p>
        ) : (
          <div className="news-cards">
            {latestNews.map((n) => (
              <Link className="news-card" key={n.id} href={`/voqealar/${n.id}`}>
                <div className="news-card-img">
                  {n.image_url ? (
                    <img src={n.image_url} alt={n.title} />
                  ) : (
                    <span>[Rasm]</span>
                  )}
                </div>
                <div className="news-card-body">
                  <h3>{n.title}</h3>
                  <div className="news-card-foot">
                    <span>{formatDateDMY(n.date)}</span>
                    <span className="news-card-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="all-news-row">
          <Link href="/voqealar" className="all-news-link">
            Barcha so&rsquo;nggi yangiliklar
          </Link>
        </div>
      </section>

      <section className="container socials-strip">
        <span className="socials-strip-label">
          Partiya raisi ijtimoiy tarmoqlarda:
        </span>
        <div className="socials-strip-list">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="soc-icon-lg">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <VideoGallery videos={videos} />

      <VisitsMap visits={mapVisits} />

      <SocialFeeds />

      <SiteFooter />
    </>
  );
}
