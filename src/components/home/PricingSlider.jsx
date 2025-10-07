import React, { useEffect, useState } from "react";
import {
  getAllServices,
  getAllServiceStages,
} from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  skeleton,
  errorState,
  missingDataState,
  invalidDataState,
  tableStyles,
} from "./typePricingSlider/typePricingSlider";

// --- 1. ENHANCED SKELETON LOADER ---
const SkeletonLoader = () => (
  <div className={skeleton.container}>
    <div className={skeleton.tableWrapper}>
      <div className={skeleton.table}>
        {/* Skeleton Header */}
        <div className={skeleton.header}>
          {/* Stage Row */}
          <div className={skeleton.stageRow}>
            <div className={skeleton.stageHeaderCell}>
              <div className={skeleton.stageHeaderPulse}></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={skeleton.stageDataCell}
              >
                <div className={skeleton.stageDataPulse}></div>
              </div>
            ))}
          </div>
          {/* Service Name Row */}
          <div className={skeleton.serviceNameRow}>
            <div className={skeleton.serviceNameHeaderCell}>
              <div className={skeleton.serviceNameHeaderPulse}></div>
            </div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={skeleton.serviceNameDataCell}
              >
                <div className={skeleton.serviceNameDataPulse}></div>
              </div>
            ))}
          </div>
        </div>
        {/* Skeleton Body */}
        <div>
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className={skeleton.bodyRow}
            >
              <div className={skeleton.bodyHeaderCell}>
                <div className={skeleton.bodyHeaderPulse}></div>
              </div>
              {[...Array(6)].map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className={skeleton.bodyDataCell}
                >
                  <div className={skeleton.bodyDataPulse}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className={skeleton.loadingIndicatorContainer}>
      <div className={skeleton.loadingDot}></div>
      <div
        className={skeleton.loadingDot}
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className={skeleton.loadingDot}
        style={{ animationDelay: "0.2s" }}
      ></div>
      <span className={skeleton.loadingText}>Đang tải dữ liệu...</span>
    </div>
    <p className={skeleton.mobileHint}>
      <span className="text-base">👉</span>
      <span>Vuốt sang ngang để xem toàn bộ bảng</span>
    </p>
  </div>
);

