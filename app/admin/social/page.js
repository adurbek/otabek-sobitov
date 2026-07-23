"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import ImageUploadField from "@/components/ImageUploadField";

const NETWORKS = [
  { key: "facebook", label: "Facebook" },
  { key: "telegram", label: "Telegram" },
  { key: "linkedin", label: "LinkedIn" },
];

const EMPTY_POST = { network: "facebook", image_url: "", body: "", link_url: "", date: "", sort_order: 0 };

export default function AdminSocialPage() {
  const [profiles, setProfiles] = useState({});
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState(EMPTY_POST);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/social-profiles").then((r) => r.json()),
      fetch("/api/social-posts").then((r) => r.json()),
    ]).then(([profileList, postList]) => {
      const map = {};
      for (const p of profileList) map[p.network] = p;
      for (const n of NETWORKS) {
        if (!map[n.key]) map[n.key] = { network: n.key, display_name: "", handle: "", avatar_url: "", followers: "", profile_url: "" };
      }
      setProfiles(map);
      setPosts(postList);
      setLoading(false);
    });
  }, []);

  function updateProfile(network, key, value) {
    setProfiles((prev) => ({ ...prev, [network]: { ...prev[network], [key]: value } }));
  }

  async function saveProfile(network) {
    setStatus(null);
    const res = await fetch("/api/social-profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profiles[network]),
    });
    if (res.ok) {
      setStatus({ type: "success", message: `${network} profili saqlandi.` });
    } else {
      const data = await res.json().catch(() => null);
      setStatus({ type: "error", message: data?.error || `Saqlashda xatolik (${res.status}).` });
    }
  }

  async function handleAddPost(e) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/social-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    if (res.ok) {
      const created = await res.json();
      setPosts((prev) => [...prev, created]);
      setNewPost({ ...EMPTY_POST, network: newPost.network });
      setStatus({ type: "success", message: "Post qo‘shildi." });
    } else {
      const data = await res.json().catch(() => null);
      setStatus({ type: "error", message: data?.error || `Qo‘shishda xatolik (${res.status}).` });
    }
  }

  async function handleDeletePost(id) {
    if (!confirm("Bu postni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/social-posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <AdminShell active="/admin/social" title="Ijtimoiy tarmoqlar">
        <p>Yuklanmoqda...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="/admin/social" title="Ijtimoiy tarmoqlar">
      {status && (
        <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
          {status.message}
        </div>
      )}

      <p style={{ fontSize: 14, color: "#5a6b8c", marginBottom: 24, maxWidth: 760, lineHeight: 1.7 }}>
        Instagram lentasi avtomatik keladi. Facebook, Telegram va LinkedIn ochiq
        embed bermaydi, shuning uchun ularning kartalari shu yerdan to‘ldiriladi:
        profil rasmi va nomi sarlavhada, postlar esa scroll bo‘ladigan ro‘yxatda
        chiqadi.
      </p>

      {NETWORKS.map((n) => (
        <div className="admin-form" key={n.key} style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>{n.label} — profil sarlavhasi</h3>
          <ImageUploadField
            label="Profil rasmi"
            value={profiles[n.key].avatar_url}
            onChange={(url) => updateProfile(n.key, "avatar_url", url)}
            hint="Kartaning tepasida dumaloq qilib chiqadi."
          />
          <div className="field">
            <label>Ism</label>
            <input
              value={profiles[n.key].display_name || ""}
              onChange={(e) => updateProfile(n.key, "display_name", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Foydalanuvchi nomi</label>
            <input
              value={profiles[n.key].handle || ""}
              onChange={(e) => updateProfile(n.key, "handle", e.target.value)}
              placeholder="@nom yoki sahifa nomi"
            />
          </div>
          <div className="field">
            <label>Obunachilar (ixtiyoriy)</label>
            <input
              value={profiles[n.key].followers || ""}
              onChange={(e) => updateProfile(n.key, "followers", e.target.value)}
              placeholder="masalan: 3,808 obunachi"
            />
          </div>
          <div className="field">
            <label>Profil havolasi</label>
            <input
              value={profiles[n.key].profile_url || ""}
              onChange={(e) => updateProfile(n.key, "profile_url", e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={() => saveProfile(n.key)}>
              Saqlash
            </button>
          </div>
        </div>
      ))}

      <div className="admin-form" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Yangi post qo‘shish</h3>
        <form onSubmit={handleAddPost}>
          <div className="field">
            <label>Tarmoq</label>
            <select
              value={newPost.network}
              onChange={(e) => setNewPost({ ...newPost, network: e.target.value })}
            >
              {NETWORKS.map((n) => (
                <option key={n.key} value={n.key}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>
          <ImageUploadField
            label="Post rasmi"
            value={newPost.image_url}
            onChange={(url) => setNewPost({ ...newPost, image_url: url })}
          />
          <div className="field">
            <label>Matn</label>
            <textarea
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Post havolasi (ixtiyoriy)</label>
            <input
              value={newPost.link_url}
              onChange={(e) => setNewPost({ ...newPost, link_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="field">
            <label>Sana (ixtiyoriy)</label>
            <input
              value={newPost.date}
              onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
              placeholder="2026-07-23"
            />
          </div>
          <div className="field">
            <label>Tartib raqami</label>
            <input
              type="number"
              value={newPost.sort_order}
              onChange={(e) => setNewPost({ ...newPost, sort_order: Number(e.target.value) })}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Qo‘shish
            </button>
          </div>
        </form>
      </div>

      <h3 style={{ margin: "0 0 16px" }}>Qo‘shilgan postlar</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tarmoq</th>
            <th>Rasm</th>
            <th>Matn</th>
            <th>Sana</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr>
              <td colSpan={5}>Hozircha post yo‘q.</td>
            </tr>
          )}
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{NETWORKS.find((n) => n.key === p.network)?.label || p.network}</td>
              <td>
                {p.image_url ? (
                  <img src={p.image_url} alt="" style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 4 }} />
                ) : (
                  "—"
                )}
              </td>
              <td style={{ maxWidth: 320 }}>{p.body ? p.body.slice(0, 90) : "—"}</td>
              <td>{p.date || "—"}</td>
              <td className="row-actions">
                <button className="btn-danger" onClick={() => handleDeletePost(p.id)}>
                  O‘chirish
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
