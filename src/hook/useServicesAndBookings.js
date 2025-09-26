// src/hooks/useServicesAndBookings.js
import { useState, useEffect } from "react";
import { ServiceAPI } from "@/api/serviceAPI";
import { BookingAPI } from "@/api/bookingAPI";

export default function useServicesAndBookings() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const res = await fetch(ServiceAPI.getALL());
            const data = await res.json();
            setServices(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            console.error("Lỗi lấy dịch vụ:", err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch(BookingAPI.getALL());
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
            console.log("90900::::", data);
        } catch (err) {
            console.error("Lỗi lấy booking:", err);
        }
    };

    useEffect(() => {
        Promise.all([fetchServices(), fetchBookings()]).finally(() =>
            setLoading(false)
        );
    }, []);

    return { services, bookings, loading, fetchServices, fetchBookings };
}
