import useLenisLocal from "@/hook/useLenisLocal";

export default function ListEditor({ section, data, onChange, lang }) {
  useLenisLocal(".lenis-local");

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = {
      ...updated[index][field],
      [lang]: value,
    };
    onChange(updated);
  };

  const removeItem = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...data];
      updated[index].img = reader.result;
      onChange(updated);
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="p-3 sm:p-4 bg-gray-50 admin-dark:bg-gray-800 rounded-lg sm:rounded-xl shadow space-y-3 sm:space-y-4 w-full">
      <h3 className="font-bold text-base sm:text-lg">{section}</h3>
      {data.map((item, index) => (
        <div
          key={index}
          className="p-2 sm:p-3 bg-white admin-dark:bg-gray-800 rounded-lg sm:rounded-xl shadow space-y-2 sm:space-y-3 w-full"
        >
          <input
            autoComplete="off"
            type="text"
            placeholder="Tiêu đề..."
            value={item.title?.[lang] || ""}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
          />
          <textarea
            placeholder="Mô tả..."
            value={item.description?.[lang] || ""}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            rows={4}
            data-lenis-prevent
            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 admin-dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
          />
        </div>
      ))}
    </div>
  );
}
