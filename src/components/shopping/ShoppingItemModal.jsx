import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useShoppingItem } from "../../hooks/useShoppingItem";
import { categoryAPI } from "../../api/categoryAPI";
import Modal from "../Modal";

const ShoppingItemModal = ({
  isOpen,
  onClose,
  initialItem = null,
  onSuccess,
  budgetId,
  occasionId,
  occasions = [],
}) => {
  const { createItem, updateItem, loading, setLoading } = useShoppingItem();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const isEdit = !!initialItem;

  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    price: 0,
    note: "",
    categoryId: 1,
    isChecked: false,
    budgetId: budgetId,
    occasionId: occasionId,
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.success) {
          setCategories(res.data);
          // Set default category if creating new
          if (!initialItem && res.data.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, [isOpen, initialItem]);

  useEffect(() => {
    if (isOpen) {
      if (initialItem) {
        setFormData({
          name: initialItem.name || "",
          quantity: initialItem.quantity || 1,
          price: initialItem.price || 0,
          note: initialItem.note || "",
          categoryId: initialItem.categoryId || 1,
          isChecked: initialItem.isChecked || false,
          budgetId: initialItem.budgetId || budgetId,
          occasionId: initialItem.occasionId || occasionId,
        });
      } else {
        setFormData({
          name: "",
          quantity: 1,
          price: 0,
          note: "",
          categoryId: 1,
          isChecked: false,
          budgetId: budgetId,
          occasionId: occasionId,
        });
      }
      setError("");
    }
  }, [isOpen, initialItem, budgetId, occasionId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (error && name === "name") setError("");
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await updateItem(initialItem.id, formData);
      } else {
        res = await createItem(formData);
      }

      if (res.success) {
        toast.success(`Item ${isEdit ? "updated" : "created"} successfully!`);
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Update Shopping Item" : "Add New Item"}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Item Name*
          </label>
          <input
            className={`w-full p-3 rounded-xl border ${error ? "border-rose-500" : "border-gray-200"} focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g. Buying Flowers"
            autoFocus
          />
          {error && <small className="text-rose-500 mt-1 block">{error}</small>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              value={formData.categoryId}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price (VND)
          </label>
          <input
            type="number"
            name="price"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            value={formData.price}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Occasion dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Occasion
          </label>
          <select
            name="occasionId"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            value={formData.occasionId}
            onChange={handleChange}
          >
            <option value="">Select Occasion</option>
            {occasions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Note
          </label>
          <textarea
            name="note"
            className="w-full p-3 rounded-xl border border-gray-200 h-24 resize-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add details..."
          />
        </div>

        {isEdit && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isChecked"
              id="isCheckedModal"
              checked={formData.isChecked}
              onChange={handleChange}
              className="w-4 h-4 text-rose-500 rounded border-gray-300 focus:ring-rose-500"
            />
            <label
              htmlFor="isCheckedModal"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Mark as completed
            </label>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
          >
            {loading ? "SAVING..." : isEdit ? "Save Changes" : "Save Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ShoppingItemModal;
