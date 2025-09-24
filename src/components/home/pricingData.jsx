// src/components/home/pricingData.js

const pricingData = [
  {
    stage: 1,
    title: "ĐẶT NỀN MÓNG ONLINE",
    description:
      "Dành cho cá nhân, startup muốn có sự hiện diện chuyên nghiệp đầu tiên.",
    plans: [
      {
        title: "Khởi Đầu Online",
        price: "Từ 1,5tr - 3tr",
        features: [
          "Thiết kế website giới thiệu cơ bản",
          "Giao diện chuẩn di động (responsive)",
          "Tên miền quốc tế & Hosting SSD",
          "Cài đặt bảo mật HTTPS SSL",
        ],
      },
      {
        title: "One-Me",
        price: "Thiết kế theo nhu cầu",
        features: [
          "Tư vấn định hướng miễn phí 1:1",
          "Thiết kế website độc quyền",
          "Tích hợp các công cụ hỗ trợ",
          "Tên miền + hosting miễn phí 1 năm",
        ],
      },
    ],
  },
  {
    stage: 2,
    title: "TĂNG TRƯỞNG & KINH DOANH",
    description: "Sẵn sàng xây dựng thương hiệu mạnh mẽ và tạo ra doanh thu.",
    plans: [
      {
        title: "Xây Dựng Thương Hiệu",
        price: "Từ 4tr - 10tr",
        features: [
          "Website giới thiệu DN hiện đại",
          "Thiết kế logo chuyên nghiệp",
          "Bộ nhận diện thương hiệu",
          "Hosting SSD + tên miền + email",
        ],
      },
      {
        title: "Bán Hàng Online",
        price: "Từ 8tr - 16tr",
        features: [
          "Website bán hàng + giỏ hàng",
          "Quản lý sản phẩm, đơn hàng",
          "Tích hợp thanh toán online",
          "Tích hợp vận chuyển",
        ],
        isPopular: true,
      },
      {
        title: "Đặt Lịch Dịch Vụ",
        price: "Từ 14tr - 22tr",
        features: [
          "Website giới thiệu dịch vụ",
          "Hệ thống booking online",
          "Gửi thông báo xác nhận lịch",
          "Thiết lập Google Business, SEO",
        ],
      },
    ],
  },
  {
    stage: 3,
    title: "TỐI ƯU & MỞ RỘNG",
    description:
      "Giải pháp đỉnh cao cho doanh nghiệp cần hệ thống quản lý chuyên sâu.",
    plans: [
      {
        title: "RE:VISION",
        price: "Nâng cấp website",
        features: [
          "Tư vấn nâng cấp miễn phí 1:1",
          "Nâng cấp source code & hiệu năng",
          "Tăng cường bảo mật website",
          "Đào tạo / bàn giao hướng dẫn",
        ],
      },
      {
        title: "Quản Lý Toàn Diện",
        price: "Từ 25tr - 50tr",
        features: [
          "Website giới thiệu công ty",
          "Hệ thống quản lý công việc",
          "Quản lý nhân sự cơ bản",
          "CRM khách hàng đơn giản",
        ],
      },
      {
        title: "Website + Ứng Dụng",
        price: "Từ 35tr - 60tr",
        features: [
          "Website bán hàng/dịch vụ",
          "App mobile (iOS/Android)",
          "Tự động cập nhật dữ liệu",
          "Tích hợp dịch vụ bên thứ ba",
        ],
      },
    ],
  },
];

export default pricingData;
