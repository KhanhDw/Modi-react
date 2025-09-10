// Hàm định dạng số thành tiền tệ
export const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

// Hàm chuyển đổi chuỗi tiền tệ về số
export const parseCurrency = (value) => {
    if (!value) return 0;
    const numericValue = value.replace(/[^\d]/g, "");
    return Number(numericValue);
};