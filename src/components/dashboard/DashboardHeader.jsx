/**
 * DashboardHeader.jsx
 *
 * Top header bar for the Dashboard page.
 * Shows page title, subtitle, and "New Task" CTA.
 */
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = () => (
  <div className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 font-['Plus_Jakarta_Sans']">
    {/* Left — title block */}
    <div className="flex flex-col gap-1">
      <h1 className="text-[30px] font-bold leading-9 text-[#1e293b] tracking-tight">
        Get ready for a perfect Tết!
      </h1>
      <p className="text-sm text-[#64748b]">Year of the Horse 2026 &bull; BINH NGO</p>
    </div>

    {/* Right — New Task CTA */}
    <Link
      to="/tasks"
      className="flex items-center gap-2 px-5 py-[10px] bg-[var(--color-primary-500)] hover:opacity-90 text-white rounded-xl text-sm font-medium shadow-[var(--btn-primary-shadow)] transition-opacity whitespace-nowrap"
    >
      <Plus size={14} />
      New Task
    </Link>
  </div>
);

export default DashboardHeader;
