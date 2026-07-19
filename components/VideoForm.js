"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { extractYoutubeId } from "@/components/VideoGallery";

export default function VideoForm({ initial, itemId }) {
  const router = useRouter();
  const [form, setForm] = useState(
    initial || { title: "", date: "", youtube_url: "", sort_order: 0 }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const ytId = extractYoutubeId(form.youtube_url);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.youtube_url && !ytId) {
      setError("YouTube havolasi noto'g'ri ko'rinadi. Masalan: https://www.youtube.com/watch?v=XXXXXXXXXXX");
      return;
    }
    setSaving(true);
    const url = itemId ? `/api/videos/${itemId}` : "/api/videos";
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
    router.push("/admin/videos");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field">
        <label>Sarlavha</label>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
      </div>
      <div className="field">
        <label>Sana</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
        />
      </div>
      <div className="field">
        <label>YouTube havolasi</label>
        <input
          value={form.youtube_url}
          onChange={(e) => update("youtube_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
        {ytId && (
          <div className="field-hint" style={{ marginTop: 8 }}>
            <img
              src={`https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`}
              alt="Video mukova rasmi"
              style={{ width: 200, borderRadius: 6 }}
            />
          </div>
        )}
      </div>
      <div className="field">
        <label>Tartib raqami</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => update("sort_order", Number(e.target.value))}
        />
        <div className="field-hint">Eng kichik raqamli video bosh sahifada katta karta bo&lsquo;lib chiqadi.</div>
      </div>
      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        <a className="btn-secondary" href="/admin/videos">Bekor qilish</a>
      </div>
    </form>
  );
}
