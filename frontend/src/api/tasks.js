import api from "./axios";

export const getTasks = async () => {
  const response = await api.get("tasks/");
  return Array.isArray(response.data)
    ? response.data
    : (response.data.results ?? []);
};

export const getTask = async (id) => {
  const response = await api.get(`tasks/${id}/`);
  return response.data;
};

export const createTask = async (payload) => {
  const response = await api.post("tasks/", payload);
  return response.data;
};

export const updateTask = async (id, payload) => {
  const response = await api.patch(`tasks/${id}/`, payload);
  return response.data;
};

export const deleteTask = (id) => api.delete(`tasks/${id}/`);
