import { Download, LayoutGrid, List, Plus, Tag } from "lucide-react";

/**
 * TaskHeader
 *
 * Reusable header for the Task Management page.
 * Shared by both List view and Kanban view.
 *
 * Props:
 * currentView  "list" | "kanban"
 * onViewChange (view: string) => void
 * onCreateTask () => void
 */
const TaskHeader = ({ currentView, onViewChange, onCreateTask }) => (
  <div className="flex items-center justify-between px-8 py-6 bg-(--color-bg-main)/80 backdrop-blur-sm border-b border-(--color-border-light) sticky top-0 z-10 font-(--font-family-base) transition-colors duration-200">
    {/* Left — page title block */}
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-(--color-text-primary) tracking-tight transition-colors duration-200">
        Tet Preparation Tasks
      </h1>
      <p className="text-sm text-(--color-text-secondary) transition-colors duration-200">
        Year of the Horse 2026 &bull; BINH NGO
      </p>
    </div>

    {/* Right — action cluster */}
    <div className="flex items-center gap-3">
      {/* Utility buttons */}
      <button className="flex items-center gap-2 px-4 py-2 bg-(--color-bg-card)/70 border border-(--color-border-light) rounded-xl text-sm font-medium text-(--color-text-primary) shadow-(--shadow-sm) hover:bg-(--color-bg-card) transition-colors whitespace-nowrap">
        <Download size={15} className="shrink-0" />
        Export
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-(--color-bg-card)/70 border border-(--color-border-light) rounded-xl text-sm font-medium text-(--color-text-primary) shadow-(--shadow-sm) hover:bg-(--color-bg-card) transition-colors whitespace-nowrap">
        <Tag size={15} className="shrink-0" />
        Manage Categories
      </button>

      {/* Visual separator */}
      <div className="w-px h-6 bg-(--color-border-medium) shrink-0 transition-colors duration-200" />

      {/* Kanban / List view toggle */}
      <div className="flex items-center bg-(--color-bg-sidebar) rounded-xl p-1 gap-1 transition-colors duration-200">
        <button
          onClick={() => onViewChange("kanban")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            currentView === "kanban"
              ? "bg-(--color-bg-card) shadow-(--shadow-sm) text-(--color-primary-500)"
              : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
          }`}
        >
          <LayoutGrid size={14} />
          Kanban
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            currentView === "list"
              ? "bg-(--color-bg-card) shadow-(--shadow-sm) text-(--color-primary-500)"
              : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
          }`}
        >
          <List size={14} />
          List
        </button>
      </div>

      {/* New Task CTA - Robust colors for all themes */}
      <button
        onClick={onCreateTask}
        className="flex items-center gap-2 px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] transition-colors duration-200 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-100 whitespace-nowrap"
      >
        <Plus size={14} strokeWidth={3} />
        New Task
      </button>
    </div>
  </div>
);

export default TaskHeader;
