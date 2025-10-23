import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";
import { Link } from "react-router-dom";

function PricingFooterPage() {
  const { t } = useLanguage();
  return (
    <>
      <footer className="text-center mt-20 md:mt-24 p-10 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("home.PricingPage.footer.title")}
        </h3>
        <p className="mt-2 mb-6 text-slate-600 dark:text-slate-400">
          {t("home.PricingPage.footer.description")}
        </p>

        <Link
          to="/contact"
          className="font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/40 transition-all duration-300"
        >
          {t("home.PricingPage.footer.button")}
        </Link>
      </footer>
    </>
  );
}

export default PricingFooterPage;
