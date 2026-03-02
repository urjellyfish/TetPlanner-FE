import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3 } from "lucide-react";
import { TaskForm } from "../components/TaskFormModal";
import useTask from "../hooks/useTask";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTaskById, handleUpdate } = useTask();

  const [initialValues, setInitialValues] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load task on mount
  useEffect(() => {
    (async () => {
      try {
        const task = await fetchTaskById(id);
        setInitialValues(task);
      } catch (err) {
        setLoadError(err.message ?? "Task not found");
      }
    })();
  }, [id, fetchTaskById]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await handleUpdate(id, data);
      navigate("/tasks");
    } catch {
      // Error already toasted by TaskProvider — stay on form
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
      {/* Card (w-144 = exactly 576px) */}
      <div className="w-xl bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-lg) overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 bg-(--gradient-primary)">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Edit3 size={24} className="text-(--color-text-inverse)" />
              <h1 className="text-2xl font-bold text-(--color-text-inverse)">
                Edit Task
              </h1>
            </div>
            <p className="text-sm text-(--color-text-inverse)/80">
              Update task details below.
            </p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-(--color-text-inverse)/20 text-(--color-text-inverse) hover:bg-(--color-text-inverse)/30 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pt-8 pb-6">
          {loadError && (
            <div className="py-12 text-center text-(--color-danger)">
              {loadError}
            </div>
          )}

          {!loadError && !initialValues && (
            <div className="py-12 text-center text-(--color-text-muted)">
              Loading task…
            </div>
          )}

          {initialValues && !loadError && (
            <TaskForm
              key={id}
              mode="edit"
              initialValues={initialValues}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/tasks")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
