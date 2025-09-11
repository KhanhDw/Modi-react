import { BASE_URL, ENDPOINT } from "../api/config";

const customerUrl = BASE_URL + ENDPOINT.customers;

export const CustomerAPI = {
  getALL: () => `${customerUrl}`,
  create: () => `${customerUrl}`,
  edit: (id) => `${customerUrl}/${id}`,
  delete: (id) => `${customerUrl}/${id}`,
};
