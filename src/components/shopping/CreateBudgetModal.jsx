import React, { useState } from "react";
import { CircleDollarSign, X, Save } from "lucide-react";
import Modal from "../Modal";
import { budgetAPI } from "../../api/budgetAPI";
import { toast } from "react-toastify";

const CreateBudgetModal = ({ isOpen, onClose, onSuccess, occasions = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    occasionId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a budget name");
      return;
    }
    if (!formData.totalAmount || isNaN(formData.totalAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.occasionId) {
      toast.error("Please select an occasion");
      return;
    }

    setLoading(true);
    try {
      const res = await budgetAPI.createBudget({
        name: formData.name,
        totalAmount: parseFloat(formData.totalAmount),
        occasionId: formData.occasionId,
      });

      if (res.success) {
        toast.success("Budget created successfully!");
        setFormData({ name: "", totalAmount: "", occasionId: "" });
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create budget");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="500px" hideHeader={true}>
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-[#E11D48] p-6 text-white relative flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CircleDollarSign size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">New Budget Plan</h2>
              <p className="text-white/80 text-sm">Start a new financial plan for Tet.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-b-2xl flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Budget Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Traditional Food Budget"
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-gray-700 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Occasion
            </label>
            <select
              value={formData.occasionId}
              onChange={(e) => setFormData({ ...formData, occasionId: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-gray-700 font-medium appearance-none"
              required
            >
              <option value="">Choose an occasion...</option>
              {occasions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Total Budget (VNĐ)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium italic">
                đ
              </span>
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-gray-700 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E11D48] text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateBudgetModal;
