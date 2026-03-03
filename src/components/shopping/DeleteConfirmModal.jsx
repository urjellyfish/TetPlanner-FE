import React from "react";
import { toast } from "react-toastify";
import { useShoppingItem } from "../../hooks/useShoppingItem";
import { useDeferredAction } from "../../hooks/useDeferredAction.jsx";
import { AlertTriangle } from "lucide-react";
import Modal from "../Modal";

const DeleteConfirmModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { deleteItem, loading, setLoading } = useShoppingItem();
  const { scheduleAction } = useDeferredAction();

  const handleDelete = () => {
    if (!item) return;

    // Close modal immediately so user sees the undo toast
    onClose();

    scheduleAction({
      actionKey: `delete-shopping-item-${item.id}`,
      toastMessage: `"${item.name}" deleted – Undo?`,
      onOptimistic: () => {
        // Let the parent know to refresh (remove item from list optimistically)
        onSuccess();
      },
      actionFn: async () => {
        const res = await deleteItem(item.id);
        // After actual deletion, refresh data from server
        onSuccess();
      },
      onUndo: () => {
        // Item was not actually deleted on backend, just re-fetch to restore
        onSuccess();
        toast.info("Delete undone.");
      },
      onError: (err) => {
        onSuccess(); // re-fetch to restore
        toast.error(err.response?.data?.message || "Failed to delete item");
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Item" maxWidth="400px">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-gray-500 mb-6 px-4">
          You are about to delete <span className="font-semibold text-gray-800">"{item?.name}"</span>. You can undo this within 5 seconds.
        </p>
        <div className="flex gap-3 w-full px-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
