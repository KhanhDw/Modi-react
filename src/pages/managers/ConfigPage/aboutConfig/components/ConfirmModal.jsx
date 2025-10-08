// src/pages/managers/ConfigPage/aboutConfig/components/ConfirmModal.jsx
import React from "react";
import Modal from "./Modal";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>{title}</h2>
        <p style={{ marginBottom: "30px" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#dc3545",
              color: "white",
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
