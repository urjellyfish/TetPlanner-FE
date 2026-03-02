/**
 * DayCard.jsx
 *
 * Single day column in the Daily Breakdown section.
 * Receives a `day` object from DashboardContext / dashboardApi:
 *   { date, lunarDay, isBigDay, tasks:[], shoppingLists:[] }
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

/** Checkbox icon (unchecked / checked) */
const Checkbox = ({ checked }) =>
  checked ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" />
      <path d="M6 10l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="10" cy="10" r="9" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );

const DayCard = ({ day }) => {
  const { date, lunarDay, isBigDay, tasks = [], shoppingLists = [] } = day;

  return (
    <div
      className={`relative flex flex-col gap-8 p-6 bg-white rounded-[40px] overflow-hidden shadow-[0_8px_10px_0_rgba(226,232,240,0.5)] border ${
        isBigDay
          ? "border-2 border-[rgba(225,29,72,0.2)] shadow-[0_8px_10px_0_rgba(225,29,72,0.1)]"
          : "border-[#f1f5f9]"
      } flex-1 min-w-0`}
    >
      {/* BIG DAY badge */}
      {isBigDay && (
        <div className="absolute top-0 right-0 bg-[#e11d48] rounded-bl-2xl px-2 py-1.5 z-10">
          <span className="text-[9.8px] font-extrabold uppercase tracking-[-0.5px] text-white leading-[15px]">
            Big Day
          </span>
        </div>
      )}

      {/* Date header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col">
          <span className={`text-[10px] font-extrabold tracking-[1px] uppercase ${isBigDay ? "text-[#e11d48]" : "text-[#94a3b8]"}`}>
            {formatDate(date)}
          </span>
          <span className="text-[20px] font-bold text-[#0f172a] leading-7 truncate max-w-full block">
            {lunarDay || "Occasion"}
          </span>
        </div>

        {/* Icon bubble */}
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full shrink-0 ${
            isBigDay ? "bg-[#e11d48]" : "bg-[#fffbeb]"
          }`}
        >
          {isBigDay ? (
            /* Party/firework icon for Big Day */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 3l14 14M3 5L17 19M5 19L19 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
          ) : (
            /* Utensils/fork icon for normal days */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 2v20M21 15V2s-5 2-5 9h5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Tasks section */}
        {tasks.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e11d48] shrink-0" />
              <span className="text-[12px] font-bold uppercase text-[#94a3b8] tracking-wide">Tasks</span>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl ${
                    task.highlight
                      ? "bg-[rgba(225,29,72,0.05)] border border-[rgba(225,29,72,0.1)]"
                      : "bg-[#f8fafc]"
                  }`}
                >
                  <Checkbox checked={task.completed} />
                  <span
                    className={`text-[14px] leading-5 ${
                      task.completed
                        ? "text-[#94a3b8] line-through"
                        : task.highlight
                        ? "font-bold text-[#0f172a]"
                        : "font-semibold text-[#0f172a]"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping section */}
        {shoppingLists.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d97706] shrink-0" />
              <span className="text-[12px] font-bold uppercase text-[#94a3b8] tracking-wide">Shopping</span>
            </div>
            {shoppingLists.map((list) => (
              <div
                key={list.id}
                className="flex flex-col gap-2 p-4 bg-[#fffbeb] rounded-2xl border border-[#fef3c7]"
              >
                {/* List name + item count */}
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#b45309]">{list.name}</span>
                  <span className="text-[10px] font-extrabold text-[#d97706] bg-white rounded-full px-2 py-0.5">
                    {list.itemCount} ITEMS
                  </span>
                </div>
                {/* Preview */}
                <p className="text-[12px] text-[#64748b] pb-1">{list.preview}</p>
                {/* View list button */}
                <Link
                  to="/shopping"
                  className="flex items-center justify-center gap-1.5 py-2 bg-white rounded-xl border border-[#fde68a] text-[12px] font-extrabold text-[#d97706] hover:bg-amber-50 transition-colors"
                >
                  VIEW LIST
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCard;
