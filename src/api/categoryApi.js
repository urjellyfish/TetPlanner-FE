import { api } from "../config/api";

export const getCategories = async () => {
  const res = await api.get("/task-categories");
  return res.data.data;
};

export const createCategory = async (payload) => {
  const res = await api.post("/task-categories", payload);
  return res.data.data;
};
