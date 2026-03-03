import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { shoppingCategoryAPI } from "../api/shoppingCategoryAPI";
import { ShoppingCategoryContext } from "../contexts/shoppingCategoryContext";

export const ShoppingCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // READ: Lấy danh sách tất cả categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shoppingCategoryAPI.getShoppingCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching shopping categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to load shopping categories.",
      );
    } finally {
      setLoading(false);
      setInitialFetchDone(true);
    }
  }, []);

  // Tự động gọi API lấy danh sách khi Provider được mount lần đầu tiên
  useEffect(() => {
    if (!initialFetchDone) {
      fetchCategories();
    }
  }, [fetchCategories, initialFetchDone]);

  // CREATE: Thêm category mới
  const addCategory = async (categoryData) => {
    setLoading(true);
    try {
      const res =
        await shoppingCategoryAPI.createShoppingCategory(categoryData);
      if (res.success) {
        // Cập nhật state ngay lập tức (Optimistic UI)
        setCategories((prev) => [...prev, res.data]);
        toast.success("Shopping category created successfully!");
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error creating shopping category:", error);
      toast.error(
        error.response?.data?.message || "Failed to create category.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE: Cập nhật category đã có
  const editCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const res = await shoppingCategoryAPI.updateShoppingCategory(
        id,
        categoryData,
      );
      if (res.success) {
        // Cập nhật lại item cụ thể trong mảng
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? res.data : cat)),
        );
        toast.success("Shopping category updated successfully!");
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error updating shopping category:", error);
      toast.error(
        error.response?.data?.message || "Failed to update category.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Xóa category
  const removeCategory = async (id) => {
    setLoading(true);
    try {
      const res = await shoppingCategoryAPI.deleteShoppingCategory(id);
      if (res.success) {
        // Lọc bỏ category vừa xóa khỏi state
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        toast.success("Shopping category deleted successfully!");
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting shopping category:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete category.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    categories,
    loading,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };

  return (
    <ShoppingCategoryContext.Provider value={value}>
      {children}
    </ShoppingCategoryContext.Provider>
  );
};
