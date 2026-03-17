"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import translations, { Lang } from "./translations";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations["zh"];
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "zh",
  setLang: () => {},
  t: translations.zh,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        border: "1.5px solid #e2e8f0",
        borderRadius: "0.625rem",
        padding: "0.4rem 0.75rem",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#65a876",
        cursor: "pointer",
        letterSpacing: "0.03em",
      }}
    >
      {lang === "zh" ? "EN" : "中文"}
    </button>
  );
}
