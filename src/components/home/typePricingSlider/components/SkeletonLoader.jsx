import React from "react";
import { skeleton } from "../typePricingSlider";

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

export default SkeletonLoader;
