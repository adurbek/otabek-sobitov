"use client";

import { useEffect, useRef, useState } from "react";

const MONTHS_UZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

const PLACEHOLDER_SLIDES = [
  {
    id: "p1",
    title:
      "[Slayd sarlavhasi — admin paneldagi \"Bosh sahifa karuseli\" bo'limidan rasm va sarlavha qo'shing]",
    date: "",
    image_url: "",
  },
  {
    id: "p2",
    title: "[Ikkinchi slayd sarlavhasi shu yerda ko'rinadi]",
    date: "",
    image_url: "",
  },
];

function splitDate(raw) {
  if (!raw) return null;
  const m = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return { day: raw, month: "" };
  return { day: String(Number(m[3])), month: MONTHS_UZ[Number(m[2]) - 1] || "" };
}

export default function HeroCarousel({ slides }) {
  const items = slides && slides.length ? slides : PLACEHOLDER_SLIDES;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const go = (idx) => setCurrent((idx + items.length) % items.length);

  useEffect(() => {
    if (items.length < 2) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % items.length),
      5000
    );
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (items.length < 2) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % items.length),
      5000
    );
  };

  return (
    <section className="hero-slider" aria-label="So'nggi voqealar">
      {items.map((slide, i) => {
        const d = splitDate(slide.date);
        return (
          <div key={slide.id} className={`hero-slide${i === current ? " active" : ""}`}>
            {slide.image_url ? (
              <img src={slide.image_url} alt={slide.title} />
            ) : (
              <div className="hero-slide-placeholder" />
            )}
            <div className="hero-slide-shade" />
            <div className="container hero-slide-content">
              <h2 className="hero-slide-title">{slide.title}</h2>
              {d && (
                <div className="hero-slide-date">
                  <b>{d.day}</b>
                  {d.month && <span>{d.month}</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {items.length > 1 && (
        <>
          <button
            className="hero-arrow prev"
            aria-label="Oldingi slayd"
            onClick={() => {
              go(current - 1);
              restartTimer();
            }}
          >
            ‹
          </button>
          <button
            className="hero-arrow next"
            aria-label="Keyingi slayd"
            onClick={() => {
              go(current + 1);
              restartTimer();
            }}
          >
            ›
          </button>
          <div className="hero-dots">
            {items.map((s, i) => (
              <button
                key={s.id}
                className={i === current ? "active" : ""}
                aria-label={`${i + 1}-slayd`}
                onClick={() => {
                  go(i);
                  restartTimer();
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
