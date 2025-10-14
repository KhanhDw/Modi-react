import React from "react";
import { Info } from "lucide-react";
import { invalidDataState } from "../typePricingSlider";

const InvalidDataState = ({ uniqueTitles, uniqueServices }) => (
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

export default InvalidDataState;
