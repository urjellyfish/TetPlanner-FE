import { api } from "../config/api";

// GET /api/occasions
export const getOccasions = async () => {
  const response = await api.get("/occasions");
  return response.data;
};

// GET /api/occasions/{id}
export const getOccasionDetail = async (id) => {
  const response = await api.get(`/occasions/${id}`);
  return response.data;
};

// POST /api/occasions
export const createOccasion = async (occasionData) => {
  const response = await api.post("/occasions", occasionData);
  return response.data;
};

// PUT /api/occasions/{id}
export const updateOccasion = async (id, occasionData) => {
  const response = await api.put(`/occasions/${id}`, occasionData);
  return response.data;
};

// DELETE /api/occasions/{id}
export const deleteOccasion = async (id) => {
  const response = await api.delete(`/occasions/${id}`);
  return response.data;
};

export const occasionAPI = {
  getOccasions,
  getOccasionDetail,
  createOccasion,
  updateOccasion,
  deleteOccasion,
};
