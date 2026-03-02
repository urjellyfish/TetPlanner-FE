import { api } from "../config/api";

export const categoryAPI = {
  // GET /api/shopping-categories
  getCategories: async () => {
    const response = await api.get("/shopping-categories");
    return response.data;
  },

  // POST /api/shopping-categories
  createCategory: async (categoryData) => {
    const response = await api.post("/shopping-categories", categoryData);
    return response.data;
  },

  // PUT /api/shopping-categories/{id}
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/shopping-categories/${id}`, categoryData);
    return response.data;
  },

  // GET /api/shopping-categories/{id}
  getCategoryDetail: async (id) => {
    const response = await api.get(`/shopping-categories/${id}`);
    return response.data;
  },

  // DELETE /api/shopping-categories/{id}
  deleteCategory: async (id) => {
    const response = await api.delete(`/shopping-categories/${id}`);
    return response.data;
  },
};
