"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import ImageUploadField from "@/components/ImageUploadField";

export default function AdminAboutPage() {
  const router = useRouter();
  const [about, setAbout] = useState(null);
  const [principlesText, setPrinciplesText] = useState("");
  const [awards, setAwards] = useState([]);
  const [newAward, setNewAward] = useState({ year: "", title: "", description: "", image_url: "", link_url: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/about").then((r) => r.json()),
      fetch("/api/about/awards").then((r) => r.json()),
    ]).then(([aboutData, awardsData]) => {
      setAbout(aboutData);
      setPrinciplesText((JSON.parse(aboutData.principles || "[]") || []).join("\n"));
      setAwards(awardsData);
      setLoading(false);
    });
  }, []);

  function updateField(key, value) {
    setAbout((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus(null);
    const principles = principlesText.split("\n").map((p) => p.trim()).filter(Boolean);
    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...about, principles }),
    });
    if (res.ok) {
      setStatus({ type: "success", message: "Saqlandi." });
    } else if (res.status === 401) {
      setStatus({
        type: "error",
        message: "Sessiya muddati tugagan. Qayta kiring — sahifa 3 soniyada login sahifasiga o‘tadi.",
      });
      setTimeout(() => router.push("/admin/login?next=/admin/about"), 3000);
    } else {
      const data = await res.json().catch(() => null);
      setStatus({
        type: "error",
        message: data?.error || `Saqlashda xatolik yuz berdi (${res.status}).`,
      });
    }
  }

  async function handleAddAward(e) {
    e.preventDefault();
    if (!newAward.year || !newAward.title) return;
    const res = await fetch("/api/about/awards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAward),
    });
    if (res.ok) {
      const created = await res.json();
      setAwards((prev) => [created, ...prev]);
      setNewAward({ year: "", title: "", description: "", image_url: "", link_url: "" });
    }
  }

  async function handleDeleteAward(id) {
    if (!confirm("Bu mukofotni o‘chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/about/awards/${id}`, { method: "DELETE" });
    setAwards((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading || !about) {
    return (
      <AdminShell active="/admin/about" title="Men haqimda">
        <p>Yuklanmoqda...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="/admin/about" title="Men haqimda">
      {status && (
        <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
          {status.message}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSave} style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Maqom</h3>
        <ImageUploadField
          label="Portret rasmi"
          value={about.photo_url}
          onChange={(url) => updateField("photo_url", url)}
          hint="«Men haqimda» sahifasidagi Maqom bo'limida chiqadi. Vertikal (3:4) rasm tavsiya etiladi."
        />
        <div className="field">
          <label>Havola (ixtiyoriy)</label>
          <input
            value={about.link_url || ""}
            onChange={(e) => updateField("link_url", e.target.value)}
            placeholder="https://... (rasmiy sahifa, hujjat va h.k.)"
          />
          <div className="field-hint">Kiritilsa, Maqom bo‘limida «Batafsil» tugmasi sifatida chiqadi.</div>
        </div>
        <div className="field">
          <label>To‘liq ism</label>
          <input value={about.full_name || ""} onChange={(e) => updateField("full_name", e.target.value)} />
        </div>
        <div className="field">
          <label>Yo‘nalish (bosh sahifadagi sarlavha sifatida ham ishlatiladi)</label>
          <input value={about.direction || ""} onChange={(e) => updateField("direction", e.target.value)} />
        </div>
        <div className="field">
          <label>Joriy faoliyat</label>
          <input value={about.position || ""} onChange={(e) => updateField("position", e.target.value)} />
        </div>
        <div className="field">
          <label>Ta’lim</label>
          <input value={about.education || ""} onChange={(e) => updateField("education", e.target.value)} />
        </div>
        <div className="field">
          <label>Qisqacha (bosh sahifada ham ko‘rinadi)</label>
          <textarea value={about.summary || ""} onChange={(e) => updateField("summary", e.target.value)} />
        </div>
        <div className="field">
          <label>Faoliyat tamoyillari (har birini alohida qatorga yozing)</label>
          <textarea value={principlesText} onChange={(e) => setPrinciplesText(e.target.value)} />
        </div>

        <h3 style={{ margin: "24px 0 16px" }}>Tarjimai hol</h3>
        <div className="field">
          <label>Ta’lim (batafsil)</label>
          <textarea value={about.bio_education || ""} onChange={(e) => updateField("bio_education", e.target.value)} />
        </div>
        <div className="field">
          <label>Kasbiy faoliyat</label>
          <textarea value={about.bio_career || ""} onChange={(e) => updateField("bio_career", e.target.value)} />
        </div>
        <div className="field">
          <label>Ijtimoiy va boshqa faoliyat</label>
          <textarea value={about.bio_social || ""} onChange={(e) => updateField("bio_social", e.target.value)} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Saqlash</button>
        </div>
      </form>

      <h3 style={{ marginBottom: 16 }}>Mukofotlar</h3>
      <form className="admin-form" onSubmit={handleAddAward} style={{ marginBottom: 24 }}>
        <div className="field">
          <label>Yil</label>
          <input value={newAward.year} onChange={(e) => setNewAward({ ...newAward, year: e.target.value })} placeholder="2026" />
        </div>
        <div className="field">
          <label>Nomi</label>
          <input value={newAward.title} onChange={(e) => setNewAward({ ...newAward, title: e.target.value })} />
        </div>
        <div className="field">
          <label>Tavsif</label>
          <textarea value={newAward.description} onChange={(e) => setNewAward({ ...newAward, description: e.target.value })} />
        </div>
        <ImageUploadField
          label="Mukofot rasmi (ixtiyoriy)"
          value={newAward.image_url}
          onChange={(url) => setNewAward((prev) => ({ ...prev, image_url: url }))}
          hint="Diplom, medal yoki tadbir rasmi — mukofot kartochkasida chiqadi."
        />
        <div className="field">
          <label>Havola (ixtiyoriy)</label>
          <input
            value={newAward.link_url}
            onChange={(e) => setNewAward({ ...newAward, link_url: e.target.value })}
            placeholder="https://... (yangilik, sertifikat va h.k.)"
          />
          <div className="field-hint">Kiritilsa, mukofot kartochkasida «Batafsil» havolasi chiqadi.</div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Mukofot qo‘shish</button>
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Rasm</th>
            <th>Yil</th>
            <th>Nomi</th>
            <th>Tavsif</th>
            <th>Havola</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {awards.length === 0 && (
            <tr>
              <td colSpan={6}>Hozircha mukofot yo‘q.</td>
            </tr>
          )}
          {awards.map((a) => (
            <tr key={a.id}>
              <td>
                {a.image_url ? (
                  <img src={a.image_url} alt={a.title} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 4 }} />
                ) : (
                  "—"
                )}
              </td>
              <td>{a.year}</td>
              <td>{a.title}</td>
              <td>{a.description}</td>
              <td>
                {a.link_url ? (
                  <a href={a.link_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--navy-3)", fontWeight: 600 }}>
                    Ochish ↗
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="row-actions">
                <button className="btn-danger" onClick={() => handleDeleteAward(a.id)}>O‘chirish</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
