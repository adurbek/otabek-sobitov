"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import WORLD from "@/lib/mapdata/world.json";
import UZB from "@/lib/mapdata/uzbekistan.json";

const SCOPE_LABELS = { world: "Xorij", region: "Hudud" };

export default function AdminVisitsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState("world");
  const [code, setCode] = useState("");
  const [visits, setVisits] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/map-visits")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  const places = useMemo(
    () => (scope === "world" ? WORLD.filter((c) => c.id !== "UZ") : UZB),
    [scope]
  );

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!code) {
      setError("Joy tanlanishi kerak");
      return;
    }
    const place = places.find((p) => p.id === code);
    setSaving(true);
    const res = await fetch("/api/map-visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope, code, name: place?.name || code, visits }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Saqlashda xatolik yuz berdi");
      return;
    }
    const saved = await res.json();
    setItems((prev) => {
      const rest = prev.filter((i) => i.id !== saved.id);
      return [...rest, saved].sort((a, b) =>
        a.name.localeCompare(b.name, "uz")
      );
    });
    setCode("");
    setVisits(1);
  }

  async function changeVisits(item, next) {
    if (next < 1) return;
    const res = await fetch(`/api/map-visits/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visits: next }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleDelete(id) {
    if (!confirm("Bu tashrifni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/map-visits/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AdminShell active="/admin/visits" title="Tashriflar xaritasi">
      <form className="admin-form" onSubmit={handleAdd} style={{ marginBottom: 28 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field">
          <label>Xarita</label>
          <select
            value={scope}
            onChange={(e) => {
              setScope(e.target.value);
              setCode("");
            }}
          >
            <option value="world">Xorijga tashriflar (dunyo xaritasi)</option>
            <option value="region">Hududlarga tashriflar (O‘zbekiston xaritasi)</option>
          </select>
        </div>
        <div className="field">
          <label>{scope === "world" ? "Davlat" : "Hudud"}</label>
          <select value={code} onChange={(e) => setCode(e.target.value)}>
            <option value="">— Tanlang —</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Necha marta tashrif buyurgan</label>
          <input
            type="number"
            min={1}
            value={visits}
            onChange={(e) => setVisits(Math.max(1, Number(e.target.value) || 1))}
          />
          <div className="field-hint">
            Tashriflar soni ko‘paygani sari xaritadagi rang och ko‘kdan to‘q
            ko‘kka o‘zgaradi.
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Xarita</th>
              <th>Joy</th>
              <th>Tashriflar soni</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>Hozircha tashrif belgilanmagan.</td>
              </tr>
            )}
            {items.map((i) => (
              <tr key={i.id}>
                <td>{SCOPE_LABELS[i.scope] || i.scope}</td>
                <td>{i.name}</td>
                <td>
                  <span className="visit-counter">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => changeVisits(i, i.visits - 1)}
                      disabled={i.visits <= 1}
                    >
                      &minus;
                    </button>
                    <b>{i.visits}</b>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => changeVisits(i, i.visits + 1)}
                    >
                      +
                    </button>
                  </span>
                </td>
                <td className="row-actions">
                  <button className="btn-danger" onClick={() => handleDelete(i.id)}>
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
