import { useCallback, useEffect, useState, useContext } from "react";
import DashboardContext from "./DashboardContext";
import TaskContext from "./TaskContext";
import {
  getShoppingSummary,
  getBudgetSummary,
  getDailyBreakdown,
  getTaskSummary,
} from "../api/dashboardApi";
import { budgetAPI } from "../api/budgetAPI";
import {
  calcTaskStats,
  calculateProgress,
  formatBudget,
} from "../service/dashboardService";

// Tet 2026 — Year of the Horse (matches design)
const TET_DATE = new Date("2026-02-10T00:00:00");

export function DashboardProvider({ children }) {
  const [taskStats, setTaskStats] = useState({ done: 0, total: 0, percent: 0 });
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [shoppingSummary, setShoppingSummary] = useState({
    total: 0,
    remaining: 0,
  });
  const [budgetSummary, setBudgetSummary] = useState({ used: 0, total: 1 });
  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(
    async (budgetId = null) => {
      setLoading(true);
      try {
        // 1. Resolve which budget ID to use
        let activeBudgetId = budgetId || selectedBudgetId;

        // Fetch budget list to ensure we have budgets and potentially an initial ID
        const budgetsRes = await budgetAPI.getBudgets(0, 100);
        const bList = budgetsRes.data?.budgets || [];
        setBudgets(bList);

        if (!activeBudgetId && bList.length > 0) {
          activeBudgetId = bList[0].id;
          setSelectedBudgetId(activeBudgetId);
        }

        // 2. Parallel fetch based on the resolved activeBudgetId
        // Even if activeBudgetId is null (no budgets exist), these return default empty shapes
        const [shopping, budget, daily, tasksData] = await Promise.all([
          getShoppingSummary(activeBudgetId),
          getBudgetSummary(activeBudgetId),
          getDailyBreakdown(),
          getTaskSummary(),
        ]);

        setShoppingSummary(shopping);
        setBudgetSummary(budget);
        setDailyBreakdown(daily);
        setTaskStats(tasksData);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedBudgetId],
  );

  const handleBudgetChange = (id) => {
    setSelectedBudgetId(id);
    fetchDashboardData(id);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const shoppingPercent =
    shoppingSummary.percent ??
    calculateProgress(
      shoppingSummary.total - shoppingSummary.remaining,
      shoppingSummary.total,
    );

  const budgetPercent =
    budgetSummary.percent ??
    calculateProgress(budgetSummary.used, budgetSummary.total);
  const budgetLabel = formatBudget(budgetSummary.used, budgetSummary.total);

  const value = {
    tetDate: TET_DATE,
    taskStats,
    shoppingSummary,
    shoppingPercent,
    budgetSummary,
    budgetPercent,
    budgetLabel,
    budgets,
    selectedBudgetId,
    handleBudgetChange,
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
