"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminTravelsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/travels")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id) {
    if (!confirm("Bu safarni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/travels/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AdminShell active="/admin/travels" title="Safarlar">
      <div style={{ marginBottom: 20 }}>
        <a className="btn-primary" href="/admin/travels/new" style={{ display: "inline-block", textDecoration: "none" }}>
          + Yangi safar qo‘shish
        </a>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Shahar</th>
              <th>Sana</th>
              <th>Tadbir</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>Hozircha safar yo‘q.</td>
              </tr>
            )}
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.city}{i.country ? `, ${i.country}` : ""}</td>
                <td>{i.date_label}</td>
                <td>{i.event}</td>
                <td className="row-actions">
                  <a className="btn-secondary" href={`/admin/travels/${i.id}`}>Tahrirlash</a>
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
