import { useState, useEffect, useCallback } from "react";
// TODO: when backend is ready, taskService.js already has the right shape –
// just swap its internals from mockXxx to real authClient calls.
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../service/taskService";

const PAGE_SIZE = 10;
const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

const sortTasks = (arr) =>
  [...arr].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : Infinity;
    const db = b.date ? new Date(b.date).getTime() : Infinity;
    if (da !== db) return da - db;
    return (PRIORITY_WEIGHT[b.priority] ?? 0) - (PRIORITY_WEIGHT[a.priority] ?? 0);
  });

/**
 * Encapsulates all task state + CRUD.
 * Architecture: Page -> useTasks -> taskService -> taskMock (in-memory)
 * When backend is ready, update taskService.js to use authClient – no changes needed here.
 */
const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, size: PAGE_SIZE, totalPages: 1, totalElements: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch paginated tasks
  const fetchTasks = useCallback(
    async (p = page) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTasks(p, PAGE_SIZE);
        const { content, meta: m } = res.data ?? res;
        setTasks(sortTasks(content ?? []));
        setMeta(m ?? {});
      } catch (err) {
        setError(err.message ?? "Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => { fetchTasks(page); }, [page]);

  /** Fetch a single task by id (used by EditTask page) */
  const fetchTaskById = async (id) => {
    const res = await getTaskById(id);
    return res.data ?? res;
  };

  /** Create: prepend to local list, no re-fetch. Returns created task. */
  const handleCreate = async (data) => {
    const res = await createTask(data);
    const newTask = res.data ?? res;
    setTasks((prev) => sortTasks([newTask, ...prev]));
    setMeta((prev) => ({ ...prev, totalElements: (prev.totalElements ?? 0) + 1 }));
    return newTask;
  };

  /** Update in-place, no re-fetch. Returns updated task. */
  const handleUpdate = async (id, data) => {
    const res = await updateTask(id, data);
    const updated = res.data ?? res;
    setTasks((prev) => sortTasks(prev.map((t) => (t.id === updated.id ? updated : t))));
    return updated;
  };

  /** Delete with optimistic local removal. */
  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => sortTasks(prev.filter((t) => t.id !== id)));
  };

  /** Inline status toggle - optimistic, rolls back on failure. */
  const handleStatusUpdate = (id, status) => {
    setTasks((prev) => sortTasks(prev.map((t) => (t.id === id ? { ...t, status } : t))));
    updateTask(id, { status }).catch(() => fetchTasks(page));
  };

  // Legacy aliases so existing Tasks.jsx keeps working without changes
  const createTaskHandler = handleCreate;
  const updateTaskHandler = handleUpdate;
  const deleteTaskHandler = handleDelete;
  const updateStatusHandler = handleStatusUpdate;

  const handlePageChange = (next) => {
    if (next < 1 || next > (meta.totalPages ?? 1)) return;
    setPage(next);
  };

  return {
    tasks, loading, error, page, meta,
    fetchTasks, fetchTaskById,
    handleCreate, handleUpdate, handleDelete, handleStatusUpdate,
    // legacy names:
    createTaskHandler, updateTaskHandler, deleteTaskHandler, updateStatusHandler,
    handlePageChange,
  };
};

export default useTasks;
