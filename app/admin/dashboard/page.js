import AdminShell from "@/components/AdminShell";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const newsCount = db.prepare("SELECT COUNT(*) AS c FROM news").get().c;
  const initiativesCount = db.prepare("SELECT COUNT(*) AS c FROM initiatives").get().c;
  const travelsCount = db.prepare("SELECT COUNT(*) AS c FROM travels").get().c;
  const awardsCount = db.prepare("SELECT COUNT(*) AS c FROM awards").get().c;

  const cards = [
    { label: "Voqealar", count: newsCount, href: "/admin/news" },
    { label: "Tashabbuslar", count: initiativesCount, href: "/admin/initiatives" },
    { label: "Safarlar", count: travelsCount, href: "/admin/travels" },
    { label: "Mukofotlar", count: awardsCount, href: "/admin/about" },
  ];

  return (
    <AdminShell active="/admin/dashboard" title="Boshqaruv paneli">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {cards.map((c) => (
          <a
            key={c.href}
            href={c.href}
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: "22px 20px",
              display: "block",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--navy)" }}>{c.count}</div>
            <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>{c.label}</div>
          </a>
        ))}
      </div>
      <p style={{ marginTop: 28, color: "var(--muted)", fontSize: 13.5 }}>
        Chap menyudan kerakli bo‘limni tanlang va kontentni tahrirlang. O‘zgarishlar saytda darhol ko‘rinadi.
      </p>
    </AdminShell>
  );
}
