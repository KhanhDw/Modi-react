// src/pages/managers/ConfigPage/aboutConfig/components/NotificationModal.jsx
import React from "react";
import Modal from "./Modal";

const NotificationModal = ({ isOpen, onClose, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>{title}</h2>
        <p style={{ marginBottom: "30px" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
