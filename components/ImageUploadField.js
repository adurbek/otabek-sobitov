"use client";

import { useState } from "react";

export default function ImageUploadField({ label, value, onChange, hint }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
    onChange(data.url);
  }

  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileUpload}
      />
      {uploading && <div className="field-hint">Rasm yuklanmoqda...</div>}
      {error && <div className="field-hint" style={{ color: "#b42318" }}>{error}</div>}
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="yoki tayyor havolani qo'ying: https://..."
        style={{ marginTop: 8 }}
      />
      {value && (
        <img
          src={value}
          alt="Tanlangan rasm"
          style={{ width: 200, marginTop: 10, borderRadius: 6, border: "1px solid var(--line)" }}
        />
      )}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
