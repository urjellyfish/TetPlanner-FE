
import {
  mockGetTasks,
  mockGetTaskById,
  mockCreateTask,
  mockUpdateTask,
  mockDeleteTask,
} from "../mocks/taskMock";

/**
 * GET /tasks?page=1&size=10
 * @param {number} page  1-based page index
 * @param {number} size  items per page
 * @returns {Promise<{ content: Task[], meta: PageMeta }>}
 */
export const getTasks = (page = 1, size = 10) => mockGetTasks(page, size);

/**
 * GET /tasks/:id
 * @param {number} id
 * @returns {Promise<Task>}
 */
export const getTaskById = (id) => mockGetTaskById(id);

/**
 * POST /tasks
 * @param {{ title: string, category: string, priority: string, status: string }} payload
 * @returns {Promise<Task>}
 */
export const createTask = (payload) => mockCreateTask(payload);

/**
 * PUT /tasks/:id
 * @param {number} id
 * @param {{ title: string, category: string, priority: string, status: string }} payload
 * @returns {Promise<Task>}
 */
export const updateTask = (id, payload) => mockUpdateTask(id, payload);

/**
 * DELETE /tasks/:id
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteTask = (id) => mockDeleteTask(id);

