import { useEffect, useRef, useState } from "react";
import BannerConfig from "./components/BannerConfig";
import AboutSectionConfig from "./components/AboutSectionConfig";
import VisionMissionConfig from "./components/VisionMissionConfig";
import VideoManager from "./aboutConfig/VideoManager";

// Default data structures
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

// Tab definitions
const TABS = [
  { key: "banner", label: "Banner" },
  { key: "about", label: "Giới thiệu" },
  { key: "visionMission", label: "Tầm nhìn & Sứ mệnh" },
  { key: "video", label: "Video" },
];

export default function AboutConfig() {
  const aboutRef = useRef();
  const [lang, setLang] = useState("vi");
  const [activeTab, setActiveTab] = useState(TABS[0].key); // Default to first tab
  const [config, setConfig] = useState({
    banner: DEFAULT_BANNER,
    about: DEFAULT_ABOUT,
    visionMission: DEFAULT_VISION_MISSION,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const initialConfig = {
          banner: DEFAULT_BANNER,
          about: DEFAULT_ABOUT,
          visionMission: [],
        };

        const newConfig = data.reduce((acc, item) => {
          switch (item.section_id) {
            case 1:
              acc.banner = {
                id: item.id,
                title: item.title || { vi: "", en: "" },
                slogan: item.description || { vi: "", en: "" },
              };
              break;
            case 2:
              acc.about = {
                id: item.id,
                title: item.title || { vi: "", en: "" },
                description: item.description || { vi: "", en: "" },
                image_url: item.image_url || "",
              };
              break;
            case 3:
              acc.visionMission.push({
                id: item.id,
                title: item.title || { vi: "", en: "" },
                description: item.description || { vi: "", en: "" },
                img: item.image_url || "",
                position: item.position || 0,
              });
              break;
            default:
              break;
          }
          return acc;
        }, initialConfig);

        if (newConfig.visionMission.length === 0) {
          newConfig.visionMission = DEFAULT_VISION_MISSION;
        } else {
          // Sort by position
          newConfig.visionMission.sort((a, b) => a.position - b.position);
        }

        setConfig(newConfig);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Có lỗi khi tải cấu hình!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (section, updated) => {
    setConfig((prev) => ({ ...prev, [section]: updated }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updateItem = (id, body) =>
      fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    try {
      const updates = [];

      if (config.banner?.id) {
        updates.push(
          updateItem(config.banner.id, {
            title: config.banner.title,
            description: config.banner.slogan,
            image_url: config.banner.image_url || "",
            position: 0,
          })
        );
      }

      if (config.about?.id) {
        updates.push(
          updateItem(config.about.id, {
            title: config.about.title,
            description: config.about.description,
            image_url:
              typeof config.about.image_url === "string"
                ? config.about.image_url
                : null,
            position: 0,
          })
        );
      }

      config.visionMission.forEach((vm, i) => {
        if (vm.id) {
          updates.push(
            updateItem(vm.id, {
              title: vm.title,
              description: vm.description,
              image_url: typeof vm.img === "string" ? vm.img : null,
              position: vm.position ?? i,
            })
          );
        }
      });

      await Promise.all(updates);

      if (aboutRef.current?.uploadImage) {
        await aboutRef.current.uploadImage();
      }

      alert("Đã lưu cấu hình thành công!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Có lỗi khi lưu cấu hình!");
    } finally {
      setIsSaving(false);
    }
  };

  const renderActiveTab = () => {
    if (isLoading) return <div className="text-center p-8">Loading...</div>;

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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="w-full sm:w-auto py-2 px-4 bg-gray-200 admin-dark:bg-gray-700 admin-dark:border admin-dark:border-gray-500 text-black admin-dark:text-white rounded-lg shadow-sm hover:bg-gray-300 admin-dark:hover:bg-gray-600 transition cursor-pointer text-sm font-semibold"
          >
            {lang === "vi" ? "Ngôn ngữ: Tiếng Việt" : "Language: English"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition text-sm font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Đang lưu..." : "Lưu Cấu hình"}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 admin-dark:border-gray-700">
          <nav
            className="-mb-px flex space-x-4 overflow-x-auto"
            aria-label="Tabs"
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4">{renderActiveTab()}</div>
      </div>
    </div>
  );
}
