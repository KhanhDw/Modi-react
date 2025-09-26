import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

export function useRevenues() {
    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tất cả revenues
    const fetchRevenues = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/api/revenues`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setRevenues(data);
        } catch (err) {
            setError(err.message || "Có lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRevenues();
    }, [fetchRevenues]);

    return { revenues, loading, error, refetch: fetchRevenues };
}
