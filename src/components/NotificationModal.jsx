/**
 * NotificationModal – reusable centered modal for success/error feedback.
 * Props:
 * type     : "success" | "error"
 * title    : string
 * message  : string | ReactNode
 * onClose  : () => void
 * actions  : Array<{ label, icon?, onClick, variant: "primary" | "secondary" }>
 * – optional extra action buttons rendered below the message
 */
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function NotificationModal({
  type = "success",
  title,
  message,
  onClose,
  actions = [],
}) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-120 mx-4 bg-(--color-bg-card) rounded-2xl border border-(--color-border-light) shadow-(--shadow-lg) overflow-hidden transition-colors duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-bg-sidebar) transition"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 pt-12 pb-8 px-8 text-center">
          {/* Icon */}
          <div
            className={`w-18 h-18 rounded-full flex items-center justify-center ${isSuccess ? "bg-(--color-success)/15" : "bg-(--color-danger)/15"}`}
          >
            {isSuccess ? (
              <CheckCircle2 size={38} className="text-(--color-success)" />
            ) : (
              <AlertCircle size={38} className="text-(--color-danger)" />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2 max-w-90">
            <h2 className="text-2xl font-bold text-(--color-text-primary) transition-colors duration-200">
              {title}
            </h2>
            {message && (
              <p className="text-sm text-(--color-text-secondary) leading-5 transition-colors duration-200">
                {message}
              </p>
            )}
          </div>

          {/* Action buttons */}
          {actions.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-center">
              {actions.map(
                ({ label, icon: Icon, onClick, variant = "secondary" }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={
                      variant === "primary"
                        ? "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--btn-primary-bg) text-(--btn-primary-text) font-medium shadow-(--btn-primary-shadow) hover:opacity-(--btn-primary-hover-opacity) transition"
                        : "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-bg-sidebar) text-(--color-text-primary) font-medium hover:bg-(--color-border-light) transition"
                    }
                  >
                    {Icon && <Icon size={16} />}
                    {label}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
