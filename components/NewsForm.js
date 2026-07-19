"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TAGS = ["Voqea", "Chiqish", "Matbuot e’lon"];

export default function NewsForm({ initial, newsId }) {
  const router = useRouter();
  const [form, setForm] = useState(
    initial || { tag: "Voqea", date: "", title: "", body: "", image_url: "", sort_order: 0 }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Rasm yuklashda xatolik yuz berdi");
      return;
    }
    const data = await res.json();
    update("image_url", data.url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url = newsId ? `/api/news/${newsId}` : "/api/news";
    const method = newsId ? "PUT" : "POST";
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
    router.push("/admin/news");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field">
        <label>Sana</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label>Turi</label>
        <select value={form.tag} onChange={(e) => update("tag", e.target.value)}>
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Sarlavha</label>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
      </div>
      <div className="field">
        <label>Matn</label>
        <textarea value={form.body} onChange={(e) => update("body", e.target.value)} />
      </div>
      <div className="field">
        <label>Rasm</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileUpload} />
        {uploading && <div className="field-hint">Rasm yuklanmoqda...</div>}
        <input
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="yoki tayyor havolani qo'ying: https://..."
          style={{ marginTop: 8 }}
        />
        {form.image_url && (
          <img
            src={form.image_url}
            alt="Tanlangan rasm"
            style={{ width: 220, marginTop: 10, borderRadius: 6, border: "1px solid var(--line)" }}
          />
        )}
        <div className="field-hint">
          Rasmli voqealar bosh sahifadagi katta karusel (hero) va &ldquo;So&lsquo;nggi yangiliklar&rdquo; kartalarida avtomatik chiqadi.
        </div>
      </div>
      <div className="field">
        <label>Tartib raqami</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => update("sort_order", Number(e.target.value))}
        />
        <div className="field-hint">Kichikroq raqam yuqorida chiqadi.</div>
      </div>
      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        <a className="btn-secondary" href="/admin/news">Bekor qilish</a>
      </div>
    </form>
  );
}
