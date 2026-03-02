/**
 * TaskRow – task-specific table row.
 * Contains all task UI logic (priority dot, strike-through, badges, status dropdown).
 * Can be passed as renderRow to <TaskTable />.
 *
 * Props:
 * task           Task object
 * onEdit         (task) => void
 * onDelete       (task) => void
 * onStatusChange (id, status) => void
 */
import { Pencil, Trash2 } from "lucide-react";
import StatusDropdown from "./StatusDropdown";

// ── Style maps (task-specific) ─────────────────────────────────────────────────
// Using opacity (/15) so these look good in both light and dark themes
const CATEGORY_STYLES = {
  "Dọn dẹp & Trang trí": "bg-pink-500/15 text-pink-600",
  "Ẩm thực": "bg-green-500/15 text-green-600",
  "Lễ nghi & Văn hóa": "bg-indigo-500/15 text-indigo-600",
  "Mua sắm": "bg-sky-500/15 text-sky-600",
  "Gia đình": "bg-purple-500/15 text-purple-600",
  "Phương tiện": "bg-orange-500/15 text-orange-600",
  Khác: "bg-gray-500/15 text-[var(--color-text-secondary)]",
};

// Tied to your status variables from index.css
const PRIORITY_DOT = {
  high: "bg-[var(--color-danger)]",
  medium: "bg-[var(--color-warning)]",
  low: "bg-[var(--color-success)]",
};

const PRIORITY_STYLES = {
  high: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
  medium: "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  low: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
};

const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

// ── Badge sub-components ───────────────────────────────────────────────────────
const CategoryBadge = ({ categoryName }) => {
  const name = categoryName ?? "";
  return (
    <span
      className={`px-3 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[name] ?? "bg-(--color-bg-sidebar) text-(--color-text-secondary)"}`}
    >
      {name || "—"}
    </span>
  );
};

const PriorityBadge = ({ priority }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_STYLES[priority] ?? "bg-(--color-bg-sidebar) text-(--color-text-secondary)"}`}
  >
    {PRIORITY_LABELS[priority] ?? priority}
  </span>
);

// ── Row ────────────────────────────────────────────────────────────────────────
export default function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const isDone = task.status === "DONE";

  return (
    <tr
      className={`border-b transition-colors duration-200
      ${
        isDone
          ? "bg-(--color-bg-main) border-(--color-border-light) opacity-60 hover:opacity-80"
          : "border-(--color-border-light) hover:bg-(--color-bg-sidebar)"
      }`}
    >
      {/* Title */}
      <td className="pl-6 pr-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority] ?? "bg-(--color-border-medium)"}`}
          />
          <span
            className={`text-sm font-semibold transition-colors duration-200 ${
              isDone
                ? "text-(--color-text-muted) line-through"
                : "text-(--color-text-primary)"
            }`}
          >
            {task.title}
          </span>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <CategoryBadge categoryName={task.categoryName} />
      </td>

      {/* Schedule */}
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-(--color-text-secondary) transition-colors duration-200">
        {task.timelineLabel ?? "—"}
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
            className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-text-muted) hover:text-(--color-info) hover:bg-(--color-info)/10 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-text-muted) hover:text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
