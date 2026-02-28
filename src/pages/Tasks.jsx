import { useState } from "react";
import {
  Plus,
  Search,
  Download,
  Tag,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import useTasks from "../hooks/useTasks";
import NotificationModal  from "../components/NotificationModal";
import TaskFormModal      from "../components/task/TaskFormModal";
import TaskTable          from "../components/task/TaskTable";
import TaskRow            from "../components/task/TaskRow";
import DeleteTaskModal    from "../components/task/DeleteTaskModal";

// Table column definitions
const TASK_COLUMNS = [
  { key: "title",    label: "Title" },
  { key: "category", label: "Category" },
  { key: "date",     label: "Due Date" },
  { key: "priority", label: "Priority" },
  { key: "status",   label: "Status" },
  { key: "actions",  label: "Actions", align: "right" },
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
    loading,
    error,
    page,
    meta,
    fetchTasks,
    createTaskHandler,
    updateTaskHandler,
    updateStatusHandler,
    deleteTaskHandler,
    handlePageChange,
  } = useTasks();

  const [search,       setSearch]       = useState("");
  // undefined = closed | null = create | Task object = edit
  const [modalTask,    setModalTask]    = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // null = hidden | { task } = show success notification
  const [notif,        setNotif]        = useState(null);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormSubmit = async (form) => {
    if (modalTask?.id) {
      const prevTask = { ...modalTask };
      const updated  = await updateTaskHandler(modalTask.id, form);
      setNotif({ type: "edit", task: updated, prevTask });
    } else {
      const created = await createTaskHandler(form);
      setNotif({ type: "create", task: created });
    }
  };

  const handleDeleteConfirm = async () => {
    const deleted = deleteTarget;
    setDeleteTarget(null);
    await deleteTaskHandler(deleted.id);
    setNotif({ type: "delete", task: deleted });
  };

  return (
    <>
      {/* Create / Edit form modal */}
      <TaskFormModal
        isOpen={modalTask !== undefined}
        mode={modalTask?.id ? "edit" : "create"}
        initialData={modalTask ?? undefined}
        onClose={() => setModalTask(undefined)}
        onSubmit={handleFormSubmit}
      />

      {/* Create success notification */}
      {notif?.type === "create" && (
        <NotificationModal
          type="success"
          title="Task Created Successfully!"
          message={
            <>
              Your new task{" "}
              <span className="font-bold">"{notif.task?.title}"</span>{" "}
              has been added to your Tết schedule.
            </>
          }
          onClose={() => setNotif(null)}
          actions={[
            {
              label: "Undo",
              icon: RotateCcw,
              variant: "secondary",
              onClick: async () => {
                if (notif.task) await deleteTaskHandler(notif.task.id);
                setNotif(null);
              },
            },
            {
              label: "Add Another Task",
              icon: Plus,
              variant: "primary",
              onClick: () => { setNotif(null); setModalTask(null); },
            },
          ]}
        />
      )}

      {/* Edit success notification */}
      {notif?.type === "edit" && (
        <NotificationModal
          type="success"
          title="Task Updated Successfully!"
          message={
            <>
              <span className="font-bold">"{notif.task?.title}"</span>{" "}
              has been updated.
            </>
          }
          onClose={() => setNotif(null)}
          actions={[
            {
              label: "Undo",
              icon: RotateCcw,
              variant: "secondary",
              onClick: async () => {
                if (notif.prevTask) await updateTaskHandler(notif.prevTask.id, notif.prevTask);
                setNotif(null);
              },
            },
          ]}
        />
      )}

      {/* Delete success notification */}
      {notif?.type === "delete" && (
        <NotificationModal
          type="success"
          title="Task Deleted"
          message={
            <>
              <span className="font-bold">"{notif.task?.title}"</span>{" "}
              has been removed from your schedule.
            </>
          }
          onClose={() => setNotif(null)}
          actions={[
            {
              label: "Undo",
              icon: RotateCcw,
              variant: "secondary",
              onClick: async () => {
                if (notif.task) await createTaskHandler(notif.task);
                setNotif(null);
              },
            },
          ]}
        />
      )}

      {/* Delete confirmation modal */}
      <DeleteTaskModal
        isOpen={deleteTarget !== null}
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex flex-col flex-1 overflow-y-auto bg-slate-50 font-['Plus_Jakarta_Sans']">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Tet Preparation Tasks
            </h1>
            <p className="text-sm text-slate-500">
              Year of the Horse 2026 &bull; BINH NGO
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 transition-colors text-sm font-semibold">
                <LayoutGrid size={14} />
                Kanban
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white shadow-sm text-rose-600 text-sm font-semibold">
                <List size={14} />
                List
              </button>
            </div>
            <button
              onClick={() => setModalTask(null)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium shadow-[0_4px_6px_0_rgba(225,29,72,0.2)] transition-colors"
            >
              <Plus size={14} />
              New Task
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 px-8 py-6">
          {/* Action row */}
          <div className="flex items-center justify-end gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 transition-colors">
              <Tag size={16} />
              Manage Categories
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-rose-200 transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <FilterDropdown label="All Timelines" />
              <FilterDropdown label="All Categories" />
              <FilterDropdown label="All Priorities" />
              <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => fetchTasks()}
                className="ml-auto text-xs font-semibold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Task Table */}
          <TaskTable
            columns={TASK_COLUMNS}
            data={filtered}
            loading={loading}
            emptyMessage={search ? `No tasks matching "${search}".` : "No tasks yet. Create your first one!"}
            renderRow={(task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={(t) => setModalTask(t)}
                onDelete={(t) => setDeleteTarget(t)}
                onStatusChange={updateStatusHandler}
              />
            )}
            pagination={
              <div className="flex items-center justify-between px-6 py-4">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-600">{filtered.length}</span> of{" "}
                  <span className="font-bold text-slate-600">{meta.totalElements ?? 0}</span>{" "}
                  task{meta.totalElements !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || loading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-500 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-slate-600 font-medium">
                    {page} / {meta.totalPages ?? 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= (meta.totalPages ?? 1) || loading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-500 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Tasks;