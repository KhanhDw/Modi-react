
import BookingForm from "@/components/admin/services/booking/booking-form";
import CustomerForm from "@/components/admin/services/customers/customer-form";
import ServiceForm from "@/components/admin/services/service-form";
import { useOutletContext } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function DialogShowForm_Service() {
  const {
    showForm,
    typeForm,
    editingBooking,
    editingCustomer,
    handleClose,
  } = useOutletContext();

  const modalRef = useRef(null);

  // Đóng modal khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    }

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm, handleClose]);

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-5 min-h-screen">
      {/* <div
        ref={modalRef}
        className={`admin-dark:bg-gray-800 rounded-md sm:rounded-lg shadow-md
        w-full max-w-xl ${typeForm === "service" ? "min-w-[55vw]" : "min-w-[40vw]"} max-h-[98vh] sm:max-h-[95vh] overflow-y-auto scrollbar-hide`}
      >
        {typeForm === "service" ? (
          <ServiceForm />
        ) : typeForm === "booking" ? (
          <BookingForm editingBooking={editingBooking} />
        ) : typeForm === "customer" ? (
          <CustomerForm editingCustomer={editingCustomer} />
        ) : (
          <div className="p-4 text-red-500 text-center font-semibold">
            Không tìm thấy form: {typeForm}
          </div>
        )}
      </div> */}
      <div
        ref={modalRef}
        className={`admin-dark:bg-gray-800 rounded-md sm:rounded-lg shadow-md
    w-full max-w-xl ${typeForm === "service"
            ? "min-w-[55vw]"
            : typeForm === "customer"
              ? "min-w-[60vw]"
              : "min-w-[40vw]"
          } max-h-[98vh] sm:max-h-[95vh] overflow-y-auto scrollbar-hide`}
      >
        {typeForm === "service" ? (
          <ServiceForm />
        ) : typeForm === "booking" ? (
          <BookingForm editingBooking={editingBooking} />
        ) : typeForm === "customer" ? (
          <CustomerForm editingCustomer={editingCustomer} />
        ) : (
          <div className="p-4 text-red-500 text-center font-semibold">
            Không tìm thấy form: {typeForm}
          </div>
        )}
      </div>

    </div>
  );
}
