/**
 * TaskRow – task-specific table row.
 * Contains all task UI logic (priority dot, strike-through, badges, status dropdown).
 * Can be passed as renderRow to <TaskTable />.
 *
 * Props:
 *   task           Task object
 *   onEdit         (task) => void
 *   onDelete       (task) => void
 *   onStatusChange (id, status) => void
 */
import { Pencil, Trash2 } from "lucide-react";
import StatusDropdown from "../StatusDropdown";

// ── Style maps (task-specific) ─────────────────────────────────────────────────
const CATEGORY_STYLES = {
  "Dọn dẹp & Trang trí": "bg-pink-100 text-pink-700",
  "Ẩm thực":             "bg-green-100 text-green-700",
  "Lễ nghi & Văn hóa":  "bg-indigo-100 text-indigo-700",
  "Mua sắm":             "bg-sky-100 text-sky-700",
  "Gia đình":            "bg-purple-100 text-purple-700",
  "Phương tiện":         "bg-orange-100 text-orange-700",
  "Khác":                "bg-gray-100 text-gray-600",
  // legacy English keys kept for backward-compat
  Decoration: "bg-pink-100 text-pink-700",
  Cooking:    "bg-green-100 text-green-700",
  Cleaning:   "bg-orange-100 text-orange-700",
  Ceremony:   "bg-indigo-100 text-indigo-700",
  Family:     "bg-purple-100 text-purple-700",
  Finance:    "bg-sky-100 text-sky-700",
  Other:      "bg-gray-100 text-gray-600",
};

const PRIORITY_DOT = {
  High:   "bg-red-500",
  Medium: "bg-amber-400",
  Low:    "bg-emerald-400",
};

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low:    "bg-emerald-100 text-emerald-600",
};

// ── Badge sub-components ───────────────────────────────────────────────────────
const CategoryBadge = ({ category }) => (
  <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[category] ?? "bg-gray-100 text-gray-600"}`}>
    {category}
  </span>
);

const PriorityBadge = ({ priority }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-normal ${PRIORITY_STYLES[priority] ?? "bg-gray-100 text-gray-600"}`}>
    {priority}
  </span>
);

// ── Row ────────────────────────────────────────────────────────────────────────
export default function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const isDone = task.status === "Done";

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      {/* Title */}
      <td className="pl-6 pr-6 py-4">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority] ?? "bg-slate-300"}`} />
          <span className={`text-sm font-semibold ${isDone ? "text-slate-400 line-through" : "text-slate-800"}`}>
            {task.title}
          </span>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <CategoryBadge category={task.category} />
      </td>

      {/* Due Date */}
      <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
        {task.date
          ? new Date(task.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "-"}
      </td>

      {/* Priority */}
      <td className="px-6 py-4">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusDropdown task={task} onStatusChange={onStatusChange} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(task)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
