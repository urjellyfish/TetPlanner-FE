import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3 } from "lucide-react";
import { TaskForm } from "../components/task/TaskFormModal";
import useTasks from "../hooks/useTasks";

export default function EditTask() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  // TODO: replace with real service when backend is ready (no changes needed here)
  const { fetchTaskById, handleUpdate } = useTasks();

  const [initialValues, setInitialValues] = useState(null);
  const [loadError,     setLoadError]     = useState(null);
  const [isSubmitting,  setIsSubmitting]  = useState(false);

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
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await handleUpdate(Number(id), data);
      navigate("/tasks");
    } catch (err) {
      alert("Failed to update task: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 overflow-y-auto py-10">
      {/* Card */}
      <div className="w-[576px] bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 bg-rose-600">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Edit3 size={24} className="text-white" />
              <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">Edit Task</h1>
            </div>
            <p className="text-sm text-rose-200 font-['Plus_Jakarta_Sans']">Update task details below.</p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pt-8 pb-6">
          {loadError && (
            <div className="py-12 text-center text-red-500 font-['Plus_Jakarta_Sans']">
              {loadError}
            </div>
          )}

          {!loadError && !initialValues && (
            <div className="py-12 text-center text-slate-400 font-['Plus_Jakarta_Sans']">
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
