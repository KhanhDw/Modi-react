import { useEffect, useState } from "react";

const LANGUAGE_KEY = "site-language";
const LANG_EVENT = "app:language-changed";

export function setAppLanguage(lang) {
    localStorage.setItem(LANGUAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang } }));
}

function getLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) || "vi";
}

function getPrefix() {
    return getLanguage() === "en" ? "/en" : "";
}

export default function useCurrentLanguage() {
    const [lang, setLang] = useState(getLanguage);
    const [prefix, setPrefix] = useState(getPrefix);

    useEffect(() => {
        const sync = () => {
            setLang(getLanguage());
            setPrefix(getPrefix());
        };

        window.addEventListener(LANG_EVENT, sync);
        window.addEventListener("storage", sync);

        return () => {
            window.removeEventListener(LANG_EVENT, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    return { lang, prefix };
}
