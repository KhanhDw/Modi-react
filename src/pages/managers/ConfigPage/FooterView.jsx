import { MapPin, Phone, Mail } from "lucide-react";
import {
    FaLinkedin, FaFacebookSquare, FaYoutube,
    FaTiktok, FaInstagram, FaTwitter
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext"
import React from 'react';
import zaloPng from "/icon-zalo.png";
import boCongThuongBanner from '@/assets/images/boCongThuong/bocongthuong.png';


// Map tên mạng xã hội -> icon
const socialIcons = {
    facebook: FaFacebookSquare,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    instagram: FaInstagram,
    twitter: FaTwitter,
    zalo: zaloPng,
};

function normalizeKey(title = "") {
    const lower = title.toLowerCase();
    if (lower.includes("twitter")) return "twitter";
    if (lower.includes("x")) return "twitter";
    if (lower.includes("zalo")) return "zalo";
    return lower;
}

export default function FooterView({ data, services, socials = [], privacy, lang }) {
    const { t } = useLanguage()
    const currentData = data?.[lang] || {};

    const privacy_statement = [
        { link: "/about", title: t("footer.privacyStatement.0") },
        { link: "/terms-of-services", title: t("footer.privacyStatement.1") },
        { link: "/contact", title: t("footer.privacyStatement.2") },
        // { link: "/careers", title: t("footer.privacyStatement.3") },
    ];



    return (
        <footer className="md:mb-4 md:p-8 xs:p-4 xs:m-0 text-white bg-gray-900 admin-dark:bg-gray-800 md:rounded-2xl border-1 dark:border-slate-700 border-slate-300">
            <div className="3xl:max-w-full 3xl:w-full md:max-w-6xl mx-auto 3xl:px-20">
                <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
                    {/* Left Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-center xs:h-10 3xl:h-20 px-3 py-2 mb-3 overflow-hidden rounded-2xl w-fit">
                                <img
                                    src={currentData.logo || "/logoModi.png"}
                                    className="xs:h-10 3xl:h-20 w-fit object-fill"
                                    alt="logo"
                                    onError={(e) => (e.target.src = "/logoModi.png")}
                                />
                            </div>
                            <h2 className="mb-6 text-xl font-semibold 3xl:text-3xl">
                                {currentData.name_company}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="flex-shrink-0 mt-1 text-red-500 xs:text-sm md:text-xl" size={20} />
                                <div className="xs:text-sm md:text-md 3xl:text-xl">
                                    <p>{currentData.address_company}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="flex-shrink-0 text-blue-500" size={20} />
                                <p className="xs:text-sm md:text-md 3xl:text-xl">{currentData.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="flex-shrink-0 text-red-500" size={20} />
                                <p className="xs:text-sm md:text-md 3xl:text-xl">{currentData.email}</p>
                            </div>
                            {currentData.urlBoCongThuong && (
                                <div className="flex items-center gap-3">
                                    <a href={`${currentData.urlBoCongThuong}`} target="_blank" rel="noopener noreferrer ">
                                        <img src={boCongThuongBanner} alt="bộ công thương xác nhận"
                                            className="w-35 h-auto object-contain" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Section */}
                    <div>
                        <h3 className="mb-6 text-xl font-semibold 3xl:text-3xl">Dịch vụ</h3>
                        <div className="grid grid-cols-2 gap-x-8">
                            <ul className="space-y-3">
                                {services.slice(0, Math.ceil(services.length / 2)).map((service, idx) => (
                                    <li key={idx} className="transition-all duration-200 hover:text-green-400">
                                        <Link to={service.slug ? `/services/${service.slug}` : "/services"}>
                                            {service.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-3">
                                {services.slice(Math.ceil(services.length / 2)).map((service, idx) => (
                                    <li key={idx + 100} className="transition-all duration-200 hover:text-green-400">
                                        <Link to={service.slug ? `/services/${service.slug}` : "/services"}>
                                            {service.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="mb-4 text-xl font-semibold 3xl:text-3xl">{t("footer.aboutUs")}</h3>
                            <p className="text-sm leading-relaxed text-justify text-gray-300 3xl:text-xl">
                                {currentData.content_about_us}
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 text-xl font-semibold 3xl:text-3xl">{t("footer.privacy")}</h3>

                            <div className="grid grid-cols-2 gap-x-8">
                                <ul className="space-y-3">
                                    {privacy_statement.slice(0, Math.ceil(privacy_statement.length / 2)).map((service, index) => (
                                        <li key={index} className="transition-all duration-200 hover:text-green-400 3xl:text-xl">
                                            <Link to={service.link}>{service.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="space-y-3">
                                    {privacy_statement.slice(Math.ceil(privacy_statement.length / 2)).map((service, index) => (
                                        <li key={index + 100} className="transition-all duration-200 hover:text-green-400">
                                            <Link to={service.link} className="xs:text-sm md:text-md 3xl:text-xl">
                                                {service.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between pt-6 border-t border-gray-700 md:flex-row">
                    <p className="mb-4 text-sm text-gray-400 md:mb-0 3xl:text-xl">
                        © {new Date().getFullYear()} - Bản quyền thuộc về {currentData.name_company || "???"}
                    </p>
                    <div className="flex gap-3">
                        {socials
                            .filter((soc) => soc.url && soc.url.trim() !== "")
                            .map((soc, idx) => {
                                const key = normalizeKey(soc.title);  // chuẩn hoá tên -> key icon
                                const Icon = socialIcons[key] || FaFacebookSquare;
                                return (
                                    <a
                                        key={idx}
                                        href={soc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={soc.title}
                                        title={soc.title}
                                    >
                                        {key === "zalo" ? (
                                            <img
                                                src={Icon} // Icon = zaloPng
                                                alt="Zalo"
                                                className="w-7 h-7 object-contain hover:opacity-80 transition"
                                            />
                                        ) : (
                                            <Icon size={30} className="text-white hover:text-green-400 transition" />
                                        )}
                                    </a>
                                );
                            })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
