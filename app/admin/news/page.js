"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminNewsListPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id) {
    if (!confirm("Bu yangilikni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    setNews((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <AdminShell active="/admin/news" title="Voqealar">
      <div style={{ marginBottom: 20 }}>
        <a className="btn-primary" href="/admin/news/new" style={{ display: "inline-block", textDecoration: "none" }}>
          + Yangi voqea qo‘shish
        </a>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sana</th>
              <th>Turi</th>
              <th>Sarlavha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 && (
              <tr>
                <td colSpan={4}>Hozircha yangilik yo‘q.</td>
              </tr>
            )}
            {news.map((n) => (
              <tr key={n.id}>
                <td>{n.date}</td>
                <td>{n.tag}</td>
                <td>{n.title}</td>
                <td className="row-actions">
                  <a className="btn-secondary" href={`/admin/news/${n.id}`}>Tahrirlash</a>
                  <button className="btn-danger" onClick={() => handleDelete(n.id)}>O‘chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
