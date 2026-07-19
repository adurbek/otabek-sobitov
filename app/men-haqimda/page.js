import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AboutTabs from "@/components/AboutTabs";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const about = db.prepare("SELECT * FROM about WHERE id = 1").get();
  const awards = db.prepare("SELECT * FROM awards ORDER BY sort_order ASC, year DESC").all();

  return (
    <>
      <SiteHeader active="/men-haqimda" />

      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Rasmiy profil</span>
          <h1>Men haqimda</h1>
          <p>Faoliyat yo‘nalishi, tarjimai hol va e’tirof etilgan yutuqlar haqida qisqacha ma’lumot.</p>
        </div>
      </div>

      <div className="container page-body">
        <AboutTabs about={about} awards={awards} />
      </div>

      <SiteFooter />
    </>
  );
}
