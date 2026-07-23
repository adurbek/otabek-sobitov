"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Boshqaruv paneli" },
  { href: "/admin/slides", label: "Bosh sahifa karuseli" },
  { href: "/admin/about", label: "Men haqimda" },
  { href: "/admin/news", label: "Voqealar" },
  { href: "/admin/initiatives", label: "Tashabbuslar" },
  { href: "/admin/travels", label: "Safarlar" },
  { href: "/admin/visits", label: "Tashriflar xaritasi" },
  { href: "/admin/videos", label: "Videolar" },
  { href: "/admin/social", label: "Ijtimoiy tarmoqlar" },
];

export default function AdminShell({ active, title, children }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="logo">OTABEK SOBITOV</span>
        <nav>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={active === link.href ? "active" : ""}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Chiqish
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <h1>{title}</h1>
          <a className="btn-secondary" href="/" target="_blank" rel="noreferrer">
            Saytni ko‘rish ↗
          </a>
        </div>
        {children}
      </main>
    </div>
  );
}
