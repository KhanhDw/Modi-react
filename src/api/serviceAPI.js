import { BASE_URL, ENDPOINT } from "../api/config";

const serviceUrl = BASE_URL + ENDPOINT.services;
const uploadUrl = BASE_URL + ENDPOINT.upload;

export const ServiceAPI = {
  getALL: () => `${serviceUrl}`,
  create: () => `${serviceUrl}`,
  delete: (id) => `${serviceUrl}/${id}`,
  edit: (id) => `${serviceUrl}/${id}`,
};

export const UploadAPI = {
  uploadImg: () => `${uploadUrl}`,
};


