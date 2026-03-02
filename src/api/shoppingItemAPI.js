import { api } from "../config/api";

const BASE_URL = "/shopping-items";

export const shoppingItemAPI = {
  // GET ITEMS BY BUDGET
  getItemsByBudget: async (budgetId, page = 0, size = 10) => {
    const response = await api.get(`${BASE_URL}/budget/${budgetId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // POST
  createItem: async (itemData) => {
    const response = await api.post(BASE_URL, itemData);
    return response.data;
  },

  // PUT
  updateItem: async (itemId, updateData) => {
    const response = await api.put(`${BASE_URL}/${itemId}`, updateData);
    return response.data;
  },

  // GET DETAIL
  getItemDetail: async (itemId) => {
    const response = await api.get(`${BASE_URL}/${itemId}`);
    return response.data;
  },

  // DELETE
  deleteItem: async (itemId) => {
    const response = await api.delete(`${BASE_URL}/${itemId}`);
    return response.data;
  },
};

