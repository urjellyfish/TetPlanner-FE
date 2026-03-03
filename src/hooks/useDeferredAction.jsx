import { useRef, useCallback } from "react";
import { toast } from "react-toastify";

const UNDO_DELAY = 5000; // 5 seconds

/**
 * useDeferredAction — delays an API call for `UNDO_DELAY` ms,
 * showing an undo toast so the user can cancel.
 *
 * Usage:
 *   const { scheduleAction, cancelAction } = useDeferredAction();
 *
 *   scheduleAction({
 *     actionFn: () => deleteTask(id),          // the actual API call
 *     onOptimistic: () => { ... },             // immediately update UI
 *     onCommitted: () => { ... },              // after API succeeds
 *     onUndo: () => { ... },                   // revert UI if user clicks undo
 *     onError: (err) => { ... },               // handle API errors (also reverts)
 *     toastMessage: "Task deleted",            // message in undo toast
 *     actionKey: id,                           // unique key to deduplicate
 *   });
 */
export const useDeferredAction = () => {
    // Map of actionKey → { timerId, toastId }
    const pendingActions = useRef(new Map());

    const cancelAction = useCallback((actionKey) => {
        const pending = pendingActions.current.get(actionKey);
        if (pending) {
            clearTimeout(pending.timerId);
            if (pending.toastId) {
                toast.dismiss(pending.toastId);
            }
            pendingActions.current.delete(actionKey);
        }
    }, []);

    const cancelAllActions = useCallback(() => {
        pendingActions.current.forEach((pending, key) => {
            clearTimeout(pending.timerId);
            if (pending.toastId) {
                toast.dismiss(pending.toastId);
            }
        });
        pendingActions.current.clear();
    }, []);

    const scheduleAction = useCallback(
        ({
            actionFn,
            onOptimistic,
            onCommitted,
            onUndo,
            onError,
            toastMessage = "Action performed",
            actionKey,
        }) => {
            // Cancel any existing pending action for the same key
            cancelAction(actionKey);

            // 1️⃣ Optimistically update UI
            if (onOptimistic) onOptimistic();

            // 2️⃣ Show undo toast
            const toastId = toast(
                ({ closeToast }) => (
                    <UndoToastContent
                        message={toastMessage}
                        onUndo={() => {
                            cancelAction(actionKey);
                            if (onUndo) onUndo();
                            closeToast();
                        }}
                    />
                ),
                {
                    autoClose: UNDO_DELAY,
                    closeOnClick: false,
                    draggable: false,
                    pauseOnHover: false,
                    closeButton: false,
                    className: "undo-toast",
                    onClose: () => {
                        // Toast closed without undo = no-op here, timer handles commit
                    },
                }
            );

            // 3️⃣ Schedule the actual API call
            const timerId = setTimeout(async () => {
                pendingActions.current.delete(actionKey);
                try {
                    await actionFn();
                    if (onCommitted) onCommitted();
                } catch (err) {
                    console.error("Deferred action failed:", err);
                    if (onUndo) onUndo(); // Revert on error
                    if (onError) {
                        onError(err);
                    } else {
                        toast.error(
                            err.response?.data?.message || "Action failed. Changes reverted."
                        );
                    }
                }
            }, UNDO_DELAY);

            pendingActions.current.set(actionKey, { timerId, toastId });
        },
        [cancelAction]
    );

    return { scheduleAction, cancelAction, cancelAllActions };
};

/**
 * UndoToastContent — small inline component for the undo toast message
 */
const UndoToastContent = ({ message, onUndo }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            width: "100%",
        }}
    >
        <span style={{ fontSize: "14px", fontWeight: 500 }}>{message}</span>
        <button
            onClick={onUndo}
            style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "inherit",
                padding: "4px 12px",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
            Undo
        </button>
    </div>
);

export default useDeferredAction;
