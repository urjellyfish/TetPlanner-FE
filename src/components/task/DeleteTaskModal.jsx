import { Trash2, X } from "lucide-react";

export default function DeleteTaskModal({ isOpen, task, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
      <div className="relative w-[576px] bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] overflow-hidden">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-8 pt-8 pr-8 pb-12 pl-8">

          {/* Icon */}
          <div className="w-[72px] h-[72px] flex items-center justify-center bg-red-100 rounded-full">
            <Trash2 size={36} className="text-red-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[36px] text-slate-800">
              Delete Confirmation
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[20px] text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">"{task?.title}"</span>?
              {" "}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-['Plus_Jakarta_Sans'] text-base font-medium text-slate-900 transition"
            >
              No, keep it
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl font-['Plus_Jakarta_Sans'] text-base font-medium text-white shadow-[0_4px_6px_0_rgba(225,29,72,0.2)] transition"
            >
              Yes, delete it
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
