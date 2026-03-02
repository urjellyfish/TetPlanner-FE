/**
 * dashboardService.js
 *
 * Pure calculation helpers for the Dashboard.
 * No side-effects, no API calls — those live in dashboardApi.js.
 */

/**
 * Calculates a completion percentage (0–100), clamped and rounded.
 * @param {number} done  — items completed
 * @param {number} total — total items
 * @returns {number}
 */
export function calculateProgress(done, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/**
 * Formats a budget string for display.
 * @param {number} used  — amount spent (e.g. 12500000)
 * @param {number} total — budget ceiling  (e.g. 20000000)
 * @returns {string}  e.g. "12.5M of 20M VNĐ"
 */
export function formatBudget(used, total) {
  const fmt = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };
  return `${fmt(used)} of ${fmt(total)} VNĐ`;
}

/**
 * Derives task stats from the raw tasks array.
 * @param {Array} tasks
 * @returns {{ done: number, total: number, percent: number }}
 */
export function calcTaskStats(tasks = []) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE" || t.status === "done").length;
  return { done, total, percent: calculateProgress(done, total) };
}
