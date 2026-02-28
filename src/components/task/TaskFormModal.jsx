
import { useState, useRef, useEffect } from "react";
import { Plus, Edit3, Loader2, Calendar, Clock, Save, ChevronDown, ChevronLeft, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { TASK_CATEGORIES as CATEGORIES } from "../../mocks/taskMock";

// ── Form constants ─────────────────────────────────────────────────────────────
// CATEGORIES imported from taskMock – swap for a real API call when backend is ready
const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = [
  { value: "Todo",        label: "To Do",       icon: Circle },
  { value: "In Progress", label: "In Progress", icon: Clock },
  { value: "Done",        label: "Done",        icon: CheckCircle2 },
];
const EMPTY = { title: "", category: "", priority: "Medium", status: "Todo", date: "", time: "", budget: "", note: "" };

const validate = (v) => {
  const e = {};
  if (!v.title.trim()) e.title    = "Title is required";
  if (!v.category)     e.category = "Category is required";
  if (!v.priority)     e.priority = "Priority is required";
  if (!v.status)       e.status   = "Status is required";
  return e;
};

// ── DatePicker ────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEK   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    if (value) return new Date(value + "T00:00:00");
    return new Date();
  });
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected   = value ? new Date(value + "T00:00:00") : null;
  const todayDate  = new Date(); todayDate.setHours(0, 0, 0, 0);
  const year       = view.getFullYear();
  const month      = view.getMonth();
  const firstDay   = new Date(year, month, 1).getDay();
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
    ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} className="relative flex-1">
      <div className="relative cursor-pointer" onClick={() => setOpen((o) => !o)}>
        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          readOnly
          value={displayValue}
          placeholder="Select date"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-900 font-['Plus_Jakarta_Sans'] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition cursor-pointer"
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-xl shadow-lg border border-slate-200 p-4 w-72">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setView(new Date(year, month - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-600">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-slate-800 font-['Plus_Jakarta_Sans']">
              {MONTHS[month]} {year}
            </span>
            <button type="button" onClick={() => setView(new Date(year, month + 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-600">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEK.map((d) => (
              <span key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <span key={i} />;
              const thisDate = new Date(year, month, day);
              const isSelected = selected && thisDate.getTime() === selected.getTime();
              const isToday    = thisDate.getTime() === todayDate.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onChange(toISO(year, month, day)); setOpen(false); }}
                  className={`h-8 w-full flex items-center justify-center rounded-lg text-sm font-['Plus_Jakarta_Sans'] transition
                    ${isSelected
                      ? "bg-blue-600 text-white"
                      : isToday
                        ? "border border-blue-400 text-blue-600 hover:bg-blue-50"
                        : "hover:bg-slate-100 text-slate-700"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={selectToday}
              className="flex-1 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition font-['Plus_Jakarta_Sans']">
              Today
            </button>
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              className="flex-1 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition font-['Plus_Jakarta_Sans']">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TimePicker ────────────────────────────────────────────────────────────────
const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

/** Parse stored "HH:MM" (24h) → { h, m, ampm } display values */
const parseTime = (v) => {
  if (!v) return { h: 12, m: 0, ampm: "AM" };
  const [hh, mm] = v.split(":").map(Number);
  return { h: hh % 12 || 12, m: mm, ampm: hh >= 12 ? "PM" : "AM" };
};

/** Convert 12h display values → stored "HH:MM" (24h) string */
const formatTime = (h, m, ampm) => {
  let hh = h % 12;
  if (ampm === "PM") hh += 12;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const hourRef = useRef(null);
  const minRef  = useRef(null);
  const ref     = useRef(null);

  const { h, m, ampm } = parseTime(value);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Scroll selected item into view when picker opens
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
      <div className="relative cursor-pointer" onClick={() => setOpen((o) => !o)}>
        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          readOnly
          value={displayValue}
          placeholder="Select time"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-900 font-['Plus_Jakarta_Sans'] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition cursor-pointer"
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-xl shadow-lg border border-slate-200 p-4 w-52">
          <div className="flex gap-3">
            {/* Hours */}
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-semibold text-slate-400 mb-2 font-['Plus_Jakarta_Sans']">Hour</span>
              <div ref={hourRef} className="h-40 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin">
                {HOURS.map((hv) => (
                  <button
                    key={hv}
                    type="button"
                    data-selected={h === hv ? "" : undefined}
                    onClick={() => onChange(formatTime(hv, m, ampm))}
                    className={`w-full py-1 rounded-md text-sm text-center font-['Plus_Jakarta_Sans'] transition
                      ${h === hv ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-700"}`}
                  >
                    {String(hv).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-semibold text-slate-400 mb-2 font-['Plus_Jakarta_Sans']">Min</span>
              <div ref={minRef} className="h-40 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin">
                {MINUTES.map((mv) => (
                  <button
                    key={mv}
                    type="button"
                    data-selected={m === mv ? "" : undefined}
                    onClick={() => onChange(formatTime(h, mv, ampm))}
                    className={`w-full py-1 rounded-md text-sm text-center font-['Plus_Jakarta_Sans'] transition
                      ${m === mv ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-700"}`}
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
                  className={`px-3 py-1.5 rounded-full text-xs font-bold font-['Plus_Jakarta_Sans'] transition
                    ${ampm === ap ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
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
export function TaskForm({ initialValues = EMPTY, onSubmit, onCancel, mode = "create", isSubmitting = false }) {
  const [values,  setValues]  = useState({ ...EMPTY, ...initialValues });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const set  = (field, value) => setValues((prev) => ({ ...prev, [field]: value }));
  const blur = (field)        => setTouched((prev) => ({ ...prev, [field]: true }));
  const err  = (field)        => touched[field] && errors[field];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ title: true, category: true, priority: true, status: true });
    if (Object.keys(errs).length > 0) return;
    onSubmit({ ...values, budget: values.budget ? Number(values.budget) : 0 });
  };

  const isValid = Object.keys(validate(values)).length === 0;

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border font-['Plus_Jakarta_Sans'] text-base text-slate-900 outline-none transition ` +
    (err(field)
      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
      : "border-slate-200 bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">
          Title <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter the task title..."
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          onBlur={() => blur("title")}
          className={inputCls("title")}
        />
        {err("title") && <p className="text-xs text-red-500 font-['Plus_Jakarta_Sans']">{errors.title}</p>}
      </div>

      {/* Category + Priority */}
      <div className="flex gap-6">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">Category <span className="text-rose-600">*</span></label>
          <div className="relative">
            <select
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              onBlur={() => blur("category")}
              className={`${inputCls("category")} appearance-none pr-10 cursor-pointer`}
            >
              <option value="">Select category....</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {err("category") && <p className="text-xs text-red-500">{errors.category}</p>}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">Priority</label>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set("priority", p)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold font-['Plus_Jakarta_Sans'] transition ${values.priority === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">Timeline</label>
        <div className="flex gap-4">
          <DatePicker value={values.date} onChange={(v) => set("date", v)} />
          <TimePicker value={values.time} onChange={(v) => set("time", v)} />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">Status</label>
        <div className="flex gap-3">
          {STATUSES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("status", value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-xs font-medium font-['Plus_Jakarta_Sans'] transition ${values.status === value ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-100 text-slate-500 hover:border-slate-300"}`}
            >
              {Icon && <Icon size={18} />}
              <span>{label}</span>
            </button>
          ))}
        </div>
        {err("status") && <p className="text-xs text-red-500">{errors.status}</p>}
      </div>

      {/* Budget */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">Estimated Budget (VNĐ)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold font-['Plus_Jakarta_Sans'] text-base">₫</span>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={values.budget}
            onChange={(e) => set("budget", e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-900 font-['Plus_Jakarta_Sans'] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>
      </div>

      {/* Note */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 font-['Plus_Jakarta_Sans']">Note</label>
        <textarea
          rows={3}
          placeholder="Add additional notes..."
          value={values.note}
          onChange={(e) => set("note", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-900 font-['Plus_Jakarta_Sans'] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-2 border-t border-slate-100 -mx-8 px-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-base font-semibold text-slate-500 font-['Plus_Jakarta_Sans'] hover:bg-slate-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white font-bold text-base font-['Plus_Jakarta_Sans'] shadow-[0_4px_6px_0_#fecdd3] hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
  create: { icon: Plus,  title: "Add New Task", sub: "Plan ahead for a prosperous New Year." },
  edit:   { icon: Edit3, title: "Edit Task",     sub: "Update task details below." },
};

// ── TaskFormModal (exported) ───────────────────────────────────────────────────
export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData = null, mode = "create" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const { icon: Icon, title, sub } = HEADER[mode] ?? HEADER.create;

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 overflow-y-auto py-10">
      <div className="w-[576px] bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 bg-rose-600">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon size={24} className="text-white" />
              <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">{title}</h1>
            </div>
            <p className="text-sm text-rose-200 font-['Plus_Jakarta_Sans']">{sub}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pt-8 pb-6 overflow-y-auto max-h-[75vh]">
          {mode === "edit" && !initialData ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-['Plus_Jakarta_Sans']">Loading task…</span>
            </div>
          ) : (
            <TaskForm
              key={initialData?.id ?? "create"}
              mode={mode}
              initialValues={initialData ?? undefined}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}