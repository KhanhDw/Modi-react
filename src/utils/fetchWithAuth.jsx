const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const text = await res.text(); // lấy body trả về để debug
        console.error("Fetch lỗi:", res.status, text);
        throw new Error(`Không thể tải dữ liệu (${res.status})`);
    }

    return res.json();
};

export default fetchWithAuth;