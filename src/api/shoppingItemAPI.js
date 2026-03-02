import { api } from "../config/api";

const BASE_URL = "/shopping-items";

// GET ITEMS BY BUDGET
export const getItemsByBudget = async (budgetId, page = 0, size = 10) => {
  const response = await api.get(`${BASE_URL}/budget/${budgetId}`, {
    params: { page, size },
  });
  return response.data;
};

// POST
export const createItem = async (itemData) => {
  const response = await api.post(BASE_URL, itemData);
  return response.data;
};

// PUT
export const updateItem = async (itemId, updateData) => {
  const response = await api.put(`${BASE_URL}/${itemId}`, updateData);
  return response.data;
};

// GET DETAIL
export const getItemDetail = async (itemId) => {
  const response = await api.get(`${BASE_URL}/${itemId}`);
  return response.data;
};

// DELETE
export const deleteItem = async (itemId) => {
  const response = await api.delete(`${BASE_URL}/${itemId}`);
  return response.data;
};

export const shoppingItemAPI = {
  getItemsByBudget,
  createItem,
  updateItem,
  getItemDetail,
  deleteItem,
};

