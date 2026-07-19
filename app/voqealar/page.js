import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsList from "@/components/NewsList";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  const news = db.prepare("SELECT * FROM news ORDER BY sort_order ASC, date DESC, id DESC").all();

  return (
    <>
      <SiteHeader active="/voqealar" />

      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Yangiliklar</span>
          <h1>Voqealar</h1>
          <p>So‘nggi faoliyat, chiqishlar va e’lonlar bilan tanishing.</p>
        </div>
      </div>

      <div className="container page-body">
        <NewsList news={news} />
      </div>

      <SiteFooter />
    </>
  );
}
