/**
 * Dashboard.jsx
 *
 * Main dashboard page.
 * Layout (Sidebar) is provided by App.jsx.
 * Data is provided by DashboardProvider (wraps this route in App.jsx).
 *
 * Component tree:
 *   Dashboard
 *   ├── DashboardHeader
 *   └── main content
 *       ├── CountdownCard
 *       ├── ProgressCard × 3  (Tasks Done / Shopping List / Budget Used)
 *       └── DailyBreakdown
 *           └── DayCard × n
 */
import DashboardHeader from "../components/DashboardHeader";
import CountdownCard from "../components/CountdownCard";
import ProgressCard from "../components/ProgressCard";
import DailyBreakdown from "../components/DailyBreakdown";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard = () => {
  const {
    tetDate,
    taskStats,
    shoppingSummary,
    shoppingPercent,
    budgetPercent,
    budgetLabel,
  } = useDashboard();

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto bg-[var(--color-bg-main)] font-['Plus_Jakarta_Sans']">
      {/* Sticky header */}
      <DashboardHeader />

      {/* Scrollable body */}
      <main className="flex flex-col gap-8 p-8">
        {/* Row 1 — Countdown + Progress cards */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Countdown */}
          <div className="xl:max-w-[580px] w-full">
            <CountdownCard tetDate={tetDate} />
          </div>

          {/* Progress cards column */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <ProgressCard
              title="Tasks Done"
              subtitle={`${taskStats.done} of ${taskStats.total} completed`}
              percent={taskStats.percent}
              color="#e11d48"
              trackColor="rgba(225,29,72,0.12)"
            />
            <ProgressCard
              title="Shopping List"
              subtitle={`${shoppingSummary.remaining} items remaining`}
              percent={shoppingPercent}
              color="#10b981"
              trackColor="#d1fae5"
            />
            <ProgressCard
              title="Budget Used"
              subtitle={budgetLabel}
              percent={budgetPercent}
              color="#d97706"
              trackColor="#fef3c7"
            />
          </div>
        </div>

        {/* Row 2 — Daily Breakdown */}
        <DailyBreakdown />
      </main>
    </div>
  );
};

export default Dashboard;

