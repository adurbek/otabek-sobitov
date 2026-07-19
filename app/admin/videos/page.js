"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminVideosListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id) {
    if (!confirm("Bu videoni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AdminShell active="/admin/videos" title="Videolar">
      <div style={{ marginBottom: 20 }}>
        <a className="btn-primary" href="/admin/videos/new" style={{ display: "inline-block", textDecoration: "none" }}>
          + Yangi video qo‘shish
        </a>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sarlavha</th>
              <th>Sana</th>
              <th>Havola</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>Hozircha video yo‘q.</td>
              </tr>
            )}
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.title}</td>
                <td>{i.date}</td>
                <td>
                  <a href={i.youtube_url} target="_blank" rel="noreferrer" style={{ color: "var(--navy-3)" }}>
                    YouTube ↗
                  </a>
                </td>
                <td className="row-actions">
                  <a className="btn-secondary" href={`/admin/videos/${i.id}`}>Tahrirlash</a>
                  <button className="btn-danger" onClick={() => handleDelete(i.id)}>O‘chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
