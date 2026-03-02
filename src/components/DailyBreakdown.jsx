/**
 * DailyBreakdown.jsx
 *
 * Section header + 3-column DayCard grid for the daily breakdown.
 * Reads data from DashboardContext.
 */
import { useDashboard } from "../hooks/useDashboard";
import DayCard from "./DayCard";

const DailyBreakdown = () => {
  const { dailyBreakdown } = useDashboard();

  return (
    <section className="flex flex-col gap-6 w-full">
      {/* Section header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* Calendar / lantern icon */}
          <span className="text-[28px] leading-none select-none" aria-hidden>🏮</span>
          <h2 className="text-[24px] font-extrabold leading-8 text-[#0f172a]">Daily Breakdown</h2>
        </div>
        <p className="text-[14px] text-[#64748b]">
          Planned tasks and shopping for the last 3 days of the year
        </p>
      </div>

      {/* Day columns */}
      <div className="flex gap-6 items-stretch overflow-x-auto pb-2">
        {dailyBreakdown.map((day) => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>
    </section>
  );
};

export default DailyBreakdown;
