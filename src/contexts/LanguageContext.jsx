import { createContext, useContext, useState, useEffect } from "react";
import vi from "../locales/vi";
import en from "../locales/en";
import { setAppLanguage } from "@/hook/currentLang";


const translations = { vi, en };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("vi");

  useEffect(() => {
    const saved = localStorage.getItem("site-language");
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    localStorage.setItem("site-language", newLang);
    setAppLanguage(newLang);
    // tin tức


  };


  const t = (key) => {
    const keys = key.split(".");
    return keys.reduce((obj, k) => obj?.[k], translations[language]) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};