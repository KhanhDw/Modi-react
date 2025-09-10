import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useOutletContext } from "react-router-dom";
import ServiceForm from "@/components/admin/services/service-form";
import BookingForm from "@/components/admin/services/booking/booking-form";
import CustomerForm from "@/components/admin/services/customers/customer-form";

export default function DialogShowForm_Service() {
  const { showForm, typeForm, editingService, handleClose } =
    useOutletContext();

  return (
    <>
      <Dialog
        open={showForm}
        onOpenChange={(isOpen) => {
          console.log("Dialog onOpenChange:", isOpen);
          if (!isOpen) handleClose();
        }}
      >
        <DialogContent
          className={` ${!editingService && typeForm === "service" ? `min-w-[70vw]` : ``
            } min-h-[60vh] bg-white p-6 text-black shadow-2xl`}
        >
          {typeForm === "service" ? (
            editingService ? (
              <ArticleDetailModal dataArticle={editingService} />
            ) : (
              <ServiceForm />
            )
          ) : typeForm === "booking" ? (
            <BookingForm editingBooking={editingBooking} />
          ) : typeForm === "customer" ? (
            <CustomerForm editingCustomer={editingCustomer} />
          ) : (
            <p>Not found form - typeForm: {typeForm}</p>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}
