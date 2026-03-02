import { Trash2, X } from "lucide-react";

export default function DeleteTaskModal({ isOpen, task, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-xl bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-lg) overflow-hidden transition-colors duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-bg-sidebar) transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-8 pt-8 pr-8 pb-12 pl-8">
          {/* Icon */}
          <div className="w-18 h-18 flex items-center justify-center bg-(--color-danger)/10 rounded-full">
            <Trash2 size={36} className="text-(--color-danger)" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[30px] font-bold leading-9 text-(--color-text-primary) transition-colors duration-200">
              Delete Confirmation
            </span>
            <span className="text-[14px] font-normal leading-5 text-(--color-text-secondary) transition-colors duration-200">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-(--color-text-primary)">
                "{task?.title}"
              </span>
              ?
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-(--color-bg-sidebar) hover:bg-(--color-border-light) rounded-xl text-base font-medium text-(--color-text-primary) transition"
            >
              No, keep it
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 bg-(--color-danger) hover:opacity-90 rounded-xl text-base font-medium text-(--color-text-inverse) shadow-(--shadow-md) transition"
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
