export const BASE_URL = import.meta.env.VITE_MAIN_BE_URL + "/api";

export const ENDPOINT = {
  services: "/services",
  bookings: "/bookings",
  upload: "/upload",
  customers: "/customers",
};


import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
