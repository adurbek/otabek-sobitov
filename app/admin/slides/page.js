"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminSlidesListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/slides")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id) {
    if (!confirm("Bu slaydni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/slides/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AdminShell active="/admin/slides" title="Bosh sahifa karuseli">
      <div style={{ marginBottom: 20 }}>
        <a className="btn-primary" href="/admin/slides/new" style={{ display: "inline-block", textDecoration: "none" }}>
          + Yangi slayd qo‘shish
        </a>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Sarlavha</th>
              <th>Sana</th>
              <th>Tartib</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5}>
                  Hozircha slayd yo‘q. Slayd qo‘shilmagan bo‘lsa, karuselda rasmli voqealar ko‘rsatiladi.
                </td>
              </tr>
            )}
            {items.map((i) => (
              <tr key={i.id}>
                <td>
                  <img src={i.image_url} alt={i.title} style={{ width: 90, height: 56, objectFit: "cover", borderRadius: 4 }} />
                </td>
                <td>{i.title}</td>
                <td>{i.date}</td>
                <td>{i.sort_order}</td>
                <td className="row-actions">
                  <a className="btn-secondary" href={`/admin/slides/${i.id}`}>Tahrirlash</a>
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
