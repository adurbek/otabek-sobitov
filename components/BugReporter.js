"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function BugReporter() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Ctrl+L (yoki Cmd+L) — brauzer standartini bekor qilib, oynani ochadi.
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const k = (e.key || "").toLowerCase();
        if (k === "l") {
          e.preventDefault();
          setOpen(true);
        }
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Admin panelida ko'rsatilmaydi.
  if (pathname && pathname.startsWith("/admin")) return null;

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (message.trim().length < 3) {
      setError("Iltimos, xatoni qisqacha yozing.");
      return;
    }
    setSending(true);
    const res = await fetch("/api/bug-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        page_url: typeof location !== "undefined" ? location.href : "",
      }),
    });
    setSending(false);
    if (res.ok) {
      setDone(true);
      setMessage("");
      setTimeout(() => {
        setOpen(false);
        setDone(false);
      }, 1800);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Yuborishda xatolik. Qayta urinib ko'ring.");
    }
  }

  return (
    <div data-no-i18n>
      <button
        className="bug-fab"
        aria-label="Xato haqida xabar berish"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Xato xabar berish
      </button>

      {open && (
        <div className="bug-overlay" onClick={() => setOpen(false)}>
          <div className="bug-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bug-close" aria-label="Yopish" onClick={() => setOpen(false)}>
              ✕
            </button>
            <h3 className="bug-title">Xato haqida xabar berish</h3>
            {done ? (
              <p className="bug-thanks">Rahmat! Xabaringiz yuborildi.</p>
            ) : (
              <form onSubmit={submit}>
                <p className="bug-hint">
                  Saytda sezgan kamchilik yoki xatoni yozing — u to‘g‘ridan-to‘g‘ri
                  administratorga yetkaziladi.
                </p>
                {error && <div className="bug-error">{error}</div>}
                <textarea
                  className="bug-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Xatoni shu yerda yozing..."
                  autoFocus
                />
                <button className="bug-submit" type="submit" disabled={sending}>
                  {sending ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
