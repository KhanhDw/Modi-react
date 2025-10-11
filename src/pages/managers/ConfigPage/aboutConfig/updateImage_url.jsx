import { useEffect, useState, useCallback } from "react";

function useUpdateImageUrl({ slug = "about", type = "about_intro" } = {}) {
  const [item, setItem] = useState(null); // { id, image_url }
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_MAIN_BE_URL
          }/api/section-items/type/${type}?slug=${slug}`,
          { signal }
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        const list = Array.isArray(data) ? data : data?.data ?? [];
        if (list.length > 0) {
          const it = list[0];
          const fetchedItem = { id: it.id, image_url: it.image_url ?? "" };
          setItem(fetchedItem);
          return fetchedItem;
        } else {
          setItem(null);
          return null;
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [slug, type]
  );

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const handleUpdateImageUrl = async (id_update, newUrl) => {
    if (!id_update) {
      const err = new Error("Missing item id — cannot update");
      setError(err);
      return { ok: false, error: err };
    }

    setUpdating(true);
    setError(null);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/section-items/videoBannerAbout/${id_update}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: newUrl }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} ${text}`);
      }
      const json = await res.json();
      // cập nhật local state để UI phản hồi tức thì
      setItem((prev) => (prev ? { ...prev, image_url: newUrl } : prev));
      return { ok: true, data: json };
    } catch (err) {
      setError(err);
      return { ok: false, error: err };
    } finally {
      setUpdating(false);
    }
  };

  return {
    item,
    loading,
    load,
    updating,
    error,
    handleUpdateImageUrl,
    refetch: () => {
      /* có thể implement nếu cần */
    },
  };
}

export default useUpdateImageUrl;