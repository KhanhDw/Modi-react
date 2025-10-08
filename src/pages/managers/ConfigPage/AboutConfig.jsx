import { useEffect, useRef, useState } from "react";
import BannerConfig from "./components/BannerConfig";
import AboutSectionConfig from "./components/AboutSectionConfig";
import VisionMissionConfig from "./components/VisionMissionConfig";
import VideoManager from "./aboutConfig/VideoManager"; // Corrected import path

export default function AboutConfig() {
  const aboutRef = useRef();
  const [lang, setLang] = useState("vi");
  const [activeTab, setActiveTab] = useState("banner");

  const DEFAULT_BANNER = {
    title: { vi: "", en: "" },
    slogan: { vi: "", en: "" },
  };
  const DEFAULT_ABOUT = {
    title: { vi: "", en: "" },
    description: { vi: "", en: "" },
    image_url: "",
  };
  const DEFAULT_VISION_MISSION = [
    { title: { vi: "", en: "" }, description: { vi: "", en: "" }, img: "" },
  ];

  const [config, setConfig] = useState({
    banner: DEFAULT_BANNER,
    about: DEFAULT_ABOUT,
    visionMission: DEFAULT_VISION_MISSION,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items`)
      .then((res) => res.json())
      .then((data) => {
        const banner = data.find((item) => item.section_id === 1) || {};
        const about = data.find((item) => item.section_id === 2) || {};
        const visionMission =
          data.filter((item) => item.section_id === 3) || [];

        setConfig({
          banner: {
            id: banner.id,
            title: banner.title || { vi: "", en: "" },
            slogan: banner.description || { vi: "", en: "" },
          },
          about: {
            id: about.id,
            title: about.title || { vi: "", en: "" },
            description: about.description || { vi: "", en: "" },
            image_url: about.image_url || "",
          },
          visionMission: visionMission.map((vm) => ({
            id: vm.id,
            title: vm.title || { vi: "", en: "" },
            description: vm.description || { vi: "", en: "" },
            img: vm.image_url || "",
            position: vm.position || 0,
          })),
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleChange = (section, updated) => {
    setConfig((prev) => ({ ...prev, [section]: updated }));
  };

  const handleSave = async () => {
    try {
      if (config.banner?.id) {
        await fetch(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${
            config.banner.id
          }`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: config.banner.title,
              description: config.banner.slogan,
              image_url: config.banner.image_url || "",
              position: 0,
            }),
          }
        );
      }

      if (config.about?.id) {
        await fetch(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${
            config.about.id
          }`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: config.about.title,
              description: config.about.description,
              image_url:
                typeof config.about.image_url === "string"
                  ? config.about.image_url
                  : null,
              position: 0,
            }),
          }
        );
      }

      for (let i = 0; i < config.visionMission.length; i++) {
        const vm = config.visionMission[i];
        if (vm.id) {
          await fetch(
            `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${vm.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: vm.title,
                description: vm.description,
                image_url: typeof vm.img === "string" ? vm.img : null,
                position: vm.position ?? i,
              }),
            }
          );
        }
      }

      await aboutRef.current?.uploadImage();

      alert("Đã lưu cấu hình thành công!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Có lỗi khi lưu cấu hình!");
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "banner":
        return (
          <BannerConfig
            data={config.banner}
            onChange={(updated) => handleChange("banner", updated)}
            lang={lang}
          />
        );
      case "about":
        return (
          <AboutSectionConfig
            ref={aboutRef}
            data={config.about}
            onChange={(updated) => handleChange("about", updated)}
            lang={lang}
          />
        );
      case "visionMission":
        return (
          <VisionMissionConfig
            data={config.visionMission}
            onChange={(updated) => handleChange("visionMission", updated)}
            lang={lang}
          />
        );
      case "video":
        return <VideoManager />;
      default:
        return null;
    }
  };

  return (
    <div className="items-start mt-5">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-gray-100 admin-dark:bg-gray-800 shadow gap-4 flex mx-auto flex-col sm:flex-col xl:flex-row justify-center md:gap-4 border-gray-800 px-2 py-3 w-full md:w-full sm:w-fit xl:w-fit">
            <button
              onClick={() => setLang(lang === "vi" ? "en" : "vi")}
              className="w-full sm:w-auto py-1 sm:py-2 sm:px-2 bg-gray-200 admin-dark:bg-gray-800 admin-dark:border admin-dark:border-gray-400 text-white rounded-lg sm:rounded-xl shadow hover:bg-gray-300  admin-dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <span className="text-black admin-dark:text-white  text-xs sm:text-sm px-4 text-center font-semibold">
                {lang === "vi"
                  ? "Đang thiết lập nội dung cho tiếng Việt"
                  : "Đang thiết lập nội dung cho tiếng Anh"}
              </span>
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto py-1 sm:py-2 px-2 sm:px-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl shadow hover:bg-indigo-700 transition text-xs sm:text-sm cursor-pointer"
            >
              <span className="font-semibold text-sm sm:text-base">
                Lưu Cấu hình
              </span>
            </button>
          </div>
        </div>

        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setActiveTab("banner")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "banner"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Banner
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "about"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Giới thiệu
          </button>
          <button
            onClick={() => setActiveTab("visionMission")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "visionMission"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tầm nhìn & Sứ mệnh
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "video"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Video
          </button>
        </div>

        <div className="mt-4">{renderActiveTab()}</div>
      </div>
    </div>
  );
}
