/**
 * taskUtils.js – reusable helpers for task data display.
 * All formatting lives here so pages/components stay thin.
 */

// ── Predicates ─────────────────────────────────────────────────────────────────

/** Returns true when the task spans more than one calendar day. */
export const isMultiDayTask = (task) =>
  Boolean(task.start_date && task.due_date && task.start_date !== task.due_date);

/**
 * Returns true when the task is past its due date and not yet done.
 * Comparison is date-only (ignores time) so a task due today is NOT overdue.
 * @param {object} task
 * @returns {boolean}
 */
export const isOverdue = (task) => {
  if (!task.due_date || task.status === "DONE") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due_date + "T00:00:00") < today;
};

// ── Formatters ─────────────────────────────────────────────────────────────────

/**
 * Format a single date+time pair into a human-readable string.
 * @param {string} date  "YYYY-MM-DD"
 * @param {string} time  "HH:mm"  (optional)
 * @returns {string}
 */
export const formatDateTime = (date, time) => {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
  return time ? `${dateStr} ${time}` : dateStr;
};

/**
 * Format the full schedule of a task into display text.
 *
 * Same-day:  "Feb 10, 2026 • 08:00 – 17:00"
 * Multi-day: "Feb 10, 2026 08:00 → Feb 12, 2026 17:00"
 *
 * @param {object} task
 * @returns {string}
 */
export const formatTaskSchedule = (task) => {
  const { start_date, start_time, due_date, due_time } = task ?? {};
  if (!start_date && !due_date) return "—";

  if (isMultiDayTask(task)) {
    const start = formatDateTime(start_date, start_time);
    const end   = formatDateTime(due_date,   due_time);
    return `${start} → ${end}`;
  }

  // Same-day (or only one date set)
  const date = start_date || due_date;
  const d    = new Date(date + "T00:00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  if (start_time && due_time) return `${dateStr} • ${start_time} – ${due_time}`;
  if (start_time)             return `${dateStr} • ${start_time}`;
  if (due_time)               return `${dateStr} • ${due_time}`;
  return dateStr;
};
