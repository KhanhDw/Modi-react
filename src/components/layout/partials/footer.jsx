import React, { useEffect, useState } from "react";
import FooterView from "@/pages/managers/ConfigPage/FooterView";
import useCurrentLanguage from "@/hook/currentLang";

export default function Footer() {
  const { lang } = useCurrentLanguage();
  const [footerData, setFooterData] = useState({});
  const [services, setServices] = useState({});
  const [privacy, setPrivacy] = useState({});
  const [socials, setSocials] = useState({});
  const [activeLang, setActiveLang] = useState("vi");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

  const fetchFooter = async () => {
    try {
      setLoading(true);

      // Fetch song song tất cả API
      const [logoRes, infoRes, serviceRes, socialRes, privacyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=header`),
        fetch(`${API_BASE_URL}/api/section-items/type/company_info?slug=footer`),
        fetch(`${API_BASE_URL}/api/section-items/type/services?slug=footer`),
        fetch(`${API_BASE_URL}/api/section-items/type/social?slug=footer`),
        fetch(`${API_BASE_URL}/api/section-items/type/privacy?slug=footer`),
      ]);

      const [logoData, companyInfo, serviceData, socialsData, privacyData] = await Promise.all([
        logoRes.json(),
        infoRes.json(),
        serviceRes.json(),
        socialRes.json(),
        privacyRes.json(),
      ]);

      const logoItem = logoData[0] || null;

      // Các ngôn ngữ cần hỗ trợ
      const langs = ["vi", "en"];
      const footerMap = {};
      const serviceMap = {};
      const socialMap = {};
      const privacyMap = {};

      langs.forEach((lng) => {
        footerMap[lng] = {
          logo: logoItem?.image_url ? `${API_BASE_URL}${logoItem.image_url}` : "/logoModi.png",
          name_company: companyInfo.find((f) => f.position === 2)?.description?.[lng] || "",
          content_about_us: companyInfo.find((f) => f.position === 6)?.description?.[lng] || "",
          address_company: companyInfo.find((f) => f.position === 3)?.description?.[lng] || "",
          phone: companyInfo.find((f) => f.position === 4)?.description?.[lng] || "",
          email: companyInfo.find((f) => f.position === 5)?.description?.[lng] || "",
        };

        serviceMap[lng] = serviceData.map((s) => ({
          title: s.title?.[lng],
          slug: s.description?.[lng],
        }));

        socialMap[lng] = socialsData.map((s) => ({
          title: s.title?.[lng],
          url: s.description?.[lng],
        }));

        privacyMap[lng] = privacyData.map((p) => ({
          title: p.title?.[lng],
          link: p.description?.[lng],
        }));
      });

      // Lưu toàn bộ data vào state
      setFooterData(footerMap);
      setServices(serviceMap);
      setSocials(socialMap);
      setPrivacy(privacyMap);
    } catch (err) {
      console.error("❌ Lỗi tải footer:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chỉ 1 lần
  useEffect(() => {
    fetchFooter();
  }, []);

  // Cập nhật lang
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  if (loading) {
    return <p className="text-center py-6">⏳ Đang tải footer...</p>;
  }

  return (
    <FooterView
      data={footerData}
      services={services[activeLang]}
      socials={socials[activeLang]}
      privacy={privacy[activeLang]}
      lang={activeLang}
    />
  );
}
