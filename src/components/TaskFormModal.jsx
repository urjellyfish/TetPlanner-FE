import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit3,
  Loader2,
  Calendar,
  Clock,
  Save,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CheckCircle2,
} from "lucide-react";

// ── Form constants ─────────────────────────────────────────────────────────────

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
const STATUSES = [
  { value: "TODO", label: "To Do", icon: Circle },
  { value: "IN_PROGRESS", label: "In Progress", icon: Clock },
  { value: "DONE", label: "Done", icon: CheckCircle2 },
];
const EMPTY = {
  title: "",
  description: "",
  category_id: "",
  occasion_id: "",
  priority: "medium",
  status: "TODO",
  start_date: "",
  start_time: "",
  due_date: "",
  due_time: "",
};

const validate = (v) => {
  const e = {};
  if (!v.title.trim()) e.title = "Title is required";
  if (!v.category_id) e.category_id = "Category is required";
  if (!v.priority) e.priority = "Priority is required";
  if (!v.status) e.status = "Status is required";
  if (v.start_date && v.due_date && v.due_date < v.start_date)
    e.due_date = "Due date cannot be before start date";
  return e;
};

// ── DatePicker ────────────────────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    if (value) return new Date(value + "T00:00:00");
    return new Date();
  });
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toISO = (y, mo, d) =>
    `${y}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const selectToday = () => {
    const t = new Date();
    onChange(toISO(t.getFullYear(), t.getMonth(), t.getDate()));
    setOpen(false);
  };

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div ref={ref} className="relative flex-1">
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <Calendar
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none"
        />
        <input
          readOnly
          value={displayValue}
          placeholder="Select date"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-(--color-border-light) bg-(--color-bg-card) text-base text-(--color-text-primary) outline-none focus:border-(--color-primary-400) focus:ring-2 focus:ring-(--color-primary-500)/20 transition cursor-pointer"
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-(--color-bg-card) rounded-xl shadow-(--shadow-lg) border border-(--color-border-light) p-4 w-72">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--color-bg-sidebar) transition text-(--color-text-secondary)"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-(--color-text-primary)">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--color-bg-sidebar) transition text-(--color-text-secondary)"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEK.map((d) => (
              <span
                key={d}
                className="text-center text-xs font-semibold text-(--color-text-muted) py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <span key={i} />;
              const thisDate = new Date(year, month, day);
              const isSelected =
                selected && thisDate.getTime() === selected.getTime();
              const isToday = thisDate.getTime() === todayDate.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(toISO(year, month, day));
                    setOpen(false);
                  }}
                  className={`h-8 w-full flex items-center justify-center rounded-lg text-sm transition
                    ${
                      isSelected
                        ? "bg-(--color-primary-500) text-(--color-text-inverse)"
                        : isToday
                          ? "border border-(--color-primary-400) text-(--color-primary-500) hover:bg-(--color-primary-500)/10"
                          : "hover:bg-(--color-bg-sidebar) text-(--color-text-primary)"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-(--color-border-light)">
            <button
              type="button"
              onClick={selectToday}
              className="flex-1 py-1.5 text-xs font-semibold text-(--color-primary-500) hover:bg-(--color-primary-500)/10 rounded-lg transition"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="flex-1 py-1.5 text-xs font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-sidebar) rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TimePicker ────────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const parseTime = (v) => {
  if (!v) return { h: 12, m: 0, ampm: "AM" };
  const [hh, mm] = v.split(":").map(Number);
  return { h: hh % 12 || 12, m: mm, ampm: hh >= 12 ? "PM" : "AM" };
};

