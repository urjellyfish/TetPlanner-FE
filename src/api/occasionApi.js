import { api } from "../config/api";

export const getOccasions = async () => {
  const res = await api.get("/occasions");
  return res.data.data;
};

export const createOccasion = async (payload) => {
  const res = await api.post("/occasions", payload);
  return res.data.data;
};

export const updateOccasion = async (id, payload) => {
  const res = await api.put(`/occasions/${id}`, payload);
  return res.data.data;
};

export const deleteOccasion = async (id) => {
  const res = await api.delete(`/occasions/${id}`);
  return res.data.success;
};
