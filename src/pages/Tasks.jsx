import { useContext, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import TaskContext from "../contexts/TaskContext";
import TaskHeader from "../components/TaskHeader";
import TaskFormModal from "../components/TaskFormModal";
import TaskTable from "../components/TaskTable";
import TaskRow from "../components/TaskRow";
import DeleteTaskModal from "../components/DeleteTaskModal";

// Table column definitions
const TASK_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "schedule", label: "Timeline" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

// Helper UI
const FilterDropdown = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap">
    {label}
    <ChevronDown size={14} className="text-slate-500 shrink-0" />
  </button>
);

// Page
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
  } = useContext(TaskContext);

  const [search, setSearch] = useState("");
  // undefined = closed | null = create | Task object = edit
  const [modalTask, setModalTask] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // "list" | "kanban"
  const [view, setView] = useState("list");

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEditClick = async (task) => {
    // Set partial task to open modal in loading state
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
      {/* Create / Edit form modal */}
      <TaskFormModal
        isOpen={modalTask !== undefined}
        mode={modalTask?.id ? "edit" : "create"}
        initialData={modalTask ?? undefined}
        categories={categories}
        occasions={occasions}
        onClose={() => setModalTask(undefined)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation modal */}
      <DeleteTaskModal
        isOpen={deleteTarget !== null}
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex flex-col flex-1 overflow-y-auto bg-(--color-bg-main)">
        {/* Header */}
        <TaskHeader
          currentView={view}
          onViewChange={setView}
          onCreateTask={() => setModalTask(null)}
        />

        {/* Body */}
        <div className="flex flex-col gap-6 px-8 py-6">
          {/* Search + Filters */}
          <div className="flex items-center gap-3 p-4 bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-sm) transition-colors duration-200">
            <div className="relative flex-1">
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
            <div className="flex items-center gap-3">
              <FilterDropdown label="All Timelines" />
              <FilterDropdown label="All Categories" />
              <FilterDropdown label="All Priorities" />
              <button className="w-10 h-10 flex items-center justify-center bg-(--color-bg-sidebar) rounded-xl hover:bg-(--color-border-light) transition-colors text-(--color-text-secondary)">
                <SlidersHorizontal size={16} />
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
                search
                  ? `No tasks matching "${search}".`
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
