import React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { tableStyles as adminStyles } from "../style/admin";
import { tableStyles as clientStyles } from "../style/client";
import { useLocation } from "react-router-dom";

// Hàm tiện ích để quyết định bộ styles nào sẽ được dùng
const getTableStyles = (pathname) => {
  // Nếu đường dẫn bắt đầu bằng '/managers' → dùng admin styles
  if (pathname.startsWith("/managers")) {
    return adminStyles;
  }
  // Mặc định dùng client styles
  return clientStyles;
};

const PricingTable = ({ uniqueTitles, servicesByStage, isServiceProvided }) => {
  const location = useLocation();

  // Lấy bộ styles dựa theo pathname hiện tại
  const tableStyles = getTableStyles(location.pathname);

  return (
    <div className={`${tableStyles.container}`}>
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
