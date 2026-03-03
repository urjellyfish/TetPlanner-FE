import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  Search,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import TaskHeader from "../components/task/TaskHeader";
import TaskTable from "../components/task/TaskTable";
import TaskRow from "../components/task/TaskRow";
import TaskFormModal from "../components/task/TaskFormModal";
import DeleteTaskModal from "../components/task/DeleteTaskModal";
import useTask from "../hooks/useTask";
import ManageTaskCategoryModal from "../components/task/ManageTaskCategoryModal";
import { toast } from "react-toastify";

// Table column definitions
const TASK_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "schedule", label: "Timeline" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

// ── NÂNG CẤP FilterDropdown ───────────────────────────────────────────────────
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
          value !== "ALL"
            ? "bg-(--color-primary-500)/10 text-(--color-primary-600)"
            : "bg-slate-50 text-slate-800 hover:bg-slate-100"
        }`}
      >
        {selectedOption ? selectedOption.label : label}
        <ChevronDown size={14} className="opacity-50 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 min-w-[160px] bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => {
              onChange("ALL");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
              value === "ALL"
                ? "font-bold text-(--color-primary-600)"
                : "text-slate-700 font-medium"
            }`}
          >
            {label}
          </button>
          <div className="h-px bg-slate-100 my-1"></div>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
                value === opt.value
                  ? "font-bold text-(--color-primary-600)"
                  : "text-slate-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const Tasks = () => {
  const {
    tasks,
    categories,
    occasions,
    loading,
    fetchTaskById,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
  } = useTask();

  const [search, setSearch] = useState("");
  const [modalTask, setModalTask] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState("list");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // ── 1. THÊM STATE CHO FILTERS ────────────────────────────────────────────────
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL"); // Dùng Status thay cho Timeline để dễ filter hơn

  // ── 2. CẬP NHẬT LOGIC LỌC (FILTER LOGIC) ──
  const filtered = tasks.filter((t) => {
    // Tìm kiếm theo tên (An toàn check null)
    const matchSearch = (t.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    // So sánh theo categoryName thay vì categoryId
    const matchCategory =
      filterCategory === "ALL" || t.categoryName === filterCategory;

    // So sánh Priority (Ép kiểu in hoa cho chắc chắn khớp với BE)
    const matchPriority =
      filterPriority === "ALL" ||
      (t.priority || "").toUpperCase() === filterPriority;

    // So sánh Status
    const matchStatus = filterStatus === "ALL" || t.status === filterStatus;

    return matchSearch && matchCategory && matchPriority && matchStatus;
  });

  // Hàm Reset toàn bộ filters
  const resetFilters = () => {
    setSearch("");
    setFilterCategory("ALL");
    setFilterPriority("ALL");
    setFilterStatus("ALL");
  };

  // Kiểm tra xem có đang áp dụng filter nào không (để làm nổi bật nút Reset)
  const isFiltering =
    search !== "" ||
    filterCategory !== "ALL" ||
    filterPriority !== "ALL" ||
    filterStatus !== "ALL";

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const priorityOptions = [
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
  ];
  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  const handleExport = () => {
    if (!filtered.length) {
      toast.warning("No tasks to export.");
      return;
    }

    const exportData = filtered.map((task, index) => {
      const formatStatus = (status) => {
        if (!status) return "TODO";
        if (status === "IN_PROGRESS") return "In Progress";
        if (status === "DONE") return "Done";
        return "To Do";
      };

      const formatPriority = (priority) => {
        if (priority === "high") return "High";
        if (priority === "medium") return "Medium";
        if (priority === "low") return "Low";
        return "Medium";
      };

      return {
        "No.": index + 1,
        "Task Title": task.title || "Untitled Task",
        Category: task.categoryName || "No Category",
        Timeline: task.timelineLabel || "N/A",
        Status: formatStatus(task.status),
        Priority: formatPriority(task.priority),
        "Start Date": task.start_date || "N/A",
        "Due Date": task.due_date || "N/A",
        Description: task.description || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    XLSX.writeFile(workbook, "Tet_Preparation_Tasks.xlsx");
    toast.success("Exported tasks to Excel successfully!");
  };

  const handleEditClick = async (task) => {
    setModalTask({ id: task.id, _isLoading: true });
    try {
      const fullTask = await fetchTaskById(task.id);
      setModalTask(fullTask);
    } catch {
      setModalTask(undefined);
    }
  };

  const handleFormSubmit = async (form) => {
    if (modalTask?.id) {
      await handleUpdate(modalTask.id, form);
      setModalTask(undefined);
    } else {
      await handleCreate(form);
      setModalTask(undefined);
    }
  };

  const handleDeleteConfirm = async () => {
    const deleted = deleteTarget;
    setDeleteTarget(null);
    await handleDelete(deleted.id);
  };

  return (
    <>
      <ManageTaskCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
      <TaskFormModal
        isOpen={modalTask !== undefined}
        mode={modalTask?.id ? "edit" : "create"}
        initialData={modalTask ?? undefined}
        categories={categories}
        occasions={occasions}
        onClose={() => setModalTask(undefined)}
        onSubmit={handleFormSubmit}
      />
      <DeleteTaskModal
        isOpen={deleteTarget !== null}
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex flex-col flex-1 overflow-y-auto bg-(--color-bg-main)">
        <TaskHeader
          currentView={view}
          onViewChange={setView}
          onCreateTask={() => setModalTask(null)}
          onManageCategories={() => setIsCategoryModalOpen(true)}
          onExport={handleExport}
        />

        <div className="flex flex-col gap-6 px-8 py-6">
          {/* Search + Filters */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-sm) transition-colors duration-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-(--color-bg-sidebar) rounded-xl text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:ring-2 focus:ring-(--color-primary-500)/20 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <FilterDropdown
                label="All Categories"
                options={categoryOptions}
                value={filterCategory}
                onChange={setFilterCategory}
              />
              <FilterDropdown
                label="All Priorities"
                options={priorityOptions}
                value={filterPriority}
                onChange={setFilterPriority}
              />
              <FilterDropdown
                label="All Statuses"
                options={statusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
              />

              {/* Nút Reset Filters */}
              <button
                onClick={resetFilters}
                title="Reset Filters"
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                  isFiltering
                    ? "bg-(--color-primary-500)/10 text-(--color-primary-600) hover:bg-(--color-primary-500)/20"
                    : "bg-(--color-bg-sidebar) text-(--color-text-secondary) hover:bg-(--color-border-light)"
                }`}
              >
                {isFiltering ? (
                  <RotateCcw size={16} />
                ) : (
                  <SlidersHorizontal size={16} />
                )}
              </button>
            </div>
          </div>

          {/* ── List View ── */}
          {view === "list" && (
            <TaskTable
              columns={TASK_COLUMNS}
              data={filtered}
              loading={loading}
              emptyMessage={
                search || isFiltering
                  ? "No tasks match your filters."
                  : "No tasks yet. Create your first one!"
              }
              renderRow={(task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={handleEditClick}
                  onDelete={(t) => setDeleteTarget(t)}
                  onStatusChange={handleStatusChange}
                />
              )}
              pagination={
                <div className="px-6 py-4">
                  <p className="text-sm text-(--color-text-secondary)">
                    Showing{" "}
                    <span className="font-bold text-(--color-text-primary)">
                      {filtered.length}
                    </span>{" "}
                    task{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
              }
            />
          )}

          {/* ── Kanban View ── */}
          {view === "kanban" && (
            <KanbanBoard
              tasks={filtered}
              onEdit={handleEditClick}
              onDelete={(t) => setDeleteTarget(t)}
              onAddTask={() => setModalTask(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
