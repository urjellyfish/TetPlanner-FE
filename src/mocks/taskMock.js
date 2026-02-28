// ─── Dummy Task Data ───────────────────────────────────────────────────────────
// Replace this file with real API integration when the backend is ready.

/** Master list of task categories – import this wherever a category picker is needed. */
export const TASK_CATEGORIES = [
  "Dọn dẹp & Trang trí",
  "Ẩm thực",
  "Lễ nghi & Văn hóa",
  "Mua sắm",
  "Gia đình",
  "Phương tiện",
  "Khác",
];

const DELAY = 500; // ms – simulates network latency

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** In-memory store so create/update/delete persist within the session */
let _tasks = [
  {
    id: 1,
    title: "Dọn dẹp nhà cửa",
    category: "Dọn dẹp & Trang trí",
    priority: "Low",
    status: "Todo",
    date: "2026-02-01",
    time: "08:00",
    budget: 0,
    note: "",
  },
  {
    id: 2,
    title: "Mua hoa đào / hoa mai",
    category: "Dọn dẹp & Trang trí",
    priority: "Medium",
    status: "Todo",
    date: "2026-02-05",
    time: "09:00",
    budget: 500000,
    note: "Chọn cành đẹp, không bị rụng lá",
  },
  {
    id: 3,
    title: "Gói bánh chưng / bánh tét",
    category: "Ẩm thực",
    priority: "High",
    status: "In Progress",
    date: "2026-02-08",
    time: "06:00",
    budget: 300000,
    note: "Cần lá dong tươi",
  },
  {
    id: 4,
    title: "Chuẩn bị phong bì lì xì",
    category: "Lễ nghi & Văn hóa",
    priority: "High",
    status: "Todo",
    date: "2026-01-28",
    time: "10:00",
    budget: 2000000,
    note: "Mệnh giá: 50k, 100k, 200k",
  },
  {
    id: 5,
    title: "Mua sắm thực phẩm Tết",
    category: "Mua sắm",
    priority: "High",
    status: "In Progress",
    date: "2026-02-03",
    time: "07:00",
    budget: 3000000,
    note: "Mứt, hạt dưa, nước ngọt, bia",
  },
  {
    id: 6,
    title: "Trang trí cây thông / góc Tết",
    category: "Dọn dẹp & Trang trí",
    priority: "Low",
    status: "Done",
    date: "2026-01-25",
    time: "14:00",
    budget: 200000,
    note: "",
  },
  {
    id: 7,
    title: "Đặt lịch về quê",
    category: "Gia đình",
    priority: "High",
    status: "Done",
    date: "2026-01-20",
    time: "08:00",
    budget: 0,
    note: "Vé xe về quê ngày 27 tháng Chạp",
  },
  {
    id: 8,
    title: "Mua quà biếu cho ông bà",
    category: "Gia đình",
    priority: "Medium",
    status: "Todo",
    date: "2026-02-06",
    time: "09:30",
    budget: 1000000,
    note: "Giỏ quà, trái cây, bánh kẹo",
  },
  {
    id: 9,
    title: "Vệ sinh & bảo dưỡng xe",
    category: "Phương tiện",
    priority: "Medium",
    status: "Todo",
    date: "2026-02-04",
    time: "08:00",
    budget: 300000,
    note: "Kiểm tra dầu, lốp xe trước khi đi",
  },
  {
    id: 10,
    title: "Nấu mâm cúng tất niên",
    category: "Ẩm thực",
    priority: "High",
    status: "Todo",
    date: "2026-02-09",
    time: "11:00",
    budget: 800000,
    note: "Gà luộc, xôi gấc, canh măng, nem",
  },
  {
    id: 11,
    title: "Chụp ảnh gia đình ngày Tết",
    category: "Lễ nghi & Văn hóa",
    priority: "Low",
    status: "Todo",
    date: "2026-02-10",
    time: "10:00",
    budget: 0,
    note: "Mặc áo dài truyền thống",
  },
  {
    id: 12,
    title: "Đi chúc Tết họ hàng",
    category: "Lễ nghi & Văn hóa",
    priority: "Medium",
    status: "Todo",
    date: "2026-02-11",
    time: "08:00",
    budget: 0,
    note: "Mùng 1 chúc nội, mùng 2 chúc ngoại",
  },
];

let _nextId = _tasks.length + 1;

// ─── Mock API Functions ────────────────────────────────────────────────────────

/**
 * Get a single task by id.
 * @param {number} id
 * @returns {Promise<Task>}
 */
export const mockGetTaskById = async (id) => {
  await delay(DELAY);
  const task = _tasks.find((t) => t.id === Number(id));
  if (!task) throw new Error(`Task #${id} not found`);
  return task;
};

/**
 * Get paginated tasks.
 * @param {number} page  1-based
 * @param {number} size
 * @returns {Promise<{ content: Task[], meta: PageMeta }>}
 */
export const mockGetTasks = async (page = 1, size = 10) => {
  await delay(DELAY);
  const start = (page - 1) * size;
  const content = _tasks.slice(start, start + size);
  return {
    content,
    meta: {
      page,
      size,
      totalElements: _tasks.length,
      totalPages: Math.ceil(_tasks.length / size),
    },
  };
};

/**
 * Create a new task.
 * @param {object} data
 * @returns {Promise<Task>}
 */
export const mockCreateTask = async (data) => {
  await delay(DELAY);
  const task = {
    id: _nextId++,
    date: new Date().toISOString().split("T")[0],
    time: "",
    budget: 0,
    note: "",
    ...data,
  };
  _tasks = [..._tasks, task];
  return task;
};

/**
 * Update an existing task.
 * @param {number} id
 * @param {object} data
 * @returns {Promise<Task>}
 */
export const mockUpdateTask = async (id, data) => {
  await delay(DELAY);
  const idx = _tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`Task #${id} not found`);
  const updated = { ..._tasks[idx], ...data };
  _tasks = _tasks.map((t) => (t.id === id ? updated : t));
  return updated;
};

/**
 * Delete a task by id.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const mockDeleteTask = async (id) => {
  await delay(DELAY);
  if (!_tasks.some((t) => t.id === id)) throw new Error(`Task #${id} not found`);
  _tasks = _tasks.filter((t) => t.id !== id);
};
