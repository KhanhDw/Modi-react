import { useOutletContext } from "react-router-dom";
import TopSpendingCustomers from "./BookingsByMonthChart";
import NewCustomers from "./NewCustomers";

export default function ServiceCustomerAnalytics() {
  const { initDataCustomer, initDataBooking } = useOutletContext();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <NewCustomers
          initDataCustomer={initDataCustomer}
          initDataBooking={initDataBooking}
        />
        <TopSpendingCustomers initDataCustomer={initDataCustomer} />
      </div>
    </div>
  );
}
