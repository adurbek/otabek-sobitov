"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/ImageUploadField";

const EMPTY = { image_url: "", caption: "", sort_order: 0 };

export default function TravelGallery({ travelId }) {
  const [images, setImages] = useState([]);
  const [newImg, setNewImg] = useState(EMPTY);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/travel-images?travel_id=${travelId}`)
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [travelId]);

  async function handleAdd(e) {
    e.preventDefault();
    setStatus(null);
    if (!newImg.image_url) {
      setStatus({ type: "error", message: "Avval rasm yuklang." });
      return;
    }
    const res = await fetch("/api/travel-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newImg, travel_id: travelId }),
    });
    if (res.ok) {
      const created = await res.json();
      setImages((prev) => [...prev, created]);
      setNewImg(EMPTY);
      setStatus({ type: "success", message: "Rasm qo'shildi." });
    } else {
      const data = await res.json().catch(() => null);
      setStatus({ type: "error", message: data?.error || "Qo'shishda xatolik." });
    }
  }

  async function saveImage(img) {
    setStatus(null);
    const res = await fetch(`/api/travel-images/${img.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(img),
    });
    if (res.ok) setStatus({ type: "success", message: "Saqlandi." });
    else setStatus({ type: "error", message: "Saqlashda xatolik." });
  }

  async function deleteImage(id) {
    if (!confirm("Bu rasmni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/travel-images/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  function updateLocal(id, key, value) {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  }

  return (
    <div className="admin-form" style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 6 }}>Galereya rasmlari</h3>
      <p className="field-hint" style={{ marginBottom: 18 }}>
        Ichki (batafsil) sahifada har bir rasm o'z izohi bilan chiqadi.
      </p>

      {status && (
        <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
          {status.message}
        </div>
      )}

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <>
          {images.map((img) => (
            <div
              key={img.id}
              style={{ borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 16 }}
            >
              <img
                src={img.image_url}
                alt=""
                style={{ width: 160, borderRadius: 6, border: "1px solid var(--line)", marginBottom: 10 }}
              />
              <div className="field">
                <label>Izoh</label>
                <textarea
                  value={img.caption || ""}
                  onChange={(e) => updateLocal(img.id, "caption", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Tartib raqami</label>
                <input
                  type="number"
                  value={img.sort_order}
                  onChange={(e) => updateLocal(img.id, "sort_order", Number(e.target.value))}
                />
              </div>
              <div className="row-actions">
                <button type="button" className="btn-secondary" onClick={() => saveImage(img)}>
                  Saqlash
                </button>
                <button type="button" className="btn-danger" onClick={() => deleteImage(img.id)}>
                  O'chirish
                </button>
              </div>
            </div>
          ))}

          <h4 style={{ margin: "20px 0 12px" }}>Yangi rasm qo'shish</h4>
          <ImageUploadField
            label="Rasm"
            value={newImg.image_url}
            onChange={(url) => setNewImg((p) => ({ ...p, image_url: url }))}
          />
          <div className="field">
            <label>Izoh</label>
            <textarea
              value={newImg.caption}
              onChange={(e) => setNewImg((p) => ({ ...p, caption: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Tartib raqami</label>
            <input
              type="number"
              value={newImg.sort_order}
              onChange={(e) => setNewImg((p) => ({ ...p, sort_order: Number(e.target.value) }))}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={handleAdd}>
              Rasm qo'shish
            </button>
          </div>
        </>
      )}
    </div>
  );
}
