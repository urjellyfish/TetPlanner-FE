import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

// ─── Style Maps ────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  TODO:        "bg-slate-100 text-slate-500 border border-slate-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  DONE:        "bg-green-100 text-green-700 border border-green-200",
};

const OPTION_ACTIVE = {
  TODO:        "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  DONE:        "bg-green-50 text-green-700",
};

const DOT_COLOR = {
  TODO:        "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  DONE:        "bg-green-500",
};

const STATUS_LABELS = {
  TODO:        "To Do",
  IN_PROGRESS: "In Progress",
  DONE:        "Done",
};

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

/**
 * Inline status badge that opens a custom dropdown on click.
 *
 * Props:
 *   task            – task object (needs .id and .status)
 *   onStatusChange  – (id, newStatus) => void
 */
const StatusDropdown = ({ task, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (status) => {
    if (status !== task.status) {
      onStatusChange(task.id, status);
    }
    setOpen(false);
  };

  const badge = BADGE_STYLES[task.status] ?? "bg-gray-100 text-gray-500 border border-gray-200";

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* ── Trigger Badge ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border cursor-pointer select-none transition-opacity hover:opacity-80 ${badge}`}
      >
        {STATUS_LABELS[task.status] ?? task.status}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden">
          {STATUSES.map((status) => {
            const isSelected = status === task.status;
            return (
              <button
                key={status}
                onClick={() => handleSelect(status)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left transition-colors
                  ${isSelected ? OPTION_ACTIVE[status] : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLOR[status]}`} />
                {STATUS_LABELS[status] ?? status}
                {isSelected && (
                  <Check size={12} className="ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
