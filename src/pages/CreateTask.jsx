
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";
import { TaskForm } from "../components/task/TaskFormModal";
import NotificationModal from "../components/NotificationModal";
import useTasks from "../hooks/useTasks";

// ── Page ───────────────────────────────────────────────────────────────────────
export default function CreateTask() {
  const navigate = useNavigate();
  // TODO: replace with real service when backend is ready (no changes needed here)
  const { handleCreate, handleDelete } = useTasks();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTask,  setCreatedTask]  = useState(null); // null = show form

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const task = await handleCreate(data);
      setCreatedTask(task);
    } catch (err) {
      alert("Failed to create task: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndo = async () => {
    if (!createdTask) return;
    try {
      await handleDelete(createdTask.id);
    } catch {/* ignore */}
    navigate("/tasks");
  };

  const handleAddAnother = () => setCreatedTask(null);

  if (createdTask) {
    return (
      <NotificationModal
        type="success"
        title="Task Created Successfully!"
        message={
          <>
            Your new task <span className="font-bold">"{createdTask.title}"</span> has been
            added to your Tết schedule. You're one step closer to a perfect celebration!
          </>
        }
        onClose={() => navigate("/tasks")}
        actions={[
          { label: "Undo",             icon: RotateCcw, onClick: handleUndo,       variant: "secondary" },
          { label: "Add Another Task", icon: Plus,      onClick: handleAddAnother, variant: "primary"   },
        ]}
      />
    );
  }

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 overflow-y-auto py-10">
      {/* Card */}
      <div className="w-[576px] bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 bg-rose-600">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Plus size={24} className="text-white" />
              <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">Add New Task</h1>
            </div>
            <p className="text-sm text-rose-200 font-['Plus_Jakarta_Sans']">Plan ahead for a prosperous New Year.</p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="px-8 pt-8 pb-6">
          <TaskForm
            mode="create"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/tasks")}
          />
        </div>
      </div>
    </div>
  );
}
