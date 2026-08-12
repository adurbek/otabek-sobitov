"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminTranslationsPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [adding, setAdding] = useState({ source: "", ru: "", en: "" });

  async function load(q = "") {
    setLoading(true);
    const res = await fetch(`/api/translations${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocal(source, key, value) {
    setItems((prev) => prev.map((it) => (it.source === source ? { ...it, [key]: value } : it)));
  }

  async function saveOne(source, lang, translated) {
    const res = await fetch("/api/translations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, lang, translated }),
    });
    return res.ok;
  }

  async function saveRow(item) {
    setStatus(null);
    const okRu = await saveOne(item.source, "ru", item.ru || "");
    const okEn = await saveOne(item.source, "en", item.en || "");
    setStatus(
      okRu && okEn
        ? { type: "success", message: "Saqlandi." }
        : { type: "error", message: "Saqlashda xatolik." }
    );
  }

  async function deleteRow(source) {
    if (!confirm("Bu manba uchun ru va en tarjimalarini o'chirasizmi? (avto-tarjima qayta ishlaydi)")) return;
    await fetch(`/api/translations?source=${encodeURIComponent(source)}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.source !== source));
  }

  async function addNew(e) {
    e.preventDefault();
    setStatus(null);
    const source = adding.source.trim();
    if (!source) {
      setStatus({ type: "error", message: "Manba matni (o'zbekcha) talab qilinadi." });
      return;
    }
    const okRu = await saveOne(source, "ru", adding.ru || "");
    const okEn = await saveOne(source, "en", adding.en || "");
    if (okRu && okEn) {
      setAdding({ source: "", ru: "", en: "" });
      setStatus({ type: "success", message: "Qo'shildi." });
      load(query);
    } else {
      setStatus({ type: "error", message: "Qo'shishda xatolik." });
    }
  }

  return (
    <AdminShell active="/admin/translations" title="Tarjimalar">
      <p style={{ fontSize: 14, color: "#5a6b8c", marginBottom: 18, maxWidth: 780, lineHeight: 1.7 }}>
        Sayt ruscha va inglizcha tarjimalarini shu yerdan boshqarasiz. O‘zbekcha
        (asl) matn — manba; rus va ingliz tarjimalarini tahrirlashingiz mumkin.
        Bo‘sh qoldirilsa, o‘sha til uchun avtomatik tarjima qayta ishlatiladi.
        Ўзбекча (kirill) avtomatik hosil bo‘ladi — u yerda sozlash shart emas.
      </p>

      {status && (
        <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
          {status.message}
        </div>
      )}

      <form
        className="admin-form"
        style={{ marginBottom: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          load(query);
        }}
      >
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Qidirish</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Manba yoki tarjima bo'yicha qidiring..."
            />
            <button className="btn-primary" type="submit">Qidirish</button>
          </div>
        </div>
      </form>

      <div className="admin-form" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 14 }}>Yangi tarjima qo‘shish</h3>
        <form onSubmit={addNew}>
          <div className="field">
            <label>Manba (o‘zbekcha, asl matn)</label>
            <input
              value={adding.source}
              onChange={(e) => setAdding({ ...adding, source: e.target.value })}
              placeholder="Masalan: Batafsil ma'lumot"
            />
          </div>
          <div className="field">
            <label>Ruscha (RU)</label>
            <input value={adding.ru} onChange={(e) => setAdding({ ...adding, ru: e.target.value })} />
          </div>
          <div className="field">
            <label>Inglizcha (EN)</label>
            <input value={adding.en} onChange={(e) => setAdding({ ...adding, en: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn-primary" type="submit">Qo‘shish</button>
          </div>
        </form>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "34%" }}>Manba (o‘zbekcha)</th>
              <th style={{ width: "28%" }}>Ruscha</th>
              <th style={{ width: "28%" }}>Inglizcha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>
                  Hozircha tarjima yo‘q. Foydalanuvchi saytni ru/en tilida
                  ochganda avtomatik tarjimalar shu yerda to‘planadi.
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.source}>
                <td style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{it.source}</td>
                <td>
                  <textarea
                    value={it.ru || ""}
                    onChange={(e) => updateLocal(it.source, "ru", e.target.value)}
                    style={{ width: "100%", minHeight: 54, fontSize: 13 }}
                  />
                </td>
                <td>
                  <textarea
                    value={it.en || ""}
                    onChange={(e) => updateLocal(it.source, "en", e.target.value)}
                    style={{ width: "100%", minHeight: 54, fontSize: 13 }}
                  />
                </td>
                <td className="row-actions" style={{ whiteSpace: "nowrap" }}>
                  <button className="btn-secondary" onClick={() => saveRow(it)}>
                    Saqlash
                  </button>
                  <button className="btn-danger" onClick={() => deleteRow(it.source)}>
                    O‘chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
