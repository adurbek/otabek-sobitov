"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Butun sahifa uchun silliq, inersiyali (momentum) skroll. Sichqoncha g'ildiragi
// bilan skroll qilganda harakat yumshoq boshlanib, sekin to'xtaydi — bu ko'zga
// yoqimliroq ko'rinadi. Faqat desktopda (sichqoncha) ishlaydi; telefon/planshetda
// tabiiy skroll qoladi. Admin panelda va prefers-reduced-motion holatida o'chiq.
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Admin panelni tabiiy holatda qoldiramiz (formalar, jadvallar).
    if (pathname && pathname.startsWith("/admin")) return;

    const mq = window.matchMedia;
    if (mq && mq("(prefers-reduced-motion: reduce)").matches) return;
    // Faqat aniq ko'rsatkich (sichqoncha) — touch qurilmalarda tabiiy skroll.
    if (mq && !mq("(pointer: fine)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let running = false;
    let rafId = null;
    const EASE = 0.085; // kichikroq = silliqroq va sekinroq to'xtaydi

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    // Wheel elementi ichida o'z skroli bo'lgan quti bo'lsa — unga tegmaymiz.
    function scrollableAncestor(el) {
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.nodeType === 1) {
          const oy = getComputedStyle(el).overflowY;
          if (
            (oy === "auto" || oy === "scroll") &&
            el.scrollHeight > el.clientHeight
          )
            return el;
        }
        el = el.parentElement;
      }
      return null;
    }

    function loop() {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        window.scrollTo(0, current);
        running = false;
        rafId = null;
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(loop);
    }

    function onWheel(e) {
      if (e.ctrlKey) return; // brauzer zoom
      if (scrollableAncestor(e.target)) return; // ichki skroll — tabiiy qoldiramiz
      e.preventDefault();
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
      if (!running) {
        running = true;
        current = window.scrollY;
        rafId = requestAnimationFrame(loop);
      }
    }

    // Klaviatura, scrollbar yoki anchor orqali skroll bo'lsa — target'ni moslaymiz.
    function onScroll() {
      if (!running) {
        target = window.scrollY;
        current = window.scrollY;
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
