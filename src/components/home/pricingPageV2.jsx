import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PricingSlider from "./PricingSlider";
import pricingData from "./pricingData";
import PricingFooterPage from "./pricingFooterPage";

export default function PricingPageV2() {
    const { t } = useLanguage();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(window.location.pathname.includes("managers"));
    }, []);

    return (
        <div className="bg-gray-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 w-full">
            <div className="container mx-auto py-10 md:py-18">
                <header className="text-center mb-10 p-3">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 dark:from-purple-500 dark:to-sky-500 bg-clip-text text-transparent mb-6">
                        {t("home.PricingPage.title")}
                    </h1>
                    <p className="max-w-3xl mx-auto text-base sm:text-[18px] md:text-xl lg:text-xl text-slate-600 dark:text-slate-400">
                        {t("home.PricingPage.description")}
                    </p>
                </header>

                <main>
                    <PricingSlider stages={pricingData} />
                </main>

                {!isAdmin && <PricingFooterPage />}
            </div>
        </div>
    );
}
