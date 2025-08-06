// utils/formatDate.js

/**
 * Định dạng chuỗi ngày giờ theo định dạng "giờ:phút ngày/tháng/năm".
 * @param {string} dateString - Chuỗi ngày giờ chuẩn ISO 8601 (ví dụ: "2025-07-29T00:40:03.000Z").
 * @returns {string} Chuỗi ngày giờ đã được định dạng (ví dụ: "07:40 29/07/2025").
 */
export default function formatDateTime(dateString){
  if (!dateString) {
    return "";
  }

  const dateObject = new Date(dateString);

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
    // timeZone: 'Asia/Ho_Chi_Minh' // Tùy chọn: Đảm bảo đúng múi giờ Việt Nam // sử dụng múi giờ theo local của máy nếu bỏ timezone
  };

  return dateObject.toLocaleString('vi-VN', options);
};