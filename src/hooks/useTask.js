import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskById,
} from "../api/taskApi";
import { getCategories } from "../api/categoryApi";
import { getOccasions } from "../api/occasionApi";

/**
 * useTask — low-level hook that owns all task state and API calls.
 * Consumed by TaskProvider to expose via context.
 */
export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, categoriesData, occasionsData] = await Promise.all([
        getTasks(),
        getCategories(),
        getOccasions(),
      ]);
      setTasks(tasksData ?? []);
      setCategories(categoriesData ?? []);
      setOccasions(occasionsData ?? []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
      console.error("Fetch data failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data ?? []);
    } catch (error) {
       toast.error(error.response?.data?.message || "Fetch tasks failed");
    } finally {
      setLoading(false);
    }
  };

  const mapToBackendPayload = (payload) => {
    return {
      title: payload.title,
      description: payload.description,
      priority: payload.priority?.toUpperCase() || "LOW",
      status: payload.status || "TODO",
      categoryId: payload.category_id ? Number(payload.category_id) : null,
      occasionId: payload.occasion_id || null, // UI might not have it yet
      startDate: payload.start_date || null,
      startTime: payload.start_time ? payload.start_time + ":00" : null,
      dueDate: payload.due_date || null,
      dueTime: payload.due_time ? payload.due_time + ":00" : null,
      categoryIdProvided: payload.category_id !== undefined,
      occasionIdProvided: payload.occasion_id !== undefined
    };
  };

  const mapTaskFromBackendItem = (item) => {
    // Map backend item to frontend states correctly (if required), but typically
    // we can return it raw as long as table column accesses are correct.
    return {
      ...item,
      // The frontend uses categoryName / timelineLabel
    }
  }

  const fetchTaskById = async (id) => {
    try {
      return await getTaskById(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load task details");
      throw error;
    }
  };

  const handleCreate = async (payload) => {
    try {
      const backendPayload = mapToBackendPayload(payload);
      const newTask = await createTask(backendPayload);
      await fetchTasks();
      toast.success("Task created successfully!");
      return newTask;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
      throw error;
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const backendPayload = mapToBackendPayload(payload);
      const updated = await updateTask(id, backendPayload);
      await fetchTasks();
      toast.success("Task updated successfully!");
      return updated;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
      throw error;
    }
  };

  const handleStatusChange = async (id, status) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTaskStatus(id, status);
      toast.success("Status updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
      setTasks(originalTasks);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    tasks,
    categories,
    occasions,
    loading,
    fetchTasks,
    fetchTaskById,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
  };
};

export default useTask;
