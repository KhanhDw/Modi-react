import React from "react";
import { AlertTriangle } from "lucide-react";
import { missingDataState } from "../typePricingSlider";

const MissingDataState = ({ stageData, servicesData, serviceDetailsData }) => (
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

export default MissingDataState;
