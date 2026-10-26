import api from "./axios";

export const getSpaces = async () => {
  const response = await api.get("spaces/");
  return Array.isArray(response.data)
    ? response.data
    : (response.data.results ?? []);
};

export const getSpace = async (id) => {
  const response = await api.get(`spaces/${id}/`);
  return response.data;
};

export const createSpace = async (formData) => {
  const response = await api.post("spaces/", formData);
  return response.data;
};

export const updateSpace = async (id, formData) => {
  const response = await api.patch(`spaces/${id}/`, formData);
  return response.data;
};

export const deleteSpace = (id) => api.delete(`spaces/${id}/`);
