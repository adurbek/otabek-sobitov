"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminBugReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bug-reports")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  async function toggleStatus(item) {
    const next = item.status === "done" ? "new" : "done";
    const res = await fetch(`/api/bug-reports/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
    }
  }

  async function remove(id) {
    if (!confirm("Bu xabarni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/bug-reports/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const newCount = items.filter((i) => i.status !== "done").length;

  return (
    <AdminShell active="/admin/bug-reports" title="Xato xabarlari">
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <>
          <p style={{ fontSize: 14, color: "#5a6b8c", marginBottom: 20 }}>
            Foydalanuvchilar saytdagi &laquo;Xato xabar berish&raquo; tugmasi orqali
            yuborgan xabarlar. Yangi: <b>{newCount}</b> ta.
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Holat</th>
                <th>Xabar</th>
                <th>Sahifa</th>
                <th>Vaqt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5}>Hozircha xabar yo‘q.</td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it.id} style={it.status === "done" ? { opacity: 0.55 } : undefined}>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={() => toggleStatus(it)}
                    >
                      {it.status === "done" ? "✓ Hal qilindi" : "Yangi"}
                    </button>
                  </td>
                  <td style={{ maxWidth: 360, whiteSpace: "pre-wrap" }}>{it.message}</td>
                  <td style={{ maxWidth: 200, wordBreak: "break-all", fontSize: 12 }}>
                    {it.page_url ? (
                      <a href={it.page_url} target="_blank" rel="noreferrer">
                        {it.page_url}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{it.created_at || "—"}</td>
                  <td className="row-actions">
                    <button className="btn-danger" onClick={() => remove(it.id)}>
                      O‘chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </AdminShell>
  );
}
