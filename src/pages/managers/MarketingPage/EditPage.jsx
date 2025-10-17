import TextEditorWrapper from "@/components/feature/TextEditor/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMarketing } from "@/pages/managers/MarketingPage/hooks/MarketingContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SocialNetworkManager from "./SocialNetworkManager";
import CustomSelect from "./OptionsSelect";
import CustomSelectWithFooter from "./SocialNetworksSelect";

export default function EditPage() {
  const editorRef = useRef(null);
  const {
    formData,
    setFormData,
    handleEditPost,
    reloadPostsAndSocialNetWorks,
  } = useMarketing();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isOpenEditNetwork, setIsOpenEditNetwork] = useState(false);
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [activeLang, setActiveLang] = useState("vi");

  // preview ảnh (tự động generate từ formData.image)
  const previewUrl = useMemo(() => {
    if (formData.image instanceof File)
      return URL.createObjectURL(formData.image);
    if (typeof formData.image === "string")
      return `${import.meta.env.VITE_MAIN_BE_URL}${formData.image}`;
    return "";
  }, [formData.image]);

  // Fetch danh sách social networks
  const fetchSocialNetworks = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/social-networks`
      );
      if (!res.ok) throw new Error("Không thể tải mạng xã hội");
      const data = await res.json();
      setSocialNetworks(data);
    } catch (err) {
      console.error("Lỗi mạng xã hội:", err);
    }
  };

  // Fetch dữ liệu bài viết theo id
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/id/${id}`
        );
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        const data = await res.json();

        setFormData(data);
        setActiveLang(data.lang ?? "vi");
      } catch (err) {
        console.error("Lỗi khi tải:", err);
        setError("Không thể tải dữ liệu bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchSocialNetworks();
    fetchData();
  }, [id, setFormData]);

  // Fetch bài viết theo ngôn ngữ
  const fetchByLang = async (lang) => {
    const langPath = lang ? `/${lang}` : "";
    const url = `${
      import.meta.env.VITE_MAIN_BE_URL
    }${langPath}/api/marketing/id/${id}`;
    const res = await fetch(url);
    return res.ok ? res.json() : null;
  };

  const handleChangeLang = async (lang = "") => {
    if (!id) return;
    try {
      const marketingData = await fetchByLang(lang);

      if (!marketingData || Object.keys(marketingData).length === 0) {
        setFormData((prev) => ({
          ...prev,
          lang,
          title: "",
          content: "<p></p>",
        }));
      } else {
        setFormData(marketingData);
      }

      setActiveLang(lang);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    }
  };

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const content = editorRef.current?.getHTML();
      const data = new FormData();

      data.append("author_id", formData.author_id || 1);
      data.append("platform_id", formData.platform_id);
      data.append("tags", formData.tags || "");
      data.append("status", formData.status || "draft");
      data.append(
        "translations",
        JSON.stringify([
          {
            lang: formData.lang || "vi",
            title: formData.title,
            content,
          },
        ])
      );

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      await handleEditPost(id, data);
      navigate(-1);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setError("Không thể cập nhật bài viết");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActiveLangbtn = (lang) => {
    if (lang !== activeLang) {
      const confirmMsg =
        lang === "en"
          ? "Bạn đang chuyển sang Tiếng Anh. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Anh."
          : "Bạn đang chuyển về Tiếng Việt. Khi cập nhật, dữ liệu sẽ được lưu ở Tiếng Việt.";

      if (!window.confirm(confirmMsg)) return;
    }
    handleChangeLang(lang);
  };

  if (loading) {
    return (
      <p className="text-center py-6 admin-dark:text-white">
        Đang tải dữ liệu...
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        {error}
        <div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mt-4 cursor-pointer"
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full admin-dark:bg-gray-900 rounded-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row sm:items-center justify-between mb-6 gap-4 w-full">
        <h2 className="text-xl text-center md:text-start font-bold text-gray-900 admin-dark:text-white">
          Chỉnh sửa bài viết
        </h2>

        {/* Ngôn ngữ */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-3">
          {["vi", "en"].map((lang) => {
            const isActive = activeLang === lang;

            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleActiveLangbtn(lang)}
                className={`cursor-pointer flex px-2 py-1 rounded-md
                    ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-blue-300 text-blue-500"
                    }
                `}
              >
                <span className="text-base lg:text-lg">
                  {lang === "vi" ? "Tiếng Việt" : "Tiếng Anh"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-center gap-3 sm:gap-4 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="border-gray-300 admin-dark:border-gray-600 admin-dark:text-gray-200 admin-dark:bg-gray-800 text-white bg-gray-700 hover:bg-gray-800 admin-dark:hover:bg-gray-700 text-sm sm:text-base px-4 py-2 rounded-md cursor-pointer"
          >
            <span className="text-sm sm:text-base font-semibold admin-dark:text-gray-200 text-white">
              Hủy
            </span>
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-600 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 rounded-md cursor-pointer"
          >
            <span className="text-sm sm:text-base font-semibold text-white">
              {submitting ? "Đang lưu..." : "Cập nhật"}
            </span>
          </Button>
        </div>
      </div>

      {/* Form Responsive */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cột trái */}
        <div className="lg:w-1/3">
          {!isOpenEditNetwork ? (
            <div className="flex flex-col gap-4 p-3 border-2 border-slate-300 admin-dark:border-slate-600 rounded-2xl bg-gray-50 admin-dark:bg-gray-800">
              {/* Tiêu đề */}
              <div className="space-y-3">
                <Label>Tiêu đề</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết"
                  className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg text-sm sm:text-base"
                />
              </div>

              {/* Mạng xã hội + Trạng thái */}
              <div className="flex flex-wrap gap-4">
                <div className="space-y-3">
                  <Label>Mạng xã hội</Label>
                  <CustomSelectWithFooter
                    value={String(formData.platform_id || "")}
                    onValueChange={(val) =>
                      setFormData({ ...formData, platform_id: Number(val) })
                    }
                    placeholder="Chọn mạng xã hội"
                    className="w-full"
                    options={socialNetworks.map((network, index) => ({
                      label: network.name,
                      value: String(network.id ?? `temp-${index}`),
                    }))}
                    footer={
                      <>
                        <div className="border-t border-gray-200 admin-dark:border-gray-700 mt-2" />
                        <Button
                          onClick={() => setIsOpenEditNetwork(true)}
                          theme="admin"
                          className="w-full mt-2 cursor-pointer"
                        >
                          Thêm mạng xã hội mới
                        </Button>
                      </>
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Trạng thái</Label>
                  <CustomSelect
                    value={formData.status || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    placeholder="Chọn trạng thái"
                    className={"md:w-42"}
                    options={[
                      { label: "Bản nháp", value: "draft" },
                      { label: "Đã xuất bản", value: "published" },
                      { label: "Lưu trữ", value: "archived" },
                    ]}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label>Tags</Label>
                <Input
                  value={formData.tags || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                  className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg"
                />
              </div>

              {/* Hình ảnh */}
              <div className="space-y-3">
                <Label>Ảnh bài viết</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (!file.type.startsWith("image/")) {
                        alert("Vui lòng chọn đúng định dạng ảnh");
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 2MB");
                        return;
                      }
                      setFormData({ ...formData, image: file });
                    }
                  }}
                  className="border-2 border-slate-300 admin-dark:border-slate-600 rounded-lg cursor-pointer"
                />

                {previewUrl && (
                  <div className="mt-3 border-2 border-gray-300 admin-dark:border-gray-700 rounded-lg">
                    <img
                      loading="lazy"
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover w-full rounded-lg h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SocialNetworkManager
              socialNetworks={socialNetworks}
              setSocialNetworks={setSocialNetworks}
              fetchSocialNetworks={fetchSocialNetworks}
              reloadPostsAndSocialNetWorks={reloadPostsAndSocialNetWorks}
              onClose={() => setIsOpenEditNetwork(false)}
            />
          )}
        </div>

        {/* Cột phải */}
        <div className="lg:w-2/3 flex flex-col gap-3 p-3 border-2 border-slate-300 admin-dark:border-slate-600 bg-gray-50 admin-dark:bg-gray-800 rounded-lg shadow-sm">
          <Label>Nội dung bài viết</Label>
          <TextEditorWrapper
            ref={editorRef}
            value={formData.content}
          />
        </div>
      </div>
    </div>
  );
}
