/**
 * NotificationModal – reusable centered modal for success/error feedback.
 * Props:
 *   type     : "success" | "error"
 *   title    : string
 *   message  : string | ReactNode
 *   onClose  : () => void
 *   actions  : Array<{ label, icon?, onClick, variant: "primary" | "secondary" }>
 *              – optional extra action buttons rendered below the message
 */
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function NotificationModal({ type = "success", title, message, onClose, actions = [] }) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-[480px] mx-4 bg-white rounded-2xl border border-slate-200 shadow-[0_25px_50px_0_rgba(0,0,0,0.2)] overflow-hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Đóng"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 pt-12 pb-8 px-8 text-center">
          {/* Icon */}
          <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
            {isSuccess
              ? <CheckCircle2 size={38} className="text-green-500" />
              : <AlertCircle  size={38} className="text-red-500"   />}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2 max-w-[360px]">
            <h2 className="text-2xl font-bold text-slate-800 font-['Plus_Jakarta_Sans']">{title}</h2>
            {message && (
              <p className="text-sm text-slate-500 font-['Plus_Jakarta_Sans'] leading-5">{message}</p>
            )}
          </div>

          {/* Action buttons */}
          {actions.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-center">
              {actions.map(({ label, icon: Icon, onClick, variant = "secondary" }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={
                    variant === "primary"
                      ? "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary-500)] text-[var(--color-text-inverse)] font-medium font-['Plus_Jakarta_Sans'] shadow-[var(--btn-primary-shadow)] hover:opacity-90 transition"
                      : "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-medium font-['Plus_Jakarta_Sans'] hover:bg-slate-200 transition"
                  }
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
