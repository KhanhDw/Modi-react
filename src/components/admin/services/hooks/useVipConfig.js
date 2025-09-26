// src/hooks/useVipConfig.js
import { useState, useEffect } from "react";

const API_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/customer-vip/vip`;

export default function useVipConfig() {
    const [minSpent, setMinSpent] = useState(0);       // Giá trị số
    const [loading, setLoading] = useState(true);      // Trạng thái loading
    const [error, setError] = useState(null);          // Thông báo lỗi

    // Fetch dữ liệu VIP config khi hook được dùng
    useEffect(() => {
        const fetchVipConfig = async () => {
            try {
                setLoading(true);
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("Không lấy được cấu hình VIP");

                const data = await res.json();
                setMinSpent(data.min_spent || 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVipConfig();
    }, []);

    // Hàm cập nhật giá trị min_spent
    const updateVipConfig = async (value) => {
        try {
            setLoading(true);
            const res = await fetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ min_spent: value }),
            });
            if (!res.ok) throw new Error("Cập nhật thất bại");

            const result = await res.json();
            setMinSpent(result.min_spent);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { minSpent, setMinSpent, loading, error, updateVipConfig };
}
