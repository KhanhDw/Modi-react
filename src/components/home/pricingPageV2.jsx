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
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 w-full">
            <div className="container mx-auto py-16 md:py-24 px-4">
                <div className="relative">
                    {/* Decorative background gradient */}

                    <header className="text-center mb-16">
                        <h1 className="mask-linear-to-24 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-snug md:leading-normal font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-sky-400 bg-clip-text text-transparent mb-4">
                            {t("home.PricingPage.title")}
                        </h1>

                        <p className="max-w-4xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400">
                            {t("home.PricingPage.description")}
                        </p>
                    </header>
                </div>

                <main className="space-y-16">
                    <PricingSlider />
                    {!isAdmin && <PricingFooterPage />}
                </main>
            </div>
        </div>
    );
}
