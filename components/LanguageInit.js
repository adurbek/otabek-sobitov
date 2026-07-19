"use client";

import { useEffect } from "react";
import { initLanguage } from "@/lib/i18n";

export default function LanguageInit() {
  useEffect(() => {
    initLanguage();
  }, []);
  return null;
}
