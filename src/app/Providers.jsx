// app/Providers.jsx
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LenisProvider from "@/contexts/LenisContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LenisProvider>{children}</LenisProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
