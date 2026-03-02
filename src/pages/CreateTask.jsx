import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";
import { TaskForm } from "../components/TaskFormModal";
import NotificationModal from "../components/NotificationModal";
import useTask from "../hooks/useTask";

// ── Page ───────────────────────────────────────────────────────────────────────────────
export default function CreateTask() {
  const navigate = useNavigate();
  const { handleCreate, handleDelete } = useTask();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTask, setCreatedTask] = useState(null); // null = show form

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const task = await handleCreate(data);
      setCreatedTask(task);
    } catch {
      // Error already toasted by TaskProvider — stay on form
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndo = async () => {
    if (!createdTask) return;
    try {
      await handleDelete(createdTask.id);
    } catch {
      /* ignore */
    }
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
            Your new task{" "}
            <span className="font-bold">"{createdTask.title}"</span> has been
            added to your Tết schedule. You're one step closer to a perfect
            celebration!
          </>
        }
        onClose={() => navigate("/tasks")}
        actions={[
          {
            label: "Undo",
            icon: RotateCcw,
            onClick: handleUndo,
            variant: "secondary",
          },
          {
            label: "Add Another Task",
            icon: Plus,
            onClick: handleAddAnother,
            variant: "primary",
          },
        ]}
      />
    );
  }

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
      {/* Card (w-144 = exactly 576px) */}
      <div className="w-xl bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-lg) overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 bg-(--gradient-primary)">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Plus size={24} className="text-(--color-text-inverse)" />
              <h1 className="text-2xl font-bold text-(--color-text-inverse)">
                Add New Task
              </h1>
            </div>
            <p className="text-sm text-(--color-text-inverse)/80">
              Plan ahead for a prosperous New Year.
            </p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-(--color-text-inverse)/20 text-(--color-text-inverse) hover:bg-(--color-text-inverse)/30 transition"
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
