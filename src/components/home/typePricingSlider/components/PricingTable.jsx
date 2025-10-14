import React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
// Đổi tên imports để có thể sử dụng cả hai bộ styles
import { tableStyles as adminStyles } from "../style/admin";
import { tableStyles as clientStyles } from "../style/client";

// Hàm tiện ích để quyết định bộ styles nào sẽ được dùng
const getTableStyles = () => {
  // Kiểm tra nếu đang ở môi trường trình duyệt và URL bắt đầu bằng '/managers'
  // Ví dụ: /managers/dashboard, /managers, ...
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/managers")
  ) {
    return adminStyles;
  }
  // Mặc định hoặc khi URL không phải của admin, sử dụng clientStyles
  return clientStyles;
};

const PricingTable = ({ uniqueTitles, servicesByStage, isServiceProvided }) => {
  // Lấy bộ styles phù hợp cho lần render hiện tại
  const tableStyles = getTableStyles();

  return (
    <div className={`${tableStyles.container}`}>
      {" "}
      {/* Đã sửa lỗi cú pháp: }} -> } */}
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead className={tableStyles.thead}>
            {/* Stage Row */}
            <tr className={tableStyles.stageHeaderRow}>
              <th className={tableStyles.stageHeaderCell}>Giai đoạn</th>
              {servicesByStage.map(({ stage, services }, index) => {
                const style =
                  tableStyles.stageColumnStyles[
                    index % tableStyles.stageColumnStyles.length
                  ];

                return (
                  <th
                    key={stage}
                    colSpan={services.length || 1}
                    className={cn(
                      tableStyles.stageColumnHeaderBase,
                      style.border,
                      style.text,
                      style.bg
                    )}
                  >
                    {stage}
                  </th>
                );
              })}
            </tr>
            {/* Service Name Row */}
            <tr className={tableStyles.serviceHeaderRow}>
              <th className={tableStyles.serviceHeaderCell}>Danh mục</th>

              {servicesByStage.map(({ stage, services }) =>
                services.length > 0 ? (
                  services.map((service) => (
                    <th
                      key={service.id}
                      className={tableStyles.serviceColumnHeader}
                    >
                      {service.ten_dich_vu}
                    </th>
                  ))
                ) : (
                  <th
                    key={`${stage}-empty`}
                    className={tableStyles.emptyHeaderCell}
                  ></th>
                )
              )}
            </tr>
          </thead>

          <tbody className={tableStyles.tbody}>
            {uniqueTitles.map((title, idx) => (
              <tr
                key={title}
                className={cn(
                  tableStyles.rowBase,
                  idx % 2 === 0 ? tableStyles.rowEven : tableStyles.rowOdd
                )}
              >
                <td className={tableStyles.titleCell}>{title}</td>
                {servicesByStage.map(({ stage, services }) =>
                  services.length > 0 ? (
                    services.map((service) => (
                      <td
                        key={service.id}
                        className={tableStyles.serviceCell}
                      >
                        {isServiceProvided(service.id, title) ? (
                          <div className={tableStyles.checkIconWrapper}>
                            <div className={tableStyles.checkIconInnerWrapper}>
                              <div className={tableStyles.checkIconBlur}></div>
                              <CheckCircle
                                className={tableStyles.checkIcon}
                                strokeWidth={2}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className={tableStyles.emptyCellIndicator}>
                            —
                          </span>
                        )}
                      </td>
                    ))
                  ) : (
                    <td
                      key={`${stage}-empty`}
                      className={tableStyles.emptyCell}
                    ></td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Scroll Hint */}
      <div className={tableStyles.mobileScrollHint}>
        <span className={tableStyles.mobileScrollHintIcon}>👉</span>
        <span className={tableStyles.mobileScrollHintText}>
          Vuốt sang ngang để xem toàn bộ bảng dịch vụ
        </span>
      </div>
    </div>
  );
};

export default PricingTable;
