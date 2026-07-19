"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminInitiativesListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/initiatives")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id) {
    if (!confirm("Bu tashabbusni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/initiatives/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AdminShell active="/admin/initiatives" title="Tashabbuslar">
      <div style={{ marginBottom: 20 }}>
        <a className="btn-primary" href="/admin/initiatives/new" style={{ display: "inline-block", textDecoration: "none" }}>
          + Yangi tashabbus qo‘shish
        </a>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Asosiy kartami?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={3}>Hozircha tashabbus yo‘q.</td>
              </tr>
            )}
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.title}</td>
                <td>{i.featured ? "Ha" : "Yo‘q"}</td>
                <td className="row-actions">
                  <a className="btn-secondary" href={`/admin/initiatives/${i.id}`}>Tahrirlash</a>
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
