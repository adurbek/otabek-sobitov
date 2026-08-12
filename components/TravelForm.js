"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/ImageUploadField";
import TravelGallery from "@/components/TravelGallery";

export default function TravelForm({ initial, itemId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    city: "",
    country: "",
    date_label: "",
    event: "",
    description: "",
    body: "",
    image_url: "",
    sort_order: 0,
    ...(initial || {}),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url = itemId ? `/api/travels/${itemId}` : "/api/travels";
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
    router.push("/admin/travels");
    router.refresh();
  }

  return (
    <>
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field">
        <label>Shahar</label>
        <input value={form.city} onChange={(e) => update("city", e.target.value)} required />
      </div>
      <div className="field">
        <label>Mamlakat</label>
        <input value={form.country} onChange={(e) => update("country", e.target.value)} />
      </div>
      <div className="field">
        <label>Sana (masalan: Iyun 2026)</label>
        <input value={form.date_label} onChange={(e) => update("date_label", e.target.value)} />
      </div>
      <div className="field">
        <label>Tadbir nomi</label>
        <input value={form.event} onChange={(e) => update("event", e.target.value)} />
      </div>
      <div className="field">
        <label>Qisqa tavsif (kartada ko'rinadi)</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} />
        <div className="field-hint">Safarlar sahifasidagi kartochkada chiqadi (~2 abzas).</div>
      </div>
      <div className="field">
        <label>To'liq ma'lumot (batafsil sahifada)</label>
        <textarea
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          style={{ minHeight: 160 }}
        />
        <div className="field-hint">Kartaga bosilganda ochiladigan ichki sahifada to'liq matn chiqadi. Yangi abzas uchun bo'sh qator qoldiring.</div>
      </div>
      <ImageUploadField
        label="Asosiy rasm"
        value={form.image_url}
        onChange={(url) => update("image_url", url)}
        hint="Kartochkada va batafsil sahifa tepasida chiqadi. Gorizontal rasm tavsiya etiladi."
      />
      <div className="field">
        <label>Tartib raqami</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => update("sort_order", Number(e.target.value))}
        />
        <div className="field-hint">Kichikroq raqam ro‘yxat boshida chiqadi (0 = eng so‘nggi tashrif).</div>
      </div>
      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        <a className="btn-secondary" href="/admin/travels">Bekor qilish</a>
      </div>
    </form>

    {itemId ? (
      <TravelGallery travelId={itemId} />
    ) : (
      <p className="field-hint" style={{ marginTop: 16 }}>
        Galereya rasmlarini qo'shish uchun avval safarni saqlang, so'ng uni tahrirlashga qayting.
      </p>
    )}
    </>
  );
}