// --- 2. MAIN COMPONENT ---
const ServiceTable = () => {
  const [servicesData, setServicesData] = useState([]);
  const [serviceDetailsData, setServiceDetailsData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchDataServiceStage = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stageResult, serviceResult, bridgeResult] = await Promise.all([
        getAllServiceStages(),
        getAllServices(),
        getAllBridge(),
      ]);

      if (
        !Array.isArray(stageResult) ||
        !Array.isArray(serviceResult) ||
        !Array.isArray(bridgeResult)
      ) {
        throw new Error("Dữ liệu từ BE không đúng định dạng mảng");
      }

      setServicesData(bridgeResult);
      setServiceDetailsData(serviceResult);
      setStageData(stageResult);
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchDataServiceStage, 2000);
      } else {
        setError(
          "Không thể tải dữ liệu sau nhiều lần thử. Vui lòng kiểm tra kết nối hoặc liên hệ quản trị viên."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataServiceStage();
  }, [retryCount]);

  const uniqueTitles = [
    ...new Set(servicesData.map((item) => item?.title_vi).filter(Boolean)),
  ];

  const uniqueServices = serviceDetailsData
    .filter((item) => item?.id && item?.translation?.ten_dich_vu)
    .map((item) => {
      const stageInfo = stageData.find(
        (s) => Number(s?.service_id) === Number(item.id)
      );
      if (!stageInfo) return null;
      return {
        id: Number(item.id),
        ten_dich_vu: item.translation.ten_dich_vu,
        stage_id: stageInfo.stage_id,
        stage: stageInfo.stage_title_vi,
      };
    })
    .filter(Boolean);

  const stages = [
    ...new Set(stageData.map((item) => item?.stage_title_vi).filter(Boolean)),
  ];

  const servicesByStage = stages.map((stage) => ({
    stage,
    services: uniqueServices.filter((service) => service.stage === stage),
  }));

  const isServiceProvided = (serviceId, titleVi) => {
    return servicesData.some(
      (item) =>
        Number(item?.service_id) === Number(serviceId) &&
        item?.title_vi === titleVi
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  // --- 3. ENHANCED ERROR STATE (API FETCH) ---
  if (error) {
    return (
      <div className={errorState.container}>
        <div className={errorState.iconWrapper}>
          <div className={errorState.iconBlur}></div>
          <XCircle
            className={errorState.icon}
            strokeWidth={1.5}
          />
        </div>
        <h3 className={errorState.title}>Không thể tải dữ liệu</h3>
        <p className={errorState.message}>{error}</p>
        <button
          onClick={() => {
            setRetryCount(0);
            fetchDataServiceStage();
          }}
          className={errorState.retryButton}
        >
          <RefreshCw className={errorState.retryIcon} />
          Thử lại
        </button>
      </div>
    );
  }

  // --- 4. ENHANCED MISSING DATA STATE ---
  if (!servicesData.length || !serviceDetailsData.length || !stageData.length) {
    return (
      <div className={missingDataState.container}>
        <div className={missingDataState.iconWrapper}>
          <div className={missingDataState.iconBlur}></div>
          <AlertTriangle
            className={missingDataState.icon}
            strokeWidth={1.5}
          />
        </div>

        <h3 className={missingDataState.title}>Thiếu dữ liệu cấu hình</h3>
        <p className={missingDataState.message}>
          Hệ thống cần đầy đủ dữ liệu để hiển thị bảng dịch vụ. Vui lòng kiểm
          tra các mục sau:
        </p>

        <div className={missingDataState.list}>
          {!stageData.length && (
            <div className={missingDataState.item}>
              <span className={missingDataState.itemIcon}>⚠️</span>
              <div>
                <p className={missingDataState.itemTitle}>Giai đoạn Dịch vụ</p>
                <p className={missingDataState.itemText}>
                  Chưa cấu hình Stage Data
                </p>
              </div>
            </div>
          )}
          {!servicesData.length && (
            <div className={missingDataState.item}>
              <span className={missingDataState.itemIcon}>❌</span>
              <div>
                <p className={missingDataState.itemTitle}>Hạng mục Dịch vụ</p>
                <p className={missingDataState.itemText}>
                  Danh sách Services Data trống
                </p>
              </div>
            </div>
          )}
          {!serviceDetailsData.length && (
            <div className={missingDataState.item}>
              <span className={missingDataState.itemIcon}>❌</span>
              <div>
                <p className={missingDataState.itemTitle}>Chi tiết Dịch vụ</p>
                <p className={missingDataState.itemText}>
                  Không tìm thấy Service Details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 5. ENHANCED INVALID DATA STATE ---
  if (!uniqueTitles.length || !uniqueServices.length) {
    return (
      <div className={invalidDataState.container}>
        <div className={invalidDataState.iconWrapper}>
          <div className={invalidDataState.iconBlur}></div>
          <Info
            className={invalidDataState.icon}
            strokeWidth={1.5}
          />
        </div>

        <h3 className={invalidDataState.title}>Lỗi cấu trúc dữ liệu</h3>
        <p className={invalidDataState.message}>
          Dữ liệu đã được tải nhưng thiếu các trường bắt buộc để hiển thị nội
          dung.
        </p>

        <div className={invalidDataState.detailsBox}>
          <p className={invalidDataState.detailsTitle}>Chi tiết vấn đề:</p>
          <ul className={invalidDataState.list}>
            {!uniqueTitles.length && (
              <li className={invalidDataState.listItem}>
                <span className={invalidDataState.listIcon}>•</span>
                <span className={invalidDataState.listItemText}>
                  Thiếu trường{" "}
                  <code className={invalidDataState.codeSnippet}>title_vi</code>{" "}
                  trong dữ liệu hạng mục
                </span>
              </li>
            )}
            {!uniqueServices.length && (
              <li className={invalidDataState.listItem}>
                <span className={invalidDataState.listIcon}>•</span>
                <span className={invalidDataState.listItemText}>
                  Thiếu trường{" "}
                  <code className={invalidDataState.codeSnippet}>
                    translation.ten_dich_vu
                  </code>{" "}
                  trong dữ liệu dịch vụ
                </span>
              </li>
            )}
          </ul>
        </div>

        <p className={invalidDataState.footerText}>
          Vui lòng kiểm tra lại cấu hình API hoặc cấu trúc dữ liệu trả về
        </p>
      </div>
    );
  }

  // --- 6. ENHANCED TABLE DISPLAY ---
  return (
    <div className={tableStyles.container}>
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

export default ServiceTable;
