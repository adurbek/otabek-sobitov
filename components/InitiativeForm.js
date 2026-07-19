"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InitiativeForm({ initial, itemId }) {
  const router = useRouter();
  const [form, setForm] = useState(
    initial || { featured: 0, title: "", description: "", icon: "◆", sort_order: 0 }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url = itemId ? `/api/initiatives/${itemId}` : "/api/initiatives";
    const method = itemId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Saqlashda xatolik yuz berdi");
      return;
    }
    router.push("/admin/initiatives");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field">
        <label>Nomi</label>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
      </div>
      <div className="field">
        <label>Tavsif</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>
      <div className="field">
        <label>Belgi (emoji yoki belgi, ixtiyoriy)</label>
        <input value={form.icon} onChange={(e) => update("icon", e.target.value)} />
      </div>
      <div className="field checkbox-row">
        <label>
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => update("featured", e.target.checked ? 1 : 0)}
          />
          Asosiy (katta) karta sifatida ko‘rsatilsin
        </label>
      </div>
      <div className="field">
        <label>Tartib raqami</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => update("sort_order", Number(e.target.value))}
        />
      </div>
      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        <a className="btn-secondary" href="/admin/initiatives">Bekor qilish</a>
      </div>
    </form>
  );
}
