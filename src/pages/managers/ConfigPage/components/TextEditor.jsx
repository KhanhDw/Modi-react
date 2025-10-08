import useLenisLocal from "@/hook/useLenisLocal";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const TextEditor = forwardRef(
  ({ label, fields, data, onChange, lang, haveImage = false }, ref) => {
    const [preview, setPreview] = useState("");
    const [isImageError, setIsImageError] = useState(false);
    useLenisLocal(".lenis-local");

    useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }, [preview]);

    const handleChange = (field, value) => {
      onChange({
        ...data,
        [field]:
          typeof data[field] === "object"
            ? { ...data[field], [lang]: value }
            : value,
      });
    };

    const handleFileChange = (field, file) => {
      if (!file) return;

      const tempUrl = URL.createObjectURL(file);
      setPreview(tempUrl);
      setIsImageError(false);

      handleChange(field, file);
    };

    useImperativeHandle(ref, () => ({
      async uploadImage() {
        if (data?.image_url instanceof File) {
          const fieldName = "image_url";
          const formData = new FormData();

          formData.append("file", data.image_url);
          formData.append("id", data.id);
          formData.append("field", "image_url");
          formData.append("section", "about");

          try {
            const res = await fetch(
              `${import.meta.env.VITE_MAIN_BE_URL}/api/upload?field=${fieldName}`,
              {
                method: "POST",
                body: formData,
              }
            );

            const result = await res.json();
            if (result?.url) {
              handleChange("image_url", result.data?.url || result.url);
              setPreview("");
              setIsImageError(false);
            }
          } catch (err) {
            console.error("Upload failed:", err);
          }
        }
      },
    }));

    const renderImage = () => {
      if (preview) {
        return (
          <img
            src={preview}
            alt="Ảnh tạm thời"
            className="mt-2 w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow border-2 border-indigo-400"
            onError={() => setIsImageError(true)}
          />
        );
      } else if (typeof data?.image_url === "string") {
        if (isImageError) {
          return (
            <div className="mt-2 w-full h-32 sm:h-40 md:h-48 flex items-center justify-center border-2 border-dashed border-red-400 rounded-lg text-red-500 text-xs sm:text-sm">
              Ảnh lỗi
            </div>
          );
        }
        return (
          <img
            src={
              data?.image_url
                ? `${import.meta.env.VITE_MAIN_BE_URL}${data.image_url}`
                : "/no-image.png"
            }
            alt="Ảnh fetch từ server"
            className="mt-2 w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow"
            onError={() => setIsImageError(true)}
          />
        );
      } else {
        if (haveImage) {
          return (
            <div className="mt-2 w-full h-32 sm:h-40 md:h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-xs sm:text-sm">
              Chưa có ảnh xem trước
            </div>
          );
        }
      }
    };

    return (
      <div className="p-3 sm:p-4 bg-gray-50 admin-dark:bg-gray-800 rounded-lg sm:rounded-xl shadow space-y-2 sm:space-y-3 w-full">
        <h3 className="font-semibold text-base sm:text-lg">{label}</h3>

        {fields.map((field) =>
          field.name === "image_url" ? (
            <div key={field.name} className="space-y-2 w-full">
              <input
                autoComplete="off"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(field.name, e.target.files[0])
                }
                className="block w-full text-xs text-gray-500 file:mr-3 sm:mr-4 file:py-1 sm:py-2 file:px-3 sm:px-4 file:rounded-full file:border-0 file:text-xs sm:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          ) : (
            <textarea
              data-lenis-prevent
              autoComplete="off"
              key={field.name}
              type="text"
              rows={5}
              placeholder={field.placeholder}
              value={
                typeof data?.[field.name] === "object"
                  ? data?.[field.name]?.[lang] || ""
                  : data?.[field.name] || ""
              }
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full scrollbar-hide px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
            />
          )
        )}

        {renderImage()}
      </div>
    );
  }
);

export default TextEditor;
