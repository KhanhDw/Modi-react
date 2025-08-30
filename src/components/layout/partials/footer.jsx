import { useState, useEffect } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaLinkedin, FaFacebookSquare } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from '../../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [activeLang, setActiveLang] = useState("vi");
  const [footerData, setFooterData] = useState({ vi: {}, en: {} });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL || "http://localhost:5000";

  // 🔹 Load dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE_URL}/api/footer/${activeLang}`;
        console.log("Fetching data from:", url);  // Debugging log
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Không thể tải dữ liệu footer.");
        }
        const data = await res.json();
        setFooterData((prev) => ({
          ...prev,
          [activeLang]: {
            logo: data.logo || "/logoModi.png",
            name_company: data.name_company,
            content_about_us: data.content_about_us,
            address_company: data.address_company,
            phone: data.phone,
            email: data.email,
          },
        }));
      } catch (err) {
        console.error("Lỗi load footer config:", err);
        alert("Lỗi tải dữ liệu footer: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeLang]);

  const currentData = footerData[activeLang] || {};

  const services = [
    { title: t("footer.listServices.0"), slug: "online-kickstart" },
    { title: t("footer.listServices.1"), slug: "one-me" },
    { title: t("footer.listServices.2"), slug: "brand-building" },
    { title: t("footer.listServices.3"), slug: "online-store" },
    { title: t("footer.listServices.4"), slug: "service-booking" },
    { title: t("footer.listServices.5"), slug: "comprehensive-management" },
    { title: t("footer.listServices.6"), slug: "website-app" },
    { title: t("footer.listServices.7"), slug: "re-vision" },
    { title: t("footer.listServices.8"), link: null },
    { title: t("footer.listServices.9"), link: null },
    { title: t("footer.listServices.10"), link: null },
    { title: t("footer.listServices.11"), link: null },
  ];

  const privacy_statement = [
    { link: "/about", title: t("footer.privacyStatement.0"), },
    { link: "/terms-of-services", title: t("footer.privacyStatement.1"), },
    { link: "/contact", title: t("footer.privacyStatement.2"), },
    { link: "/careers", title: t("footer.privacyStatement.3"), },
  ];

  return (
    <footer className="md:mb-4 md:p-8 xs:p-4 xs:m-0 text-white bg-gray-900 md:rounded-2xl border-1 dark:border-slate-700 border-slate-300">
      <div className="3xl:max-w-full 3xl:w-full md:max-w-6xl mx-auto 3xl:px-20">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {/* Left Section - Company Info */}
          <div className="space-y-6">
            <div>
              <div className='flex items-center justify-center xs:h-10 3xl:h-20 px-3 py-2 mb-3 overflow-hidden rounded-2xl w-fit'>
                <img src={currentData.logo} className='xs:h-10 3xl:h-20 w-fit' alt='logo' />
              </div>
              <h2 className="mb-6 text-xl font-semibold 3xl:text-3xl">{currentData.name_company}</h2>
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
            </div>
          </div>

          {/* Middle Section - Services */}
          <div>
            <h3 className="mb-6 text-xl font-semibold 3xl:text-3xl">{t("footer.services")}</h3>

            <div className="grid grid-cols-2 gap-x-8">
              <ul className="space-y-3">
                {services.slice(0, Math.ceil(services.length / 2)).map((service, index) => (
                  <li key={index} className="transition-all duration-200 hover:text-green-400">
                    <Link
                      to={service.slug ? `/services/${service.slug}` : "/services"}
                      className="xs:text-sm md:text-md 3xl:text-xl"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                {services.slice(Math.ceil(services.length / 2)).map((service, index) => (
                  <li key={index + 100} className="transition-all duration-200 hover:text-green-400">
                    <Link
                      to={service.slug ? `/services/${service.slug}` : "/services"}
                      className="xs:text-sm md:text-md 3xl:text-xl"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section - About & Links */}
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
                      <Link to={service.link} className="xs:text-sm md:text-md 3xl:text-xl">{service.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Social */}
        <div className="flex flex-col items-center justify-between pt-6 border-t border-gray-700 md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0  3xl:text-xl">© Copyright 2025 All Rights Reserved</p>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 transition-colors rounded cursor-pointer hover:bg-blue-700">
              <FaLinkedin size={30} className="text-white 3xl:text-xl" />
            </div>
            <div className="flex items-center justify-center w-10 h-10 transition-colors rounded cursor-pointer hover:bg-blue-600">
              <FaFacebookSquare size={30} className="text-white 3xl:text-xl" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
