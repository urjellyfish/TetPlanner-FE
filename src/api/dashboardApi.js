/**
 * dashboardApi.js
 *
 * All HTTP calls related to the Dashboard screen.
 *
 * ─── MOCK SWITCH ────────────────────────────────────────────────────────────
 * Set USE_MOCK = true  → return mock data (no network calls)
 * Set USE_MOCK = false → hit the real backend API
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { api } from "../config/api";
import { mockDashboardData, mockDailyBreakdown } from "../service/mock/dashboardMock";

/** Toggle between mock and real API — change to false to use the real backend */
const USE_MOCK = false;

async function fetchRealDailyBreakdown() {
  const res = await api.get("/occasions");
  const occasions = res.data.data || [];
  
  // Map occasions to the format expected by DayCard
  return occasions.map(occ => ({
    id: occ.id,
    date: occ.date,
    lunarDay: occ.name, // Using occasion name as the primary title
    isBigDay: true,      // Occasions from the occasions API are "Big Days"
    tasks: (occ.tasks || []).map(t => ({
      id: t.id,
      title: t.title,
      completed: t.status === "DONE" || t.status === "done",
      highlight: t.priority === "HIGH" || t.priority === "high"
    })),
    shoppingLists: [] // Occasions API currently doesn't provide associated shopping lists
  }));
}

async function fetchRealTaskProgress() {
  const res = await api.get("/tasks/progress");
  return res.data.data; // { totalTasks, completedTasks, percentage }
}

async function fetchRealShoppingProgress(budgetId) {
  const res = await api.get(`/shopping-items/progress/${budgetId}`);
  return res.data.data; // { totalShoppingItem, remainingShoppingItem, percentage }
}

async function fetchRealBudgetProgress(budgetId) {
  const res = await api.get(`/budget/${budgetId}/progress`);
  return res.data.data; // { totalBudget, usedBudget, percentage }
}

// ─── Public API (consumed by DashboardProvider only) ─────────────────────────

export async function getShoppingSummary(budgetId) {
  if (USE_MOCK) {
    const { shopping } = mockDashboardData;
    return { 
      total: shopping.total, 
      remaining: shopping.remaining,
      percent: calculateProgress(shopping.total - shopping.remaining, shopping.total)
    };
  }
  if (!budgetId) return { total: 0, remaining: 0, percent: 0 };
  const data = await fetchRealShoppingProgress(budgetId);
  return { 
    total: data.totalShoppingItem || 0, 
    remaining: data.remainingShoppingItem || 0,
    percent: data.percentage || 0
  };
}

export async function getBudgetSummary(budgetId) {
  if (USE_MOCK) {
    const { budget } = mockDashboardData;
    return { 
      used: budget.used, 
      total: budget.total,
      percent: calculateProgress(budget.used, budget.total)
    };
  }
  if (!budgetId) return { used: 0, total: 1, percent: 0 };
  const data = await fetchRealBudgetProgress(budgetId);
  return { 
    used: data.usedBudget || 0, 
    total: data.totalBudget || 0,
    percent: data.percentage || 0
  };
}

/**
 * Fetch task summary: { done, total }
 */
export async function getTaskSummary() {
  if (USE_MOCK) {
    const { tasks } = mockDashboardData;
    return { done: tasks.completed, total: tasks.total };
  }
  const data = await fetchRealTaskProgress();
  return { done: data.completedTasks, total: data.totalTasks };
}

/**
 * Fetch daily breakdown.
 * Returns [{ id, date, lunarDay, isBigDay, tasks:[], shoppingLists:[] }]
 */
export async function getDailyBreakdown() {
  if (USE_MOCK) return mockDailyBreakdown;
  return fetchRealDailyBreakdown();
}
