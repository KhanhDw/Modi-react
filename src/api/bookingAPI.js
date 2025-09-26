import { BASE_URL, ENDPOINT } from "../api/config";

const bookingUrl = BASE_URL + ENDPOINT.bookings;

export const BookingAPI = {
  getALL: () => `${bookingUrl}`,
  create: () => `${bookingUrl}`,
  edit: (id) => `${bookingUrl}/${id}`,
  delete: (id) => `${bookingUrl}/${id}`,
  getCountBeforeAndCurrentMonth: () => `${bookingUrl}/stats/count`,
  getRevenueBeforeAndCurrentMonth: () => `${bookingUrl}/stats/revenue`,
};
