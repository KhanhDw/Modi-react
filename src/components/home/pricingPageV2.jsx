import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import slugify from '../../utils/slug';

const PricingTable = ({ stage, packages }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const defineButtonOrderActive = (titleBtn) => {
        navigate(`/contact?service-order=${slugify(titleBtn)}`);
    };

    return (
        <section className="mb-20" role="region" aria-label={`Pricing stage ${stage}`}>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{t(`home.PricingPage.${stage}.title`)}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-3xl mx-auto">{t(`home.PricingPage.${stage}.description`)}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                    <thead>
                        <tr>
                            <th className="p-6"></th>
                            {packages.map((pkg, index) => (
                                <th
                                    key={index}
                                    className={`p-6 text-center ${pkg.isPopular
                                        ? 'bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                                        : ''
                                        }`}
                                >
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pkg.title}</h3>
                                    <p className="text-xl font-semibold mt-2 text-purple-700 dark:text-purple-300">{pkg.price}</p>
                                    {pkg.isPopular && (
                                        <span className="inline-block mt-3 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-700 to-blue-600 rounded-full">
                                            {t('home.PricingPage.tagMostPopular')}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {packages[0].features.map((_, index) => (
                            <tr
                                key={index}
                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                            >
                                <td className="p-6 text-lg font-medium text-slate-700 dark:text-slate-200">{packages[0].features[index]}</td>
                                {packages.map((pkg, pkgIndex) => (
                                    <td key={pkgIndex} className="p-6 text-center">
                                        <span className="text-green-600 text-xl">✔</span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="p-6"></td>
                            {packages.map((pkg, index) => (
                                <td key={index} className="p-6 text-center">
                                    <button
                                        onClick={() => defineButtonOrderActive(pkg.title)}
                                        className="font-semibold py-3 px-8 text-lg rounded-lg text-white bg-gradient-to-r from-purple-700 to-blue-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                                        aria-label={`Order ${pkg.title} plan`}
                                    >
                                        {t('home.PricingPage.buttonOrderNow')}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default function PricingPageV2() {
    const { t } = useLanguage();

    const pricingData = {
        stage1: [
            {
                title: t("home.PricingPage.stage1.0.title") || "Basic",
                price: t("home.PricingPage.stage1.0.price") || "$10/month",
                features: [
                    t("home.PricingPage.stage1.0.features.0") || "Feature 1",
                    t("home.PricingPage.stage1.0.features.1") || "Feature 2",
                    t("home.PricingPage.stage1.0.features.2") || "Feature 3",
                    t("home.PricingPage.stage1.0.features.3") || "Feature 4",
                ],
            },
            {
                title: t("home.PricingPage.stage1.1.title") || "Pro",
                price: t("home.PricingPage.stage1.1.price") || "$20/month",
                features: [
                    t("home.PricingPage.stage1.1.features.0") || "Feature 1",
                    t("home.PricingPage.stage1.1.features.1") || "Feature 2",
                    t("home.PricingPage.stage1.1.features.2") || "Feature 3",
                    t("home.PricingPage.stage1.1.features.3") || "Feature 4",
                ],
            },
        ],
        stage2: [
            {
                title: t("home.PricingPage.stage2.0.title") || "Advanced",
                price: t("home.PricingPage.stage2.0.price") || "$30/month",
                features: [
                    t("home.PricingPage.stage2.0.features.0") || "Feature 1",
                    t("home.PricingPage.stage2.0.features.1") || "Feature 2",
                    t("home.PricingPage.stage2.0.features.2") || "Feature 3",
                    t("home.PricingPage.stage2.0.features.3") || "Feature 4",
                ],
            },
            {
                title: t("home.PricingPage.stage2.1.title") || "Premium",
                price: t("home.PricingPage.stage2.1.price") || "$40/month",
                features: [
                    t("home.PricingPage.stage2.1.features.0") || "Feature 1",
                    t("home.PricingPage.stage2.1.features.1") || "Feature 2",
                    t("home.PricingPage.stage2.1.features.2") || "Feature 3",
                    t("home.PricingPage.stage2.1.features.3") || "Feature 4",
                ],
                isPopular: true,
            },
            {
                title: t("home.PricingPage.stage2.2.title") || "Enterprise",
                price: t("home.PricingPage.stage2.2.price") || "$50/month",
                features: [
                    t("home.PricingPage.stage2.2.features.0") || "Feature 1",
                    t("home.PricingPage.stage2.2.features.1") || "Feature 2",
                    t("home.PricingPage.stage2.2.features.2") || "Feature 3",
                    t("home.PricingPage.stage2.2.features.3") || "Feature 4",
                ],
            },
        ],
        stage3: [
            {
                title: t("home.PricingPage.stage3.0.title") || "Standard",
                price: t("home.PricingPage.stage3.0.price") || "$60/month",
                features: [
                    t("home.PricingPage.stage3.0.features.0") || "Feature 1",
                    t("home.PricingPage.stage3.0.features.1") || "Feature 2",
                    t("home.PricingPage.stage3.0.features.2") || "Feature 3",
                    t("home.PricingPage.stage3.0.features.3") || "Feature 4",
                ],
            },
            {
                title: t("home.PricingPage.stage3.1.title") || "Business",
                price: t("home.PricingPage.stage3.1.price") || "$70/month",
                features: [
                    t("home.PricingPage.stage3.1.features.0") || "Feature 1",
                    t("home.PricingPage.stage3.1.features.1") || "Feature 2",
                    t("home.PricingPage.stage3.1.features.2") || "Feature 3",
                    t("home.PricingPage.stage3.1.features.3") || "Feature 4",
                ],
            },
            {
                title: t("home.PricingPage.stage3.2.title") || "Corporate",
                price: t("home.PricingPage.stage3.2.price") || "$80/month",
                features: [
                    t("home.PricingPage.stage3.2.features.0") || "Feature 1",
                    t("home.PricingPage.stage3.2.features.1") || "Feature 2",
                    t("home.PricingPage.stage3.2.features.2") || "Feature 3",
                    t("home.PricingPage.stage3.2.features.3") || "Feature 4",
                ],
            },
        ],
    };

    return (
        <div className="  bg-gray-100 dark:bg-slate-900  text-slate-700 dark:text-slate-300 w-full">
            <div className="container mx-auto px-6 py-20 md:py-28">
                <header className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 dark:from-purple-500 dark:to-sky-500 bg-clip-text text-transparent mb-6">
                        {t('home.PricingPage.title') || 'Our Pricing Plans'}
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-400">
                        {t('home.PricingPage.description') || 'Choose the plan that best fits your needs.'}
                    </p>
                </header>
                <main>
                    <PricingTable stage="i_stage1" packages={pricingData.stage1} />
                    <PricingTable stage="i_stage2" packages={pricingData.stage2} />
                    <PricingTable stage="i_stage3" packages={pricingData.stage3} />
                </main>
                <footer className="text-center mt-20 p-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t('home.PricingPage.footer.title') || 'Need a Custom Solution?'}
                    </h3>
                    <p className="mt-3 mb-6 text-lg text-slate-600 dark:text-slate-400">
                        {t('home.PricingPage.footer.description') || 'Contact us for tailored pricing plans.'}
                    </p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="font-semibold py-3 px-10 text-lg rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
                        aria-label="Contact us for custom pricing"
                    >
                        {t('home.PricingPage.footer.button') || 'Get in Touch'}
                    </button>
                </footer>
            </div>
        </div>
    );
}