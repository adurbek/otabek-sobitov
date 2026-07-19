import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VisitsMap from "@/components/VisitsMap";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function TravelsPage() {
  const travels = db.prepare("SELECT * FROM travels ORDER BY sort_order ASC, id DESC").all();
  const mapVisits = db.prepare("SELECT scope, code, visits FROM map_visits").all();

  return (
    <>
      <SiteHeader active="/safarlar" />

      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Xalqaro safarlar</span>
          <h1>Safarlar</h1>
          <p>Konferensiyalar, forumlar va tashriflar xronologiyasi.</p>
        </div>
      </div>

      <VisitsMap visits={mapVisits} />

      <div className="container page-body travels-body">
        {travels.length === 0 ? (
          <p className="home-news-empty">
            Hozircha safar qo&lsquo;shilmagan — admin panelidan safar
            qo&lsquo;shing.
          </p>
        ) : (
          <div className="travel-cards">
            {travels.map((t) => (
              <article className="travel-card" key={t.id}>
                <div className="travel-card-img">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.city} />
                  ) : (
                    <span>[Rasm]</span>
                  )}
                </div>
                <div className="travel-card-body">
                  <h3>
                    {t.city}
                    {t.country ? `, ${t.country}` : ""}
                  </h3>
                  {(t.date_label || t.event) && (
                    <div className="travel-card-meta">
                      {t.date_label}
                      {t.date_label && t.event ? " · " : ""}
                      {t.event}
                    </div>
                  )}
                  {t.description && <p>{t.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
