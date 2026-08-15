"use client";

import { useEffect } from "react";

// Sayt bo'limlari ekranga kirganda mayin (biroz sekin) suzib paydo bo'ladi.
// Kontent SSR'da ko'rinadi; effekt faqat JS ishga tushgach qo'shiladi, shuning
// uchun JS o'chiq bo'lsa ham hech narsa yashirinib qolmaydi.
const SELECTOR = "section, .hero-carousel, footer";

export default function ScrollReveal() {
  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Ustma-ust joylashgan (nested) bo'limlarni ikki marta belgilamaymiz.
    const all = Array.from(document.querySelectorAll(SELECTOR));
    const targets = all.filter(
      (el) => !all.some((other) => other !== el && other.contains(el))
    );

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    for (const el of targets) {
      el.classList.add("reveal");
      io.observe(el);
    }

    return () => io.disconnect();
  }, []);

  return null;
}
