import BookingForm from "@/components/admin/services/booking/booking-form";
import CustomerForm from "@/components/admin/services/customers/customer-form";
import ServiceForm from "@/components/admin/services/service-form";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useOutletContext } from "react-router-dom";

export default function DialogShowForm_Service() {
  const { showForm, typeForm, editingBooking, editingCustomer, handleClose } =
    useOutletContext();

  return (
    <Dialog
      open={showForm}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
      className="p-0 m-0"
    >
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogContent showCloseButton={false}
        className={`${typeForm === "service" ? "min-w-[55vw] bg-transparent rounded-md border-none" : ""
          } min-h-[60vh] p-0 m-0 max-w-xl w-full bg-transparent rounded-md border-none`}
      >
        {typeForm === "service" ? (
          <ServiceForm />
        ) : typeForm === "booking" ? (
          <BookingForm editingBooking={editingBooking} />
        ) : typeForm === "customer" ? (
          <CustomerForm editingCustomer={editingCustomer} />
        ) : (
          <p>Not found form - typeForm: {typeForm}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
