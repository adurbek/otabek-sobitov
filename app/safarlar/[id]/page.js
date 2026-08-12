import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SOCIALS } from "@/components/socials";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TravelDetailPage({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const item = await db.prepare("SELECT * FROM travels WHERE id = ?").get(id);
  if (!item) notFound();

  const images = await db
    .prepare(
      "SELECT * FROM travel_images WHERE travel_id = ? ORDER BY sort_order ASC, id ASC"
    )
    .all(id);

  const title = `${item.city}${item.country ? `, ${item.country}` : ""}`;
  const paragraphs = String(item.body || item.description || "")
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <SiteHeader active="/safarlar" />

      <div className="article-wrap">
        <article className="article-card">
          <Link href="/safarlar" className="article-back">
            ← Safarlar
          </Link>

          <h1 className="article-title">{title}</h1>

          {(item.date_label || item.event) && (
            <div className="article-date">
              {item.date_label}
              {item.date_label && item.event ? " · " : ""}
              {item.event}
            </div>
          )}

          {item.image_url && (
            <div className="article-image">
              <img src={item.image_url} alt={title} />
            </div>
          )}

          <div className="article-body">
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>[Matn kiritilmagan]</p>
            )}
          </div>

          {images.length > 0 && (
            <div className="travel-gallery">
              {images.map((img) => (
                <figure className="travel-gallery-item" key={img.id}>
                  <img src={img.image_url} alt={img.caption || title} />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          <div className="article-share">
            {SOCIALS.slice(0, 4).map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </article>
      </div>

      <SiteFooter />
    </>
  );
}
