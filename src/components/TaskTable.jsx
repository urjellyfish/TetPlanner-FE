/**
 * TaskTable – generic reusable table.
 * Does NOT contain any task-specific logic.
 *
 * Props:
 * columns      Array<{ key, label, align? }>   – header definitions
 * data         array                            – rows data
 * renderRow    (item) => ReactNode             – how to render each row
 * loading      boolean
 * emptyMessage string
 * pagination   ReactNode                        – optional footer slot
 */
import { Loader2 } from "lucide-react";

export default function TaskTable({
  columns = [],
  data = [],
  renderRow,
  loading = false,
  emptyMessage = "No data.",
  pagination,
}) {
  const colSpan = columns.length;

  return (
    <div className="bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-sm) transition-colors duration-200">
      <table className="w-full text-left">
        <thead>
          {/* Replaced slate-50 with your sidebar/subtle background for contrast */}
          <tr className="bg-(--color-bg-sidebar) transition-colors duration-200">
            {columns.map(({ key, label, align }) => (
              <th
                key={key}
                className={`px-6 py-4 text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider ${align === "right" ? "text-right" : ""}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-(--color-text-muted)">
                  <Loader2
                    size={24}
                    className="animate-spin text-(--color-primary-500)"
                  />
                  <span className="text-sm">Loading…</span>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td
                colSpan={colSpan}
                className="py-16 text-center text-sm text-(--color-text-muted)"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Optional pagination footer */}
      {pagination && (
        <div className="border-t border-(--color-border-light) transition-colors duration-200">
          {pagination}
        </div>
      )}
    </div>
  );
}
