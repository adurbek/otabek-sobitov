"use client";

import { useEffect, useState } from "react";
import MultiLangField from "@/components/MultiLangField";

const EMPTY = { year: "", title: "", text: "", sort_order: 0 };

export default function AboutTimeline() {
  const [items, setItems] = useState([]);
  const [adding, setAdding] = useState(EMPTY);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/about-timeline")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  function updateLocal(id, key, value) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  }

  async function save(item) {
    setStatus(null);
    const res = await fetch(`/api/about-timeline/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setStatus(res.ok ? { type: "success", message: "Saqlandi." } : { type: "error", message: "Xatolik." });
  }

  async function remove(id) {
    if (!confirm("Bu bosqichni o'chirasizmi?")) return;
    await fetch(`/api/about-timeline/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function add(e) {
    e.preventDefault();
    setStatus(null);
    if (!adding.year && !adding.title) {
      setStatus({ type: "error", message: "Yil yoki nom kiriting." });
      return;
    }
    const res = await fetch("/api/about-timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adding),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((prev) => [...prev, created]);
      setAdding(EMPTY);
      setStatus({ type: "success", message: "Bosqich qo'shildi." });
    } else {
      setStatus({ type: "error", message: "Qo'shishda xatolik." });
    }
  }

  return (
    <div className="admin-form" style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 6 }}>Tarjimai hol — yillar bo'yicha</h3>
      <p className="field-hint" style={{ marginBottom: 18 }}>
        Har bir bosqichni yil + matn bilan kiriting. Sayt ularni chiroyli
        timeline qilib ko'rsatadi. Русский/English tarjimasini matn tab'laridan
        kiriting.
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
          {items.map((it) => (
            <div key={it.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="field" style={{ width: 130 }}>
                  <label>Yil</label>
                  <input value={it.year || ""} onChange={(e) => updateLocal(it.id, "year", e.target.value)} placeholder="2024" />
                </div>
                <div className="field" style={{ width: 130 }}>
                  <label>Tartib</label>
                  <input type="number" value={it.sort_order} onChange={(e) => updateLocal(it.id, "sort_order", Number(e.target.value))} />
                </div>
              </div>
              <MultiLangField label="Sarlavha" value={it.title || ""} onChange={(v) => updateLocal(it.id, "title", v)} type="input" />
              <MultiLangField label="Matn" value={it.text || ""} onChange={(v) => updateLocal(it.id, "text", v)} type="textarea" />
              <div className="row-actions">
                <button type="button" className="btn-secondary" onClick={() => save(it)}>Saqlash</button>
                <button type="button" className="btn-danger" onClick={() => remove(it.id)}>O'chirish</button>
              </div>
            </div>
          ))}

          <h4 style={{ margin: "20px 0 12px" }}>Yangi bosqich qo'shish</h4>
          <form onSubmit={add}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="field" style={{ width: 130 }}>
                <label>Yil</label>
                <input value={adding.year} onChange={(e) => setAdding({ ...adding, year: e.target.value })} placeholder="2024" />
              </div>
              <div className="field" style={{ width: 130 }}>
                <label>Tartib</label>
                <input type="number" value={adding.sort_order} onChange={(e) => setAdding({ ...adding, sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="field">
              <label>Sarlavha</label>
              <input value={adding.title} onChange={(e) => setAdding({ ...adding, title: e.target.value })} placeholder="Masalan: Universitetni bitirdi" />
            </div>
            <div className="field">
              <label>Matn</label>
              <textarea value={adding.text} onChange={(e) => setAdding({ ...adding, text: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Bosqich qo'shish</button>
            </div>
          </form>
          <p className="field-hint" style={{ marginTop: 10 }}>
            Qo'shgandan keyin tarjimalarni yuqoridagi bosqich matn tab'laridan
            kiritasiz.
          </p>
        </>
      )}
    </div>
  );
}
