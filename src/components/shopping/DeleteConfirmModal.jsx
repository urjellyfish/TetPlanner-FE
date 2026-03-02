import React from "react";
import { toast } from "react-toastify";
import { useShoppingItem } from "../../hooks/useShoppingItem";
import { AlertTriangle } from "lucide-react";
import Modal from "../Modal";

const DeleteConfirmModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { deleteItem, loading, setLoading } = useShoppingItem();

  const handleDelete = async () => {
    if (!item) return;
    setLoading(true);
    try {
      const res = await deleteItem(item.id);
      if (res.success) {
        toast.info("Item deleted successfully");
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Item" maxWidth="400px">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-gray-500 mb-6 px-4">
          You are about to delete <span className="font-semibold text-gray-800">"{item?.name}"</span>. This action cannot be undone.
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
