/**
 * DashboardProvider.jsx
 *
 * Owns all Dashboard state:
 *  - tetDate          target date for the countdown
 *  - taskStats        { done, total, percent }
 *  - shoppingSummary  { total, remaining }
 *  - budgetSummary    { used, total }
 *  - dailyBreakdown   array of day objects
 *  - loading
 *
 * Data flow:  API → service helpers → context → components
 */
import { useCallback, useEffect, useState, useContext } from "react";
import DashboardContext from "./DashboardContext";
import TaskContext from "./TaskContext";
import {
  getShoppingSummary,
  getBudgetSummary,
  getDailyBreakdown,
  getTaskSummary,
} from "../api/dashboardApi";
import { calcTaskStats, calculateProgress, formatBudget } from "../service/dashboardService";

// Tet 2026 — Year of the Horse (matches design)
const TET_DATE = new Date("2026-02-10T00:00:00");

export default function DashboardProvider({ children }) {
  const taskCtx = useContext(TaskContext);
  const tasks = taskCtx?.tasks ?? [];

  const [shoppingSummary, setShoppingSummary] = useState({ total: 0, remaining: 0 });
  const [budgetSummary, setBudgetSummary] = useState({ used: 0, total: 1 });
  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  // null = not loaded yet; object from mock overrides TaskContext
  const [taskSummaryOverride, setTaskSummaryOverride] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [shopping, budget, daily, taskSummary] = await Promise.all([
        getShoppingSummary(),
        getBudgetSummary(),
        getDailyBreakdown(),
        getTaskSummary(),
      ]);
      setShoppingSummary(shopping);
      setBudgetSummary(budget);
      setDailyBreakdown(daily);
      // getTaskSummary returns null when USE_MOCK=false → fall back to TaskContext
      if (taskSummary !== null) setTaskSummaryOverride(taskSummary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Prefer mock/API-supplied task summary; fall back to live TaskContext
  const taskStats = taskSummaryOverride
    ? {
        done: taskSummaryOverride.done,
        total: taskSummaryOverride.total,
        percent: calculateProgress(taskSummaryOverride.done, taskSummaryOverride.total),
      }
    : calcTaskStats(tasks);

  const shoppingPercent = calculateProgress(
    shoppingSummary.total - shoppingSummary.remaining,
    shoppingSummary.total
  );

  const budgetPercent = calculateProgress(budgetSummary.used, budgetSummary.total);
  const budgetLabel = formatBudget(budgetSummary.used, budgetSummary.total);

  const value = {
    tetDate: TET_DATE,
    taskStats,
    shoppingSummary,
    shoppingPercent,
    budgetSummary,
    budgetPercent,
    budgetLabel,
    dailyBreakdown,
    loading,
    refresh: fetchDashboardData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
