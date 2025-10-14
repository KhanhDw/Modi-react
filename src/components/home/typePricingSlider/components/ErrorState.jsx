import React from "react";
import { XCircle, RefreshCw } from "lucide-react";
import { errorState } from "../typePricingSlider";

const ErrorState = ({ error, onRetry }) => (
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
      onClick={onRetry}
      className={errorState.retryButton}
    >
      <RefreshCw className={errorState.retryIcon} />
      Thử lại
    </button>
  </div>
);

export default ErrorState;