const formatTime = (h, m, ampm) => {
  let hh = h % 12;
  if (ampm === "PM") hh += 12;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const hourRef = useRef(null);
  const minRef = useRef(null);
  const ref = useRef(null);

  const { h, m, ampm } = parseTime(value);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      if (hourRef.current) {
        const el = hourRef.current.querySelector("[data-selected]");
        if (el) el.scrollIntoView({ block: "center" });
      }
      if (minRef.current) {
        const el = minRef.current.querySelector("[data-selected]");
        if (el) el.scrollIntoView({ block: "center" });
      }
    }, 0);
  }, [open]);

  const displayValue = value
    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`
    : "";

  return (
    <div ref={ref} className="relative flex-1">
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <Clock
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none"
        />
        <input
          readOnly
          value={displayValue}
          placeholder="Select time"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-(--color-border-light) bg-(--color-bg-card) text-base text-(--color-text-primary) outline-none focus:border-(--color-primary-400) focus:ring-2 focus:ring-(--color-primary-500)/20 transition cursor-pointer"
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-(--color-bg-card) rounded-xl shadow-(--shadow-lg) border border-(--color-border-light) p-4 w-52">
          <div className="flex gap-3">
            {/* Hours */}
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-semibold text-(--color-text-muted) mb-2">
                Hour
              </span>
              <div
                ref={hourRef}
                className="h-40 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin"
              >
                {HOURS.map((hv) => (
                  <button
                    key={hv}
                    type="button"
                    data-selected={h === hv ? "" : undefined}
                    onClick={() => onChange(formatTime(hv, m, ampm))}
                    className={`w-full py-1 rounded-md text-sm text-center transition
                      ${h === hv ? "bg-(--color-primary-500) text-(--color-text-inverse)" : "hover:bg-(--color-bg-sidebar) text-(--color-text-primary)"}`}
                  >
                    {String(hv).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-semibold text-(--color-text-muted) mb-2">
                Min
              </span>
              <div
                ref={minRef}
                className="h-40 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin"
              >
                {MINUTES.map((mv) => (
                  <button
                    key={mv}
                    type="button"
                    data-selected={m === mv ? "" : undefined}
                    onClick={() => onChange(formatTime(h, mv, ampm))}
                    className={`w-full py-1 rounded-md text-sm text-center transition
                      ${m === mv ? "bg-(--color-primary-500) text-(--color-text-inverse)" : "hover:bg-(--color-bg-sidebar) text-(--color-text-primary)"}`}
                  >
                    {String(mv).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM / PM */}
            <div className="flex flex-col items-center gap-2 pt-7">
              {["AM", "PM"].map((ap) => (
                <button
                  key={ap}
                  type="button"
                  onClick={() => onChange(formatTime(h, m, ap))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition
                    ${ampm === ap ? "bg-(--color-primary-500) text-(--color-text-inverse)" : "bg-(--color-bg-sidebar) text-(--color-text-secondary) hover:bg-(--color-border-light)"}`}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TaskForm (inlined + exported for direct use) ──────────────────────────────
export function TaskForm({
  initialValues = EMPTY,
  onSubmit,
  onCancel,
  isSubmitting = false,
  categories = [],
  occasions = [],
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (field, value) =>
    setValues((prev) => ({ ...prev, [field]: value }));
  const blur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const err = (field) => touched[field] && errors[field];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({
      title: true,
      category_id: true,
      priority: true,
      status: true,
      due_date: true,
    });
    if (Object.keys(errs).length > 0) return;
    onSubmit({ ...values });
  };

  const isValid = Object.keys(validate(values)).length === 0;

  const dueDateError =
    values.start_date && values.due_date && values.due_date < values.start_date
      ? "Due date cannot be before start date"
      : null;

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-base outline-none transition ` +
    (err(field)
      ? "border-(--color-danger) bg-(--color-danger)/10 text-(--color-text-primary) focus:ring-2 focus:ring-(--color-danger)/20"
      : "border-(--color-border-light) bg-(--color-bg-card) text-(--color-text-primary) focus:border-(--color-primary-400) focus:ring-2 focus:ring-(--color-primary-500)/20");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-(--color-text-primary)">
          Title <span className="text-(--color-danger)">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter the task title..."
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          onBlur={() => blur("title")}
          className={inputCls("title")}
        />
        {err("title") && (
          <p className="text-xs text-(--color-danger)">{errors.title}</p>
        )}
      </div>

      {/* Category + Priority */}
      <div className="flex gap-6">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-(--color-text-primary)">
            Category <span className="text-(--color-danger)">*</span>
          </label>
          <div className="relative">
            <select
              value={values.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              onBlur={() => blur("category_id")}
              className={`${inputCls("category_id")} appearance-none pr-10 cursor-pointer`}
            >
              <option value="">Select category....</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none"
            />
          </div>
          {err("category_id") && (
            <p className="text-xs text-(--color-danger)">
              {errors.category_id}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-(--color-text-primary)">
            Priority
          </label>
          <div className="flex bg-(--color-bg-sidebar) rounded-xl p-1 gap-0.5">
            {PRIORITIES.map(({ value: p, label }) => (
              <button
                key={p}
                type="button"
                onClick={() => set("priority", p)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${values.priority === p ? "bg-(--color-bg-card) text-(--color-text-primary) shadow-(--shadow-sm)" : "text-(--color-text-secondary) hover:text-(--color-text-primary)"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Occasion */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-(--color-text-primary)">
          Occasion
        </label>
        <div className="relative">
          <select
            value={values.occasion_id}
            onChange={(e) => set("occasion_id", e.target.value)}
            className={`${inputCls("occasion_id")} appearance-none pr-10 cursor-pointer`}
          >
            <option value="">Select occasion (optional)...</option>
            {occasions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none"
          />
        </div>
      </div>

      {/* Timeline — Start */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-(--color-text-primary)">
          Start
        </label>
        <div className="flex gap-4">
          <DatePicker
            value={values.start_date}
            onChange={(v) => set("start_date", v)}
          />
          <TimePicker
            value={values.start_time}
            onChange={(v) => set("start_time", v)}
          />
        </div>
      </div>

      {/* Timeline — Due */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-(--color-text-primary)">
          Due
        </label>
        <div
          className={`flex gap-4 ${dueDateError ? "rounded-xl ring-2 ring-(--color-danger)/30" : ""}`}
        >
          <DatePicker
            value={values.due_date}
            onChange={(v) => set("due_date", v)}
          />
          <TimePicker
            value={values.due_time}
            onChange={(v) => set("due_time", v)}
          />
        </div>
        {dueDateError && (
          <p className="text-xs text-(--color-danger) flex items-center gap-1">
            {dueDateError}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-(--color-text-primary)">
          Status
        </label>
        <div className="flex gap-3">
          {STATUSES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("status", value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-xs font-medium transition ${values.status === value ? "border-(--color-primary-500) bg-(--color-primary-500)/10 text-(--color-primary-500)" : "border-(--color-border-light) text-(--color-text-secondary) hover:border-(--color-border-medium)"}`}
            >
              {Icon && <Icon size={18} />}
              <span>{label}</span>
            </button>
          ))}
        </div>
        {err("status") && (
          <p className="text-xs text-(--color-danger)">{errors.status}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-(--color-text-primary)">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Add task description..."
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-(--color-border-light) bg-(--color-bg-card) text-base text-(--color-text-primary) outline-none focus:border-(--color-primary-400) focus:ring-2 focus:ring-(--color-primary-500)/20 transition resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-2 border-t border-(--color-border-light) -mx-8 px-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-base font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-sidebar) transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-(--btn-primary-bg) text-(--btn-primary-text) font-bold text-base shadow-(--btn-primary-shadow) hover:opacity-(--btn-primary-hover-opacity) disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Save size={18} />
          {isSubmitting ? "Saving…" : "Save Task"}
        </button>
      </div>
    </form>
  );
}

