import { api } from "../config/api";

 //GET /api/tasks
export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data.data;
};

 // GET /api/tasks/{id}
export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data.data;
};

 // POST /api/tasks
export const createTask = async (payload) => {
  const res = await api.post("/tasks", payload);
  return res.data.data;
};

 // PUT /api/tasks/{id}
export const updateTask = async (id, payload) => {
  const res = await api.put(`/tasks/${id}`, payload);
  return res.data.data;
};

 // PATCH /api/tasks/{id}
 // Update status only
export const updateTaskStatus = async (id, status) => {
  const res = await api.patch(`/tasks/${id}`, { status });
  return res.data.data;
};

 // DELETE /api/tasks/{id}
export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data.success;
};