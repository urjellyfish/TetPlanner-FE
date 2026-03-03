/**
 * DayCard.jsx
 *
 * Single day column in the Daily Breakdown section.
 * Receives a `day` object from DashboardContext / dashboardApi:
 *   { date, lunarDay, isBigDay, tasks:[], shoppingLists:[] }
 *
 * Design matches the Tet Planner reference:
 *   - Rounded card with soft shadow
 *   - Date header with lunar day + icon bubble
 *   - BIG DAY badge in top-right corner
 *   - Tasks section with circle checkboxes
 *   - Shopping section with warm yellow cards + VIEW LIST button
 */
import { Link } from "react-router-dom";

/** Formats "2026-02-07" → "Feb 07, 2026" */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/** Status icon based on TODO / IN_PROGRESS / DONE */
const StatusIcon = ({ status }) => {
  switch (status) {
    case "DONE":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
          <circle cx="10" cy="10" r="9" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
          <path d="M6 10l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "IN_PROGRESS":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
          <circle cx="10" cy="10" r="9" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="1" fill="#f59e0b" />
          <path d="M10 6v4l2.5 1.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default: // TODO
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
          <circle cx="10" cy="10" r="9" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );
  }
};

/** Text style based on status */
const getTaskTextClass = (status) => {
  switch (status) {
    case "DONE":
      return "text-(--color-text-muted) line-through decoration-[#94a3b8] decoration-2";
    case "IN_PROGRESS":
      return "font-semibold text-[#b45309]";
    default:
      return "font-medium text-(--color-text-primary)";
  }
};

const DayCard = ({ day }) => {
  const { date, lunarDay, isBigDay, tasks = [], shoppingLists = [] } = day;

  return (
    <div
      className={`
        relative flex flex-col gap-6 p-6
        bg-(--color-bg-card) rounded-3xl
        border transition-all duration-200
        ${isBigDay
          ? "border-2 border-[rgba(225,29,72,0.25)] shadow-[0_4px_20px_rgba(225,29,72,0.08)]"
          : "border-(--color-border-light) shadow-(--shadow-sm)"
        }
      `}
    >
      {/* ── BIG DAY badge ── */}
      {isBigDay && (
        <div className="absolute top-0 right-0 bg-[#e11d48] rounded-bl-2xl px-3 py-1.5 z-10">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-white leading-none">
            Big Day
          </span>
        </div>
      )}

      {/* ── Date header ── */}
      <div className="flex items-center justify-between min-w-0">
        <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
          <span
            className={`text-[10px] font-extrabold tracking-[1.5px] uppercase ${isBigDay ? "text-[#e11d48]" : "text-(--color-text-muted)"
              }`}
          >
            {formatDate(date)}
          </span>
          <span className="text-xl font-bold text-(--color-text-primary) leading-7 overflow-hidden text-ellipsis whitespace-nowrap block">
            {lunarDay || "Occasion"}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-5 flex-1 max-h-[400px] overflow-y-auto pr-1">
        {/* Tasks section */}
        {tasks.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] shrink-0" />
              <span className="text-[11px] font-bold uppercase text-(--color-text-muted) tracking-wider">
                Tasks
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl transition-colors ${task.status === "IN_PROGRESS"
                    ? "bg-[#fffbeb] border border-[#fef3c7]"
                    : task.status === "DONE"
                      ? "bg-[#f0fdf4]"
                      : "bg-(--color-bg-sidebar)"
                    }`}
                >
                  <StatusIcon status={task.status} />
                  <span className={`text-[13px] leading-5 ${getTaskTextClass(task.status)}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping section */}
        {shoppingLists.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
              <span className="text-[11px] font-bold uppercase text-(--color-text-muted) tracking-wider">
                Shopping
              </span>
            </div>
            {shoppingLists.map((list) => (
              <div
                key={list.id}
                className="flex flex-col gap-2.5 p-4 bg-[#fffbeb] rounded-xl border border-[#fef3c7]"
              >
                {/* List name + item count */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#b45309]">{list.name}</span>
                  <span className="text-[9px] font-extrabold text-[#d97706] bg-white rounded-full px-2 py-0.5 border border-[#fde68a]">
                    {list.itemCount} ITEMS
                  </span>
                </div>
                {/* Preview */}
                <p className="text-[12px] text-[#92400e]/60 leading-4">{list.preview}</p>
                {/* View list button */}
                <Link
                  to={list.budgetId ? `/shopping?budgetId=${list.budgetId}` : "/shopping"}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-white rounded-xl border border-[#fde68a] text-[11px] font-extrabold text-[#d97706] hover:bg-amber-50 hover:shadow-sm transition-all uppercase tracking-wide"
                >
                  View List
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Empty state for days with nothing */}
        {tasks.length === 0 && shoppingLists.length === 0 && (
          <div className="flex items-center justify-center py-6 text-(--color-text-muted) text-xs font-medium italic">
            No planned activities
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCard;
