/**
 * DailyBreakdown.jsx
 *
 * Section header + paginated DayCard grid (max 4 columns per page).
 * Left/right arrows navigate between pages when there are more than 4 days.
 * Reads data from DashboardContext.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import DayCard from "./DayCard";

const CARDS_PER_PAGE = 4;

const DailyBreakdown = () => {
  const { dailyBreakdown } = useDashboard();
  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = Math.max(1, Math.ceil(dailyBreakdown.length / CARDS_PER_PAGE));
  const canGoBack = pageIndex > 0;
  const canGoForward = pageIndex < totalPages - 1;

  // Slice the current page of cards
  const start = pageIndex * CARDS_PER_PAGE;
  const visibleDays = dailyBreakdown.slice(start, start + CARDS_PER_PAGE);

  return (
    <section className="flex flex-col gap-6 w-full">
      {/* Section header + navigation arrows */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {/* Calendar / lantern icon */}
            <span className="text-[28px] leading-none select-none" aria-hidden>🏮</span>
            <h2 className="text-[24px] font-extrabold leading-8 text-(--color-text-primary)">
              Daily Breakdown
            </h2>
          </div>
          <p className="text-[14px] text-(--color-text-secondary)">
            Planned tasks and shopping for the last {dailyBreakdown.length} days of the year
          </p>
        </div>

        {/* Pagination arrows (only show when there are more than CARDS_PER_PAGE days) */}
        {dailyBreakdown.length > CARDS_PER_PAGE && (
          <div className="flex items-center gap-2">
            {/* Page indicator */}
            <span className="text-[13px] font-semibold text-(--color-text-muted) mr-1">
              {pageIndex + 1} / {totalPages}
            </span>

            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={!canGoBack}
              aria-label="Previous page"
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${canGoBack
                  ? "bg-(--color-bg-card) border-(--color-border-light) text-(--color-text-primary) hover:bg-(--color-bg-sidebar) hover:shadow-(--shadow-sm) cursor-pointer"
                  : "bg-(--color-bg-sidebar) border-transparent text-(--color-text-muted) opacity-40 cursor-not-allowed"
                }`}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              disabled={!canGoForward}
              aria-label="Next page"
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${canGoForward
                  ? "bg-(--color-bg-card) border-(--color-border-light) text-(--color-text-primary) hover:bg-(--color-bg-sidebar) hover:shadow-(--shadow-sm) cursor-pointer"
                  : "bg-(--color-bg-sidebar) border-transparent text-(--color-text-muted) opacity-40 cursor-not-allowed"
                }`}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* Day columns — always max 4 in a CSS grid */}
      <div
        className="grid gap-6 transition-all duration-300"
        style={{
          gridTemplateColumns: `repeat(${Math.min(visibleDays.length, CARDS_PER_PAGE)}, minmax(0, 1fr))`,
        }}
      >
        {visibleDays.map((day) => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>

      {/* Empty state */}
      {dailyBreakdown.length === 0 && (
        <div className="flex items-center justify-center py-16 text-(--color-text-muted) text-sm font-medium">
          No daily breakdown data available.
        </div>
      )}
    </section>
  );
};

export default DailyBreakdown;
