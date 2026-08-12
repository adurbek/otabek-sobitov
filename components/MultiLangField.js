"use client";

import { useEffect, useRef, useState } from "react";
import { latinToCyrillic } from "@/lib/i18n";

// Har bir maydon uchun til tab'lari:
//  - O'zbekcha: asosiy qiymat (value/onChange orqali kontent bilan saqlanadi)
//  - Ўзбекча: o'zbekcha (lotin) dan avtomatik kirill (o'zgartirib bo'lmaydi)
//  - Русский / English: tarjima bazasiga (translations) saqlanadi; public sayt
//    shu bazadan foydalanib avtomatik ko'rsatadi.
const TABS = [
  { code: "uz", label: "O'zbekcha" },
  { code: "oz", label: "Ўзбекча" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function MultiLangField({
  label,
  value,
  onChange,
  type = "input",
  hint,
  placeholder,
}) {
  const [tab, setTab] = useState("uz");
  const [ru, setRu] = useState("");
  const [en, setEn] = useState("");
  const [loaded, setLoaded] = useState(false);
  const source = (value || "").trim();

  // Boshlang'ich yuklash — bir marta: joriy o'zbekcha matn uchun ru/en tarjimasi.
  useEffect(() => {
    let cancelled = false;
    const initial = (value || "").trim();
    if (!initial) {
      setLoaded(true);
      return;
    }
    fetch(`/api/translations?q=${encodeURIComponent(initial)}`)
      .then((r) => r.json())
      .then((list) => {
        if (cancelled) return;
        const hit = Array.isArray(list)
          ? list.find((it) => it.source === initial)
          : null;
        setRu(hit?.ru || "");
        setEn(hit?.en || "");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ru/en o'zgarsa yoki o'zbekcha matn o'zgarsa — joriy manba bo'yicha saqlanadi.
  useEffect(() => {
    if (!loaded || !source) return;
    const t = setTimeout(() => {
      fetch("/api/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "ru", source, translated: ru }),
      }).catch(() => {});
      fetch("/api/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "en", source, translated: en }),
      }).catch(() => {});
    }, 700);
    return () => clearTimeout(t);
  }, [ru, en, source, loaded]);

  const ozValue = source ? latinToCyrillic(value) : "";

  const Input = type === "textarea" ? "textarea" : "input";

  function renderField() {
    if (tab === "uz") {
      return (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      );
    }
    if (tab === "oz") {
      return (
        <>
          <Input value={ozValue} readOnly tabIndex={-1} style={{ background: "#f5f7fa", color: "#5a6b8c" }} />
          <div className="mlf-auto-note">Ўзбекча (kirill) o'zbekchadan avtomatik hosil bo'ladi.</div>
        </>
      );
    }
    if (tab === "ru") {
      return (
        <Input
          value={ru}
          onChange={(e) => setRu(e.target.value)}
          placeholder={source ? "Ruscha tarjima" : "Avval o'zbekcha matnni kiriting"}
          disabled={!source}
        />
      );
    }
    return (
      <Input
        value={en}
        onChange={(e) => setEn(e.target.value)}
        placeholder={source ? "Inglizcha tarjima" : "Avval o'zbekcha matnni kiriting"}
        disabled={!source}
      />
    );
  }

  const filled = { ru: Boolean(ru.trim()), en: Boolean(en.trim()) };

  return (
    <div className="mlf">
      {label && <label className="mlf-label">{label}</label>}
      <div className="mlf-tabs">
        {TABS.map((t) => (
          <button
            key={t.code}
            type="button"
            className={
              "mlf-tab" +
              (tab === t.code ? " active" : "") +
              (filled[t.code] ? " filled" : "")
            }
            onClick={() => setTab(t.code)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {renderField()}
      {hint && <div className="mlf-hint">{hint}</div>}
    </div>
  );
}
