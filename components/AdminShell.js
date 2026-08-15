"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  { href: "/admin/bug-reports", label: "Xato xabarlari" },
  { href: "/admin/security", label: "Xavfsizlik" },
];

export default function AdminShell({ active, title, children }) {
  const router = useRouter();
  // Yangi (hal qilinmagan) xato-xabarlar soni — menyuda qizil nuqta chiqarish uchun.
  const [newBugs, setNewBugs] = useState(0);

  useEffect(() => {
    let alive = true;
    async function loadBugs() {
      try {
        const res = await fetch("/api/bug-reports");
        if (!res.ok) return;
        const data = await res.json();
        if (!alive || !Array.isArray(data)) return;
        setNewBugs(data.filter((i) => i.status !== "done").length);
      } catch {
        /* jimgina o'tkazamiz */
      }
    }
    loadBugs();
    // Ochiq turgan admin panelda yangi xabar kelsa ham bilinsin.
    const timer = setInterval(loadBugs, 60000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
    // active o'zgarganda (masalan bug-reports sahifasidan chiqib-kirganda) qayta tekshiramiz
  }, [active]);

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
          {LINKS.map((link) => {
            const showDot = link.href === "/admin/bug-reports" && newBugs > 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active === link.href ? "active" : ""}
              >
                {link.label}
                {showDot && (
                  <span
                    className="nav-dot"
                    title={`${newBugs} ta yangi xabar`}
                    aria-label={`${newBugs} ta yangi xabar`}
                  />
                )}
              </Link>
            );
          })}
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
