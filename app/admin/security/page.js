"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirm) {
      setStatus({ type: "error", message: "Yangi parol va tasdiq mos kelmadi." });
      return;
    }

    setSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSaving(false);

    if (res.ok) {
      setStatus({ type: "success", message: "Parol muvaffaqiyatli o'zgartirildi." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } else {
      const data = await res.json().catch(() => null);
      setStatus({ type: "error", message: data?.error || `Xatolik (${res.status}).` });
    }
  }

  return (
    <AdminShell active="/admin/security" title="Xavfsizlik">
      {status && (
        <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
          {status.message}
        </div>
      )}

      <div className="admin-form" style={{ maxWidth: 480 }}>
        <h3 style={{ marginBottom: 6 }}>Parolni o'zgartirish</h3>
        <p className="field-hint" style={{ marginBottom: 18 }}>
          Yangi parol kamida 12 belgi, katta va kichik harf, raqam hamda maxsus
          belgidan iborat bo'lishi kerak.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Joriy parol</label>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Yangi parol</label>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Yangi parolni tasdiqlang</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
