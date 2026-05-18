"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/i18n/en.json";
import nl from "@/i18n/nl.json";
import es from "@/i18n/es.json";
import fr from "@/i18n/fr.json";
import it from "@/i18n/it.json";
import de from "@/i18n/de.json";

const translations: Record<string, typeof en> = { en, nl, es, fr, it, de };

export const languages = [
  { code: "en", label: "🇬🇧 English", short: "EN" },
  { code: "nl", label: "🇳🇱 Nederlands", short: "NL" },
  { code: "es", label: "🇪🇸 Español", short: "ES" },
  { code: "fr", label: "🇫🇷 Français", short: "FR" },
  { code: "it", label: "🇮🇹 Italiano", short: "IT" },
  { code: "de", label: "🇩🇪 Deutsch", short: "DE" },
];

type TranslationKey = string;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // fallback to key
    }
  }
  return typeof current === "string" ? current : path;
}

interface I18nContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "nl",
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("bl-lang");
    if (saved && translations[saved]) {
      setLangState(saved);
    }
  }, []);

  function setLang(newLang: string) {
    if (translations[newLang]) {
      setLangState(newLang);
      localStorage.setItem("bl-lang", newLang);
    }
  }

  function t(key: string): string {
    const dict = translations[lang] || translations.en;
    const value = getNestedValue(dict as Record<string, unknown>, key);
    if (value !== key) return value;
    // Fallback to English
    if (lang !== "en") {
      return getNestedValue(translations.en as Record<string, unknown>, key);
    }
    return key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export { I18nContext };