import KpiCards from "@/components/admin/dashboard/KpiCards";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import VisitorChart from "@/components/admin/dashboard/VisitorChart";
import OrderNeedToDone from "@/components/admin/dashboard/OrderNeedToDone";
import MostViewedProducts from "@/components/admin/dashboard/MostViewedProducts";
import { useState, useEffect } from "react";
import { BookingAPI } from "@/api/bookingAPI";
import { Outlet } from "react-router-dom";
export default function DashboardPage() {
  const [contacts, setContacts] = useState(null);
  const [contactsLastMonth, setContactsLastMonth] = useState(null);

  const [bookingCount, setBookingCount] = useState({
    totalCurrent: 0,
    totalBefore: 0,
  });

  const [bookingRevenue, setBookingRevenue] = useState({
    revenueCurrent: 0,
    revenueBefore: 0,
  });

  const [visits, setVisits] = useState(null);
  const [visitsLastMonth, setVisitsLastMonth] = useState(null);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(BookingAPI.getALL());
        if (res.ok) {
          const data = await res.json();
          setBookings(Array.isArray(data) ? data : []);
        } else {
          throw new Error("Error when getting booking data");
        }
      } catch (err) {
        console.error("Error: ", err);
      }
    };
    fetchBooking();
  }, []);
  // =============================
  // tính lượt liên hệ trong tháng
  // =============================
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const url = `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/lienhe/month/total`;
        const urlLastMonth = `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/lienhe/before-current-month/total`;

        const [res, resLast] = await Promise.all([
          fetch(url),
          fetch(urlLastMonth),
        ]);
        const data = await res.json();
        const dataLast = await resLast.json();

        setContacts(data.total);
        setContactsLastMonth(dataLast.total);

        console.log(data.tatal, dataLast.total);
      } catch (err) {
        console.error("Lỗi khi fetch liên hệ:", err);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const [resCount, resRevenue] = await Promise.all([
          fetch(BookingAPI.getCountBeforeAndCurrentMonth()),
          fetch(BookingAPI.getRevenueBeforeAndCurrentMonth()),
        ]);
        const dataCount = await resCount.json();
        const dataRevenue = await resRevenue.json();
        setBookingCount(dataCount);
        setBookingRevenue(dataRevenue);
      } catch (err) {
        console.error("Error fetching booking count or booking revenue:", err);
      }
    };

    fetchBooking();
  }, []);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const url = `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/site/visits/month/total`;
        const urlLastMonth = `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/site/visits/before-current-month/total`;

        const [res, resLast] = await Promise.all([
          fetch(url),
          fetch(urlLastMonth),
        ]);
        const data = await res.json();
        const dataLast = await resLast.json();

        setVisits(data.total);
        setVisitsLastMonth(dataLast.total);
      } catch (err) {
        console.error("Lỗi khi fetch visits:", err);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div className="flex bg-white admin-dark:bg-gray-900">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <KpiCards
            contacts={contacts}
            contactsLastMonth={contactsLastMonth}
            bookingCount={bookingCount}
            bookingRevenue={bookingRevenue}
            visits={visits}
            visitsLastMonth={visitsLastMonth}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart bookings={bookings} />
            <VisitorChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderNeedToDone bookings={bookings} />
            <MostViewedProducts />
          </div>
        </main>
      </div>
    </div>
  );
}
