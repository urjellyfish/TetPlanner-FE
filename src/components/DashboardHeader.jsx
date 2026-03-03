/**
 * DashboardHeader.jsx
 *
 * Top header bar for the Dashboard page.
 * Shows page title, subtitle, and "New Task" CTA.
 */
import { Plus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { useState } from "react";

const DashboardHeader = () => {
  const { budgets, selectedBudgetId, handleBudgetChange } = useDashboard();
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedBudget = budgets.find((b) => b.id === selectedBudgetId);

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30 font-['Plus_Jakarta_Sans'] transition-colors duration-200">
      {/* Left — title block */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-bold leading-9 text-[#1e293b] tracking-tight">
          Get ready for a perfect Tết!
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-[#64748b]">
            Year of the Horse 2026 &bull; BINH NGO
          </p>
          <span className="text-[#cbd5e1]">&bull;</span>
          {/* Budget Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#1e293b] hover:bg-slate-100 transition-all"
            >
              {selectedBudget?.name || "Loading Budget..."}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                ></div>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                  {budgets.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        handleBudgetChange(b.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-rose-50 hover:text-[#e11d48] ${selectedBudgetId === b.id ? "text-[#e11d48] font-bold bg-rose-50/50" : "text-slate-600 font-medium"}`}
                    >
                      {b.name}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      to="/shopping"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#e11d48] hover:bg-rose-50"
                    >
                      <Plus size={12} /> New Budget
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right — New Task CTA */}
      <Link
        to="/tasks"
        className="flex items-center gap-2 px-5 py-[10px] bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-100 transition-all whitespace-nowrap"
      >
        <Plus size={14} strokeWidth={3} />
        New Task
      </Link>
    </div>
  );
};

export default DashboardHeader;
