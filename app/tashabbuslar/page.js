import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function InitiativesPage() {
  const featured = await db
    .prepare("SELECT * FROM initiatives WHERE featured = 1 ORDER BY sort_order ASC")
    .all();
  const others = await db
    .prepare("SELECT * FROM initiatives WHERE featured = 0 ORDER BY sort_order ASC")
    .all();

  return (
    <>
      <SiteHeader active="/tashabbuslar" />

      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Global tashabbuslar</span>
          <h1>Tashabbuslar</h1>
          <p>Ustuvor yo‘nalishlar va olib borilayotgan loyihalar haqida qisqacha ma’lumot.</p>
        </div>
      </div>

      <div className="container page-body">
        {featured.length > 0 && (
          <div className="init-grid">
            {featured.map((item, i) => (
              <div className={`init-card ${i === 0 ? "dark" : "light-accent"}`} key={item.id}>
                <div className="init-mark">{item.icon || "◆"}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="init-sub-grid">
            {others.map((item) => (
              <div className="init-card" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {featured.length === 0 && others.length === 0 && (
          <p style={{ color: "var(--muted)" }}>
            Hozircha tashabbus qo‘shilmagan. Admin panelidan qo‘shing.
          </p>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
