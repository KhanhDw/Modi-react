import { useEffect, useState } from "react";

export default function ContactConfig() {
  const [companyName, setCompanyName] = useState("");
  const [mapUrl, setMapUrl] = useState(""); // URL đang nhập
  const [savedMapUrl, setSavedMapUrl] = useState(""); // URL sau khi lưu
  const [companyInfo, setCompanyInfo] = useState([]);
  const [activeLang, setActiveLang] = useState("vi");

  const [mapURLFetch, setMapUrlFetch] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

  const fetchNameCompanyFooter = async () => {
    try {
      const infoRes = await fetch(
        `${API_BASE_URL}/api/section-items/type/company_info?slug=footer`
      );
      const data = await infoRes.json();
      setCompanyInfo(data);

      // Tìm title tên công ty
      const nameItem = data.find((item) => item?.title?.vi === "Tên công ty");

      if (nameItem) {
        // Lấy tên theo ngôn ngữ activeLang, fallback về vi
        setCompanyName(
          nameItem.description?.[activeLang] || nameItem.description?.vi || ""
        );
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu công ty", err);
    }
  };
  const fetchUrlGoogleMapContact = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/section-items/type/urlgooglemap?slug=contact`
      );
      const data = await res.json();
      setMapUrlFetch(data);
      setMapUrl(data[0]?.title?.en || "");
    } catch (err) {
      console.error("Lỗi tải dữ liệu", err);
    }
  };

  // Khi activeLang thay đổi, cập nhật lại companyName nếu có data
  useEffect(() => {
    if (companyInfo.length > 0) {
      const nameItem = companyInfo.find(
        (item) => item?.title?.vi === "Tên công ty"
      );
      if (nameItem) {
        setCompanyName(
          nameItem.description?.[activeLang] || nameItem.description?.vi || ""
        );
      }
    }
  }, [activeLang, companyInfo]);

  useEffect(() => {
    fetchNameCompanyFooter();
    fetchUrlGoogleMapContact();
  }, [activeLang]);

  const handleSaveName = async () => {
    const nameItem = companyInfo.find(
      (item) => item?.title?.vi === "Tên công ty"
    );

    // Cập nhật tên công ty
    nameItem.description[activeLang] = companyName;

    const response = await fetch(
      `${API_BASE_URL}/api/section-items/${nameItem.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameItem),
      }
    );

    if (response.ok) {
      alert("Đã lưu tên công ty thành công");
      fetchNameCompanyFooter(activeLang);
    } else {
      alert("Lưu thất bại");
    }
  };

  const extractSrcFromIframe = (iframeString) => {
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : iframeString; // nếu không match thì trả về nguyên string
  };

  const handleSaveUrlMap = async () => {
    // Lấy đúng src từ iframe
    const extractedUrl = extractSrcFromIframe(mapUrl);

    setSavedMapUrl(extractedUrl);
    console.log("Saved Map URL:", extractedUrl);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/contact-config/${mapURLFetch[0].id}/update-url-map`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vi: extractedUrl,
            en: extractedUrl,
          }),
        }
      );

      if (response.ok) {
        fetchUrlGoogleMapContact();
      } else {
        console.error("Lưu thất bại:", response.status);
      }
    } catch (err) {
      console.error("Lỗi lưu URL", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 md:p-3 lg:p-2 items-start min-h-screen">
      {/* Left: thông tin và lưu địa chỉ map */}
      <div className="lg:col-span-2 col-span-1 space-y-4">
        <div className="p-3 border border-gray-300 admin-dark:border-gray-700 rounded-2xl space-y-4 admin-dark:bg-gray-800">
          {/* Tên công ty */}
          <div className="w-full">
            <label className="w-full admin-dark:text-white text-gray-900">
              <div className="flex items-center justify-end space-x-3 pb-2">
                <span className="text-xs sm:text-sm md:text-base font-medium admin-dark:text-white text-gray-900">
                  {activeLang === "vi" ? "Tiếng Việt" : "English"}
                </span>

                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 cursor-pointer">
                  <input
                    autoComplete="off"
                    type="checkbox"
                    id="language-switch"
                    className="peer sr-only "
                    checked={activeLang === "en"}
                    onChange={(e) =>
                      setActiveLang(e.target.checked ? "en" : "vi")
                    }
                  />
                  <label
                    htmlFor="language-switch"
                    className="block h-6 bg-gray-400 rounded-full peer-checked:bg-blue-600 transition duration-300 ease-in-out cursor-pointer"
                  ></label>
                  <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out peer-checked:translate-x-6 cursor-pointer"></span>
                </div>
              </div>
            </label>
            <div className="text-start mb-3">
              <p className="text-xs sm:text-sm md:text-base font-medium">
                Thiết lập Tên công ty{" "}
                {activeLang === "vi" ? "(Tiếng Việt)" : "(Tiếng Anh)"}
              </p>
            </div>

            <input
              autoComplete="off"
              type="text"
              placeholder={
                activeLang === "vi"
                  ? "Nhập tên công ty..."
                  : "Enter company name..."
              }
              className="admin-dark:bg-gray-700 w-full border border-slate-300 admin-dark:border-slate-700 rounded-sm px-2 py-2 focus:outline-none"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Nút lưu */}
          <div className="flex justify-end">
            <button
              className="inline-flex shadow-md items-center justify-center rounded bg-blue-600 px-2 py-2.5 text-sm font-medium text-white transition active:scale-110 hover:bg-blue-700 cursor-pointer"
              onClick={handleSaveName}
            >
              <span className="text-xs sm:text-sm font-medium">
                Lưu tên công ty
              </span>
            </button>
          </div>
        </div>

        {/* URL Google Map */}
        <div className="p-3 border border-gray-300 admin-dark:border-gray-700 rounded-2xl space-y-4 admin-dark:bg-gray-800">
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-medium mb-3 admin-dark:text-white text-gray-900">
              Thiết lập địa chỉ Google Map
            </label>
            <textarea
              placeholder={
                activeLang === "vi"
                  ? "Nhập URL Google Maps vào đây..."
                  : "Enter Google Maps URL..."
              }
              className="admin-dark:bg-gray-700 w-full border border-slate-300 admin-dark:border-slate-700 rounded-sm px-2 py-2 focus:outline-none"
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              rows={8}
            />
          </div>

          {/* Nút lưu */}
          <div className="flex justify-between items-center">
            <button
              className="inline-flex px-2 py-2.5  items-center justify-center rounded  text-sm font-medium  transition active:scale-110 cursor-pointer"
              onClick={() =>
                window.open(
                  "/HƯỚNG DẪN LẤY LINK GOOGLE MAP ĐỂ HIỂN THỊ TRONG WEBSITE.pdf",
                  "_blank"
                )
              }
            >
              <span className="text-xs sm:text-sm font-medium hover:text-blue-700">
                Hướng dẫn thêm Google Map
              </span>
            </button>

            <button
              className="inline-flex px-2 py-2.5 shadow-md items-center justify-center rounded bg-blue-600 text-sm font-medium text-white transition active:scale-110 hover:bg-blue-700 cursor-pointer"
              onClick={handleSaveUrlMap}
            >
              <span className="text-xs sm:text-sm font-medium">
                Lưu địa chỉ Google Map
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Preview bản đồ */}
      <div className="lg:col-span-3 shadow-sm h-[700px] border border-slate-300 rounded-md overflow-hidden admin-dark:border-slate-700">
        {mapURLFetch[0]?.title?.en !== "" ? (
          <iframe
            src={mapURLFetch[0]?.title?.en}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <div className="p-3 w-full h-full shadow-sm flex items-center justify-center text-gray-400 italic">
            {activeLang === "vi"
              ? 'Nhập URL bản đồ Google và bấm "Lưu địa chỉ" để xem trước tại đây'
              : 'Enter Google Map URL and click "Save" to preview here'}
          </div>
        )}
      </div>
    </div>
  );
}
