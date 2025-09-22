import { useLanguage } from '../../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import slugify from '../../utils/slug';
import PricingFooterPage from './pricingFooterPage';
import React, { useState, useEffect } from 'react';


// các gói dịch vụ chính của công ty?
const PricingCard = ({ title, price, features, isPopular = false }) => {
    const { t } = useLanguage();
    const popularClasses = 'relative border-2 border-purple-500 dark:border-purple-400 md:scale-105';
    const normalClasses = 'border border-slate-200 dark:border-slate-700';

    const navigate = useNavigate();

    const defineButtonOrderActive = (titleBtn) => {
        navigate(`/contact?service-order=${slugify(titleBtn)}`);
    };


    return (
        <div className={`w-full max-w-sm flex flex-col p-8 bg-white dark:bg-slate-800 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-purple-500/10 hover:border-purple-500 dark:hover:border-purple-400 ${isPopular ? popularClasses : normalClasses}`}>
            {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500">
                    {t("home.PricingPage.tagMostPopular")}
                </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xl font-bold my-4 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-sky-400 bg-clip-text text-transparent">{price}</p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-300 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-3">✔</span> {feature}
                    </li>
                ))}
            </ul>
            <button onClick={() => defineButtonOrderActive(title)} className="mt-8 w-full font-bold py-3 px-6 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300">
                {t("home.PricingPage.buttonOrderNow")}
            </button>
        </div>
    );
}

export default function PricingPageV1() {

    const { t } = useLanguage();

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Lấy đường dẫn hiện tại
        const currentPathname = window.location.pathname;

        // Kiểm tra xem đường dẫn có chứa "managers" không
        if (currentPathname.includes('managers')) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);


    const pricingData = {
        stage1: [
            {
                title: t("home.PricingPage.stage1.0.title"),
                price: t("home.PricingPage.stage1.0.price"),
                features: [
                    t("home.PricingPage.stage1.0.features.0"),
                    t("home.PricingPage.stage1.0.features.1"),
                    t("home.PricingPage.stage1.0.features.2"),
                    t("home.PricingPage.stage1.0.features.3"),
                ],
            },
            {
                title: t("home.PricingPage.stage1.1.title"),
                price: t("home.PricingPage.stage1.1.price"),
                features: [
                    t("home.PricingPage.stage1.1.features.0"),
                    t("home.PricingPage.stage1.1.features.1"),
                    t("home.PricingPage.stage1.1.features.2"),
                    t("home.PricingPage.stage1.1.features.3"),
                ],
            },
        ],
        stage2: [
            {
                title: t("home.PricingPage.stage2.0.title"),
                price: t("home.PricingPage.stage2.0.price"),
                features: [
                    t("home.PricingPage.stage2.0.features.0"),
                    t("home.PricingPage.stage2.0.features.1"),
                    t("home.PricingPage.stage2.0.features.2"),
                    t("home.PricingPage.stage2.0.features.3"),
                ],
            },
            {
                title: t("home.PricingPage.stage2.1.title"),
                price: t("home.PricingPage.stage2.1.price"),
                features: [
                    t("home.PricingPage.stage2.1.features.0"),
                    t("home.PricingPage.stage2.1.features.1"),
                    t("home.PricingPage.stage2.1.features.2"),
                    t("home.PricingPage.stage2.1.features.3"),
                ],
                isPopular: true,
            },
            {
                title: t("home.PricingPage.stage2.2.title"),
                price: t("home.PricingPage.stage2.2.price"),
                features: [
                    t("home.PricingPage.stage2.2.features.0"),
                    t("home.PricingPage.stage2.2.features.1"),
                    t("home.PricingPage.stage2.2.features.2"),
                    t("home.PricingPage.stage2.2.features.3"),
                ],
            },
        ],
        stage3: [
            {
                title: t("home.PricingPage.stage3.0.title"),
                price: t("home.PricingPage.stage3.0.price"),
                features: [
                    t("home.PricingPage.stage3.0.features.0"),
                    t("home.PricingPage.stage3.0.features.1"),
                    t("home.PricingPage.stage3.0.features.2"),
                    t("home.PricingPage.stage3.0.features.3"),
                ],
            },
            {
                title: t("home.PricingPage.stage3.1.title"),
                price: t("home.PricingPage.stage3.1.price"),
                features: [
                    t("home.PricingPage.stage3.1.features.0"),
                    t("home.PricingPage.stage3.1.features.1"),
                    t("home.PricingPage.stage3.1.features.2"),
                    t("home.PricingPage.stage3.1.features.3"),
                ],
            },
            {
                title: t("home.PricingPage.stage3.2.title"),
                price: t("home.PricingPage.stage3.2.price"),
                features: [
                    t("home.PricingPage.stage3.2.features.0"),
                    t("home.PricingPage.stage3.2.features.1"),
                    t("home.PricingPage.stage3.2.features.2"),
                    t("home.PricingPage.stage3.2.features.3"),
                ],
            },
        ],
    };

    const navigate = useNavigate();

    const defineButtonOrderActive = (titleBtn) => {
        navigate(`/contact?service-order=${slugify(titleBtn)}`);
    };

    return (
        <div className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-30 w-full">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <header className="text-center mb-16 md:mb-20">
                    <h1 className="leading-relaxed text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-sky-400 bg-clip-text text-transparent mb-4">
                        {t("home.PricingPage.title")}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        {t("home.PricingPage.description")}
                    </p>
                </header>

                <main className="space-y-16">
                    {/* GIAI ĐOẠN 1 */}
                    <section>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t("home.PricingPage.i_stage1.title")}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{t("home.PricingPage.i_stage1.description")}</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-stretch gap-8">
                            {pricingData.stage1.map(card => (
                                <PricingCard key={card.title} {...card} />
                            ))}
                        </div>
                    </section>

                    <div className="text-center text-4xl text-slate-300 dark:text-slate-600">▼</div>

                    {/* GIAI ĐOẠN 2 */}
                    <section>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t("home.PricingPage.i_stage2.title")}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{t("home.PricingPage.i_stage2.description")}</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-stretch gap-8">
                            {pricingData.stage2.map(card => (
                                <PricingCard key={card.title} {...card} />
                            ))}
                        </div>
                    </section>

                    <div className="text-center text-4xl text-slate-300 dark:text-slate-600">▼</div>

                    {/* GIAI ĐOẠN 3 */}
                    <section>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t("home.PricingPage.i_stage3.title")}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{t("home.PricingPage.i_stage3.description")}</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-stretch gap-8">
                            {pricingData.stage3.map(card => (
                                <PricingCard key={card.title} {...card} />
                            ))}
                        </div>
                    </section>
                </main>

                {!isAdmin &&
                    <PricingFooterPage />
                }
            </div>
        </div>
    );
}