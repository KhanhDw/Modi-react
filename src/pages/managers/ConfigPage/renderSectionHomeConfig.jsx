import NotificationToast from "@/components/feature/notification-toast.jsx";
import PricingPage from "@/components/home/typePricingSlider/PricingSlider.jsx";
import VitriTable from "@/pages/managers/ConfigPage/homeConfig/PositionConfig.jsx";
import ChitietdichvuSection from "@/pages/managers/ConfigPage/renderSections/chitietdichvuSection.jsx";
import { motion } from "framer-motion";
import { Eye, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { InputField, SafeImage, TextareaField } from "./componentHomeConfig";
import { Slider } from "@/components/ui/slider";
export default function RenderHomeConfig({
  activeSection,
  currentData,
  activeLang,
  handleChange,
  handleFileChange,
  handleSave,
  previewBanner,
}) {
  // ========== vị trí ====================
  const [vitri, setVitri] = useState([]);
  const [defaultVitri, setDefaultVitri] = useState([]); // giữ mặc định
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positionsDefault, setPositionsDefault] = useState([]);
  const [toast, setToast] = useState(null);

  const FetchResetPositions = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/service-header-config/positions/default`
      );

      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Reset positions thất bại");
      }
      setPositionsDefault(data.data);
    } catch (err) {
      console.error("❌ Fetch reset positions error:", err);
    }
  };

  const FetchPositionComponentHome = async () => {
    const sectionsUrl = `${
      import.meta.env.VITE_MAIN_BE_URL
    }/api/sections?slug=home`;
    const statusPositionUrl = `${
      import.meta.env.VITE_MAIN_BE_URL
    }/api/status-position-home-page`;

    try {
      const [resSections, resStatusPosition] = await Promise.all([
        fetch(sectionsUrl),
        fetch(statusPositionUrl),
      ]);

      if (!resSections.ok) {
        throw new Error(`Lỗi HTTP: ${resSections.status}`);
      }
      if (!resStatusPosition.ok) {
        throw new Error(`Lỗi HTTP: ${resStatusPosition.status}`);
      }
      const data = await resSections.json();
      const statusPosition = await resStatusPosition.json();
      // Kiểm tra dữ liệu hợp lệ
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Dữ liệu không đúng định dạng hoặc rỗng");
      }
      const clonedData = JSON.parse(JSON.stringify(data.data));
      const clonedDataSatusPosition = JSON.parse(
        JSON.stringify(statusPosition.data)
      );

      const dataComplete = clonedData.map((section) => {
        const toggle = clonedDataSatusPosition.find(
          (t) => t.sections_type === section.type
        );
        return {
          ...section,
          status: toggle ? toggle.status : null, // nếu không có thì để null
        };
      });
      setVitri(dataComplete);
      setDefaultVitri(dataComplete);
    } catch (err) {
      console.error("Fetch vitri error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizeVitri = (arr) => arr.map(({ status, ...rest }) => rest);

  const isVitriSameAsDefault = (vitri) => {
    if (!vitri || vitri.length !== positionsDefault.length) return false;

    return positionsDefault.every((item) => {
      const dbItem = vitri.find((v) => v.type === item.key);
      return dbItem && dbItem.position === item.position;
    });
  };

  useEffect(() => {
    FetchResetPositions();
    FetchPositionComponentHome();
  }, []);

  const handleResetDefault = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/service-header-config/positions/reset`,
        {
          method: "POST",
        }
      );
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      await FetchPositionComponentHome();
      setToast({ message: "Khôi phục vị trí thành công", type: "success" });
    } catch (err) {
      console.error("Fetch vitri error:", err);
      setError(err.message);
      setToast({ message: "Khôi phục vị trí thất bại", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // FIX: Callback để nhận dữ liệu từ VitriTable
  const handleVitriChange = (newVitri) => {
    setVitri(newVitri);
  };

  const savePositions = async (vitriUpdate) => {
    try {
      // chỉ gửi key cần thiết
      const positions = vitriUpdate.map((s) => ({
        key: s.type,
        position: s.position,
      }));

      const res = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/service-header-config/positions/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ positions }),
        }
      );

      if (!res.ok) throw new Error("Lỗi khi gọi API");

      const data = await res.json();
      setToast({ message: "Lưu vị trí thành công", type: "success" });
      await FetchPositionComponentHome();
      isVitriSameAsDefault(defaultVitri);
    } catch (error) {
      console.error("❌ Lỗi khi lưu vị trí:", error);
      setToast({ message: "Lưu vị trí thất bại", type: "error" });
    }
  };
  // ========== kết thúc vị trí ====================

  ///////////////////////////////////////////////

  // ========== chi tiết dịch vụ ===================

  const [isViewTable, setIsViewTable] = useState(false);

  // ========== kết thúc chi tiết dịch vụ ===================

  ///////////////////////////////////////////////

  // ========== dịch vụ =============
  const [initialQuantity, setInitialQuantity] = useState([6]); // giá trị BE trả về
  const [currentQuantity, setCurrentQuantity] = useState([6]);
  const [displayQuantity, setDisplayQuantity] = useState([3]); // số lượng thực sự render

  async function fetchData() {
    const res = await fetch(
      `${import.meta.env.VITE_MAIN_BE_URL}/api/service-home-page-ui`
    );
    const data = await res.json();
    setInitialQuantity([data.data.quantity]);
    setCurrentQuantity([data.data.quantity]);
  }
  useEffect(() => {
    fetchData();
  }, []);

  // debounce khi thay đổi số lượng
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDisplayQuantity(currentQuantity);
      setLoading(false);
    }, 500); // chờ 500ms mới hiển thị

    return () => clearTimeout(timer);
  }, [currentQuantity]);

  const isChanged = currentQuantity[0] !== initialQuantity[0];

  const handleSubmitChangeQuantity = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/service-home-page-ui`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: currentQuantity[0] }),
        }
      );
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Cập nhật số lượng thất bại");
      }
      fetchData();
      setToast({ message: "Cập nhật số lượng thành công", type: "success" });
    } catch (err) {
      console.log(err);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      // ========================= vị trí =========================
      case "vitri":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="font-bold text-base md:text-xl mb-4 text-center uppercase">
                Cấu hình vị trí cho các mục tại trang chủ
              </h1>
            </div>

            <div>
              {loading ? (
                <div className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </div>
              ) : vitri.length > 0 ? (
                <VitriTable
                  initialVitri={vitri}
                  onChangeVitri={handleVitriChange}
                />
              ) : (
                <div className="text-center py-6 text-red-500">
                  Không có dữ liệu
                </div>
              )}
            </div>

            {!loading && (
              <div className="flex flex-col md:flex-col xl:flex-row justify-between items-center">
                <div className="flex items-center w-full justify-center xl:w-100 xl:justify-start gap-2 text-gray-500">
                  <IoMdInformationCircleOutline />
                  <span>Kéo thả để thay đổi vị trí</span>
                </div>
                {toast && (
                  <NotificationToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                  />
                )}
                <div className="flex flex-col items-center md:flex-row justify-end gap-3 w-full mt-5">
                  {/* Nút khôi phục (chỉ restore lại vitri chưa lưu) */}
                  <button
                    onClick={() => setVitri(defaultVitri)} // khôi phục lại vitri gốc từ DB
                    disabled={
                      JSON.stringify(normalizeVitri(vitri)) ===
                      JSON.stringify(normalizeVitri(defaultVitri))
                    }
                    className={`font-bold w-full sm:w-60 md:w-90 xl:w-60 py-2 cursor-pointer px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105
                                        ${
                                          JSON.stringify(
                                            normalizeVitri(vitri)
                                          ) ===
                                          JSON.stringify(
                                            normalizeVitri(defaultVitri)
                                          )
                                            ? "bg-gray-200 hover:bg-gray-300 cursor-not-allowed admin-dark:bg-gray-500"
                                            : "bg-blue-500 hover:bg-blue-700 text-white"
                                        }`}
                  >
                    <span className="text-sm sm:text-base font-semibold">
                      Khôi phục
                    </span>
                  </button>

                  {/* Nút khôi phục mặc định (reset DB về positionsDefault) */}
                  <button
                    onClick={handleResetDefault}
                    disabled={isVitriSameAsDefault(defaultVitri)} // nếu DB đã đúng mặc định thì disable
                    className={`font-bold w-full sm:w-60 md:w-full xl:w-60 cursor-pointer py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105
                                        ${
                                          isVitriSameAsDefault(defaultVitri)
                                            ? "bg-gray-200 hover:bg-gray-300 cursor-not-allowed admin-dark:bg-gray-500"
                                            : "bg-blue-500 hover:bg-blue-700 text-white"
                                        }`}
                  >
                    <span className="text-sm sm:text-base font-semibold">
                      Khôi phục lại mặc định
                    </span>
                  </button>

                  <button
                    onClick={() => savePositions(vitri)}
                    disabled={
                      JSON.stringify(normalizeVitri(vitri)) ===
                      JSON.stringify(normalizeVitri(defaultVitri))
                    }
                    className={`font-bold w-full sm:w-60 md:w-90 xl:w-60 py-2 px-6 cursor-pointer rounded-full transition duration-300 ease-in-out transform hover:scale-105
                                        ${
                                          JSON.stringify(
                                            normalizeVitri(vitri)
                                          ) ===
                                          JSON.stringify(
                                            normalizeVitri(defaultVitri)
                                          )
                                            ? "bg-gray-200 hover:bg-gray-300 cursor-not-allowed admin-dark:bg-gray-500"
                                            : "bg-green-500 hover:bg-green-700 text-white"
                                        }`}
                  >
                    <span className="text-sm sm:text-base font-semibold">
                      Lưu vị trí
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      // ========================= BANNER =========================
      case "banner":
        return (
          <div className="space-y-6">
            <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
              Cấu hình thông tin và biểu ngữ
            </h1>
            {(currentData.banner || []).map((b, i) => (
              <div
                key={b.id ?? `banner-${i}`}
                className="grid md:grid-cols-2 gap-6 items-start"
              >
                <div className="space-y-4">
                  <InputField
                    label="Tiêu đề"
                    value={b.title?.[activeLang] || ""}
                    onChange={(e) =>
                      handleChange("banner", b.id, "title", e.target.value)
                    }
                  />
                  <TextareaField
                    label="Mô tả"
                    value={b.description?.[activeLang] || ""}
                    onChange={(e) =>
                      handleChange(
                        "banner",
                        b.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <InputField
                    label="Chọn ảnh"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("banner", b.id, e.target.files[0])
                    }
                  />
                  <SafeImage
                    src={
                      previewBanner?.[b.id] ||
                      `${import.meta.env.VITE_MAIN_BE_URL}${b.banner}`
                    }
                    alt={`banner-${b.id}`}
                    className="rounded-xl shadow-md w-full h-60 object-cover mt-4"
                  />
                </div>
              </div>
            ))}

            <div className="text-center md:text-right">
              <button
                onClick={() => handleSave("banner")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base">
                  Lưu Banner
                </span>
              </button>
            </div>
          </div>
        );

      // ========================= NỀN TẢNG =========================
      case "nenTang":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
                Cấu hình thông tin nền tảng
              </h1>
            </div>
            {(currentData.nenTang || []).map((n, i) => {
              return (
                <div key={n.id ?? `nenTang-${i}`}>
                  <InputField
                    label="Tiêu đề"
                    value={n?.title?.[activeLang] || ""}
                    onChange={(e) =>
                      handleChange("nenTang", n?.id, "title", e.target.value)
                    }
                  />
                  <TextareaField
                    label="Mô tả"
                    value={n?.description?.[activeLang] || ""}
                    onChange={(e) =>
                      handleChange(
                        "nenTang",
                        n?.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                  {n?.banner && (
                    <SafeImage
                      src={n.banner}
                      alt="nenTang-banner"
                      className="rounded-xl shadow-md w-full h-60 object-cover mt-4"
                    />
                  )}
                </div>
              );
            })}
            <div className="text-center md:text-right">
              <button
                onClick={() => handleSave("nenTang")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base">
                  Lưu Nền tảng
                </span>
              </button>
            </div>
          </div>
        );

      // ========================= CARDS =========================
      case "cards":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="uppercase font-bold text-base md:text-xl text-center border-b-2 pb-6">
                Cấu hình thông tin cho 3 thẻ nội dung
              </h1>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(currentData.cards || []).map((c, i) => (
                <div
                  key={c.id ?? `card-${i}`}
                  className="p-2 sm:p-3 rounded-lg border border-gray-200 admin-dark:border-gray-600 shadow space-y-2"
                >
                  <InputField
                    label="Tiêu đề"
                    value={c.title?.[activeLang] || ""}
                    onChange={(e) =>
                      handleChange("cards", c.id, "title", e.target.value)
                    }
                  />
                  <TextareaField
                    label="Mô tả"
                    value={c.description?.[activeLang] || ""}
                    onChange={(e) =>
                      handleChange("cards", c.id, "description", e.target.value)
                    }
                  />
                  <div className="flex w-full items-center justify-start">
                    <div className="w-full">
                      <InputField
                        label="Chọn ảnh"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange("cards", c.id, e.target.files[0])
                        }
                      />
                      <SafeImage
                        src={
                          previewBanner?.[c.id] ||
                          `${import.meta.env.VITE_MAIN_BE_URL}${c.image_url}`
                        }
                        alt={`image_url_customer-${c.id}`}
                        className="rounded-xl shadow-md w-full h-50 object-cover mt-4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center md:text-right">
              <button
                onClick={() => handleSave("cards")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base">
                  Lưu dữ liệu
                </span>
              </button>
            </div>
          </div>
        );

      // ========================= DỊCH VỤ =========================
      case "dichVu":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
                Cấu hình thông tin cho nhóm dịch vụ chính
              </h1>
            </div>
            <div className="flex items-center justify-center w-full">
              <div
                className="
      flex items-center justify-center gap-10 rounded-2xl border-2
      border-gray-300 bg-white
      admin-dark:border-gray-800 admin-dark:bg-slate-800
      w-fit px-10 py-4
    "
              >
                <div className="flex flex-col">
                  <h1
                    className="
          uppercase font-bold text-base md:text-md pb-6 text-center
          text-gray-800 admin-dark:text-gray-100
        "
                  >
                    Số lượng nội dung hiển thị
                  </h1>

                  <div className="mx-auto w-full max-w-md gap-2 flex items-center justify-centers">
                    <div className="w-full">
                      <Slider
                        value={currentQuantity}
                        onValueChange={setCurrentQuantity}
                        max={6}
                        min={1}
                        step={1}
                        className="w-full"
                      />

                      {/* Các số hiển thị phía dưới */}
                      <div className="flex justify-between mt-2">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <span
                            key={num}
                            className={`text-xs ${
                              currentQuantity[0] === num
                                ? "font-bold text-blue-600"
                                : "text-gray-500 admin-dark:text-gray-400"
                            }`}
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chỉ hiển thị khi có thay đổi */}
                {isChanged && (
                  <div>
                    <button
                      type="submit"
                      onClick={handleSubmitChangeQuantity}
                      className="
            border rounded-full bg-green-600/70 p-3
            hover:bg-green-700 transition-all cursor-pointer
            admin-dark:bg-green-700/50 admin-dark:hover:bg-green-700
          "
                    >
                      <Check className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Nếu đang loading thì hiển thị chữ "Tải nội dung..." */}
            {loading ? (
              <div className="text-center text-gray-500 italic">
                Tải nội dung...
              </div>
            ) : (
              <div className="flex flex-col  w-full gap-10 ">
                <div className="grid md:grid-cols-2 gap-6">
                  {(currentData.dichVu.slice(0, displayQuantity) || []).map(
                    (d, i) => (
                      <div
                        key={d.id ?? `dv-${i}`}
                        className="border border-gray-200 admin-dark:border-gray-600 rounded-xl p-4 shadow space-y-2 admin-dark:bg-slate-800"
                      >
                        <InputField
                          label="Tiêu đề"
                          value={d.title?.[activeLang] || ""}
                          onChange={(e) =>
                            handleChange(
                              "dichVu",
                              d.id,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <TextareaField
                          label="Mô tả"
                          value={d.description?.[activeLang] || ""}
                          onChange={(e) =>
                            handleChange(
                              "dichVu",
                              d.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <div className="flex w-full items-center justify-center">
                          <div className="w-full">
                            <InputField
                              label="Chọn ảnh"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(
                                  "dichVu",
                                  d.id,
                                  e.target.files[0]
                                )
                              }
                              className="w-full"
                            />
                            <SafeImage
                              src={
                                previewBanner?.[d.id] ||
                                `${import.meta.env.VITE_MAIN_BE_URL}${
                                  d.image_url
                                }`
                              }
                              alt={`image_url_dichvu-${d.id}`}
                              className="rounded-xl shadow-md w-full h-52 object-cover mt-4"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="text-center md:text-right">
                  <button
                    onClick={() => handleSave("dichVu")}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
                  >
                    <span className="font-semibold text-sm sm:text-base">
                      Lưu Dịch vụ
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      // ========================= CHI TIẾT DỊCH VỤ =========================
      case "chitietdichvu":
        return (
          <div className="space-y-6">
            {/* header className="flex items-center justify-between border-b-2 pb-2" */}

            <div>
              <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
                CẤU HÌNH NỘI DUNG CHI TIẾT DỊCH VỤ
              </h1>
              <div className="w-full flex justify-start">
                <button
                  onClick={() => setIsViewTable((pre) => !pre)}
                  className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 cursor-pointer mt-5"
                >
                  {!isViewTable && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span className="text-xs sm:text-sm font-semibold">
                        Xem thử giao diện
                      </span>
                    </div>
                  )}
                  {isViewTable && (
                    <span className="text-xs sm:text-sm font-semibold">
                      Quay lại
                    </span>
                  )}
                </button>
              </div>
            </div>
            {/* body */}
            <div className="w-full">
              {!isViewTable && <ChitietdichvuSection />}
              {isViewTable && (
                <div>
                  <PricingPage />
                </div>
              )}
            </div>
          </div>
        );

      // ========================= LỢI ÍCH =========================
      case "loiIch":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
                CẤU HÌNH NỘI DUNG lợi ích của công ty mang đến cho khách hàng
              </h1>
            </div>

            {(currentData?.loiIch || []).map((item, i) => (
              <div
                key={item.id ?? `li-${i}`}
                className="rounded-xl space-y-2"
              >
                <InputField
                  label="Tiêu đề"
                  value={item.title?.[activeLang] || ""}
                  onChange={(e) =>
                    handleChange("loiIch", item.id, "title", e.target.value)
                  }
                />
                <TextareaField
                  label="Mô tả (cách dòng = xuống hàng)"
                  value={item.description?.[activeLang] || ""}
                  onChange={(e) =>
                    handleChange(
                      "loiIch",
                      item.id,
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
            <div className="text-center md:text-right">
              <button
                onClick={() => handleSave("loiIch")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base">
                  Lưu Lợi ích
                </span>
              </button>
            </div>
          </div>
        );

      // ========================= KHẨU HIỆU =========================
      case "khauHieu":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
                CẤU HÌNH NỘI DUNG khẩu hiệu của công ty
              </h1>
            </div>

            {(currentData?.khauHieu || []).map((k, i) => (
              <div
                key={k.id ?? `kh-${i}`}
                className="space-y-4"
              >
                <InputField
                  label="Slogan"
                  value={k.title?.[activeLang] || ""}
                  onChange={(e) =>
                    handleChange("khauHieu", k.id, "title", e.target.value)
                  }
                />

                <div className="overflow-hidden whitespace-nowrap mt-4 bg-gray-100 p-3 rounded-lg admin-dark:bg-gray-800">
                  <motion.div
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 50,
                      ease: "linear",
                    }}
                    className="inline-block w-full font-semibold text-indigo-600 admin-dark:text-white"
                  >
                    {k.title?.[activeLang] || ""}
                  </motion.div>
                </div>
              </div>
            ))}

            <div className="text-center md:text-right">
              <button
                onClick={() => handleSave("khauHieu")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base">
                  Lưu Khẩu hiệu
                </span>
              </button>
            </div>
          </div>
        );

      // ========================= KHÁCH HÀNG =========================
      case "khachHang":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="uppercase font-bold text-base md:text-xl pb-6 text-center border-b-2">
                CẤU HÌNH NỘI DUNG cam kết với khách hàng
              </h1>
            </div>

            {(currentData?.khachHang || []).map((k, i) => (
              <div
                key={k.id ?? `kh-${i}`}
                className="space-y-4 rounded-lg"
              >
                <TextareaField
                  label="Mô tả"
                  value={k?.description?.[activeLang] || ""}
                  onChange={(e) =>
                    handleChange(
                      "khachHang",
                      k.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                {/* không có chọn ảnh */}
                <div
                  hidden
                  className="flex w-full items-center justify-center"
                >
                  <div>
                    <InputField
                      label="Chọn ảnh"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange("khachHang", k.id, e.target.files[0])
                      }
                    />
                    <SafeImage
                      src={
                        previewBanner?.[k.id] ||
                        `${import.meta.env.VITE_MAIN_BE_URL}${k.image_url}`
                      }
                      alt={`image_url_customer-${k.id}`}
                      className="rounded-xl shadow-md w-200 h-100 object-cover mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center md:text-right">
              <button
                onClick={() => handleSave("khachHang")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base">
                  Lưu dữ liệu
                </span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderSection();
}