// ── Modal header config ────────────────────────────────────────────────────────
const HEADER = {
  create: {
    icon: Plus,
    title: "Add New Task",
    sub: "Plan ahead for a prosperous New Year.",
  },
  edit: { icon: Edit3, title: "Edit Task", sub: "Update task details below." },
};

// ── TaskFormModal (exported) ───────────────────────────────────────────────────
export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
  categories = [],
  occasions = [],
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const { icon: Icon, title, sub } = HEADER[mode] ?? HEADER.create;

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
      <div className="w-xl bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-lg) overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 bg-(--gradient-primary)">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon size={24} className="text-(--color-text-inverse)" />
              <h1 className="text-2xl font-bold text-(--color-text-inverse)">
                {title}
              </h1>
            </div>
            <p className="text-sm text-(--color-text-inverse)/80">{sub}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-(--color-text-muted)/20 text-(--color-text-muted) hover:bg-(--color-text-inverse)/30 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pt-8 pb-6 overflow-y-auto max-h-[75vh]">
          {mode === "edit" && (!initialData || initialData._isLoading) ? (
            <div className="flex items-center justify-center py-16 text-(--color-text-muted) gap-3">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading task…</span>
            </div>
          ) : (
            (() => {
              const mappedInitialData = initialData
                ? {
                    id: initialData.id,
                    title: initialData.title || "",
                    description: initialData.description || "",
                    category_id: initialData.categoryId || "",
                    occasion_id: initialData.occasionId || "",
                    priority: initialData.priority?.toLowerCase() || "medium",
                    status: initialData.status || "TODO",
                    start_date: initialData.startDate || "",
                    start_time: initialData.startTime
                      ? initialData.startTime.slice(0, 5)
                      : "",
                    due_date: initialData.dueDate || "",
                    due_time: initialData.dueTime
                      ? initialData.dueTime.slice(0, 5)
                      : "",
                  }
                : undefined;

              return (
                <TaskForm
                  key={mappedInitialData?.id ?? "create"}
                  mode={mode}
                  initialValues={mappedInitialData}
                  categories={categories}
                  occasions={occasions}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                />
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
