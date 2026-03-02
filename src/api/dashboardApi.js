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
const USE_MOCK = true;

// ─── Real API fetchers (never deleted) ───────────────────────────────────────

async function fetchRealShoppingSummary() {
  const res = await api.get("/shopping/summary");
  return res.data.data;
}

async function fetchRealBudgetSummary() {
  const res = await api.get("/budget/summary");
  return res.data.data;
}

async function fetchRealDailyBreakdown() {
  const res = await api.get("/dashboard/daily-breakdown");
  return res.data.data;
}

// ─── Public API (consumed by DashboardProvider only) ─────────────────────────

/** Fetch shopping list summary: { total, remaining } */
export async function getShoppingSummary() {
  if (USE_MOCK) {
    const { shopping } = mockDashboardData;
    return { total: shopping.total, remaining: shopping.remaining };
  }
  return fetchRealShoppingSummary();
}

/** Fetch budget summary: { used, total } (amounts in VNĐ) */
export async function getBudgetSummary() {
  if (USE_MOCK) {
    const { budget } = mockDashboardData;
    return { used: budget.used, total: budget.total };
  }
  return fetchRealBudgetSummary();
}

/**
 * Fetch task summary: { done, total }
 * When USE_MOCK = false, returns null — DashboardProvider falls back to TaskContext.
 */
export async function getTaskSummary() {
  if (USE_MOCK) {
    const { tasks } = mockDashboardData;
    return { done: tasks.completed, total: tasks.total };
  }
  return null; // signal provider to derive from TaskContext
}

/**
 * Fetch daily breakdown.
 * Returns [{ id, date, lunarDay, isBigDay, tasks:[], shoppingLists:[] }]
 */
export async function getDailyBreakdown() {
  if (USE_MOCK) return mockDailyBreakdown;
  return fetchRealDailyBreakdown();
}
