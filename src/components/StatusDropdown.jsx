import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

// ─── Style Maps ────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  TODO: "bg-(--color-bg-sidebar) text-(--color-text-secondary) border-(--color-border-medium)",
  IN_PROGRESS:
    "bg-(--color-info)/15 text-(--color-info) border-(--color-info)/30",
  DONE: "bg-(--color-success)/15 text-(--color-success) border-(--color-success)/30",
};

const OPTION_ACTIVE = {
  TODO: "bg-(--color-border-light) text-(--color-text-primary)",
  IN_PROGRESS: "bg-(--color-info)/10 text-(--color-info)",
  DONE: "bg-(--color-success)/10 text-(--color-success)",
};

const DOT_COLOR = {
  TODO: "bg-(--color-text-muted)",
  IN_PROGRESS: "bg-(--color-info)",
  DONE: "bg-(--color-success)",
};

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

/**
 * Inline status badge that opens a custom dropdown on click.
 *
 * Props:
 * task           – task object (needs .id and .status)
 * onStatusChange – (id, newStatus) => void
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

  const badge =
    BADGE_STYLES[task.status] ??
    "bg-(--color-bg-sidebar) text-(--color-text-secondary) border-(--color-border-light)";

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* ── Trigger Badge ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border cursor-pointer select-none transition-all hover:opacity-80 ${badge}`}
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-36 bg-(--color-bg-card) rounded-xl shadow-(--shadow-md) border border-(--color-border-light) py-1 overflow-hidden transition-colors duration-200">
          {STATUSES.map((status) => {
            const isSelected = status === task.status;
            return (
              <button
                key={status}
                onClick={() => handleSelect(status)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left transition-colors
                  ${isSelected ? OPTION_ACTIVE[status] : "text-(--color-text-secondary) hover:bg-(--color-bg-sidebar) hover:text-(--color-text-primary)"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLOR[status]}`}
                />
                {STATUS_LABELS[status] ?? status}
                {isSelected && <Check size={12} className="ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
