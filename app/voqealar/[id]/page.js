import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SOCIALS, formatDateDMY } from "@/components/socials";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function NewsDetailPage({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const item = db.prepare("SELECT * FROM news WHERE id = ?").get(id);
  if (!item) notFound();

  const paragraphs = String(item.body || "")
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <SiteHeader active="/voqealar" />

      <div className="article-wrap">
        <article className="article-card">
          <h1 className="article-title">{item.title}</h1>

          <div className="article-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
              <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
              <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
            {formatDateDMY(item.date)}
          </div>

          {item.image_url && (
            <div className="article-image">
              <img src={item.image_url} alt={item.title} />
            </div>
          )}

          <div className="article-body">
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>[Matn kiritilmagan]</p>
            )}
          </div>

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
