import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { categoryAPI } from "../../api/categoryAPI";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import Modal from "../Modal";

const CategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const res = await categoryAPI.createCategory({ name: newName });
      if (res.success) {
        toast.success("Category added");
        setNewName("");
        fetchCategories();
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      const res = await categoryAPI.updateCategory(id, { name: editName });
      if (res.success) {
        toast.success("Category updated");
        setEditingId(null);
        fetchCategories();
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure? This might affect items in this category.")
    )
      return;
    try {
      const res = await categoryAPI.deleteCategory(id);
      if (res.success) {
        toast.info("Category deleted");
        fetchCategories();
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Categories"
      maxWidth="450px"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border border-gray-200 rounded-lg outline-none focus:border-rose-500"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-4 text-gray-400">Loading...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group"
                >
                  {editingId === cat.id ? (
                    <input
                      className="flex-1 p-1 bg-white border border-rose-200 rounded outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-700 font-medium">
                      {cat.name}
                    </span>
                  )}

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
