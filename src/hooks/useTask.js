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
import { useDeferredAction } from "./useDeferredAction.jsx";

/**
 * useTask — low-level hook that owns all task state and API calls.
 * Consumed by TaskProvider to expose via context.
 *
 * UPDATE / DELETE / STATUS CHANGE now use a 5-second deferred pattern:
 *   - UI updates immediately (optimistic)
 *   - An "Undo" toast appears for 5 seconds
 *   - If the user does NOT undo, the API call fires
 *   - If the user clicks "Undo", the UI reverts and no API call is made
 */
export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { scheduleAction } = useDeferredAction();

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, categoriesData, occasionsData] = await Promise.all([
        getTasks(),
        getCategories(),
        getOccasions(),
      ]);
      setTasks(tasksData ?? []);
      setCategories(categoriesData?.data ?? []);
      setOccasions(occasionsData?.data ?? []);
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
      occasionIdProvided: payload.occasion_id !== undefined,
    };
  };

  const fetchTaskById = async (id) => {
    try {
      return await getTaskById(id);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load task details",
      );
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

  /**
   * handleUpdate — optimistically merges the update into local state,
   * shows undo toast for 5s, then calls the API.
   */
  const handleUpdate = async (id, payload) => {
    const originalTasks = [...tasks];
    const backendPayload = mapToBackendPayload(payload);

    return new Promise((resolve, reject) => {
      scheduleAction({
        actionKey: `update-task-${id}`,
        toastMessage: "Task updated – Undo?",
        onOptimistic: () => {
          // Merge changes into the task list immediately
          setTasks((prev) =>
            prev.map((t) =>
              t.id === id ? { ...t, ...backendPayload, ...payload } : t,
            ),
          );
        },
        actionFn: async () => {
          const updated = await updateTask(id, backendPayload);
          await fetchTasks(); // re-sync from server
          return updated;
        },
        onCommitted: () => {
          resolve();
        },
        onUndo: () => {
          setTasks(originalTasks);
          toast.info("Update undone.");
          resolve(); // resolve without error so caller isn't stuck
        },
        onError: (err) => {
          setTasks(originalTasks);
          toast.error(err.response?.data?.message || "Failed to update task");
          reject(err);
        },
      });
    });
  };

  /**
   * handleDelete — removes the task from UI immediately,
   * shows undo toast for 5s, then calls DELETE API.
   */
  const handleDelete = async (id) => {
    const originalTasks = [...tasks];

    return new Promise((resolve, reject) => {
      scheduleAction({
        actionKey: `delete-task-${id}`,
        toastMessage: "Task deleted – Undo?",
        onOptimistic: () => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
        },
        actionFn: () => deleteTask(id),
        onCommitted: () => {
          resolve();
        },
        onUndo: () => {
          setTasks(originalTasks);
          toast.info("Delete undone.");
          resolve();
        },
        onError: (err) => {
          setTasks(originalTasks);
          toast.error(err.response?.data?.message || "Failed to delete task");
          reject(err);
        },
      });
    });
  };

  /**
   * handleStatusChange — optimistically flips the status,
   * shows undo toast for 5s, then calls PATCH API.
   */
  const handleStatusChange = async (id, status) => {
    const originalTasks = [...tasks];

    scheduleAction({
      actionKey: `status-task-${id}`,
      toastMessage: "Status updated – Undo?",
      onOptimistic: () => {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t)),
        );
      },
      actionFn: () => updateTaskStatus(id, status),
      onCommitted: () => {
        // Status is already correct in local state
      },
      onUndo: () => {
        setTasks(originalTasks);
        toast.info("Status change undone.");
      },
      onError: (err) => {
        setTasks(originalTasks);
        toast.error(err.response?.data?.message || "Status update failed");
      },
    });
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
