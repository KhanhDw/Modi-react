// src/pages/managers/ConfigPage/aboutConfig/components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
