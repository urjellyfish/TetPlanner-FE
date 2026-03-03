import { api } from "../config/api";

export const occasionAPI = {
  // GET /api/occasions
  getOccasions: async () => {
    const response = await api.get("/occasions");
    return response.data;
  },

  // GET /api/occasions/{id}
  getOccasionDetail: async (id) => {
    const response = await api.get(`/occasions/${id}`);
    return response.data;
  },

  // POST /api/occasions
  createOccasion: async (occasionData) => {
    const response = await api.post("/occasions", occasionData);
    return response.data;
  },

  // PUT /api/occasions/{id}
  updateOccasion: async (id, occasionData) => {
    const response = await api.put(`/occasions/${id}`, occasionData);
    return response.data;
  },

  // DELETE /api/occasions/{id}
  deleteOccasion: async (id) => {
    const response = await api.delete(`/occasions/${id}`);
    return response.data;
  },
};

export const {
  getOccasions,
  getOccasionsByRange,
  getOccasionDetail,
  createOccasion,
  updateOccasion,
  deleteOccasion,
} = occasionAPI;
