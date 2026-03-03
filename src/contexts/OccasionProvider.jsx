import React, { useState, useCallback } from "react";
import {
  getOccasions,
  getOccasionsByRange,
  getOccasionDetail,
  createOccasion,
  updateOccasion,
  deleteOccasion,
} from "../api/occasion_temp";
import { OccasionContext } from "./OccasionContext";
export function OccasionProvider({ children }) {
  // --- States ---
  const [occasions, setOccasions] = useState([]); // Danh sách các dịp
  const [currentOccasion, setCurrentOccasion] = useState(null); // Chi tiết 1 dịp (kèm tasks)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  // --- Actions ---

  /** Lấy toàn bộ danh sách các dịp */
  const fetchOccasions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOccasions();
      if (response.success) {
        setOccasions(response.data || []);
      }
      return response;
    } catch (err) {
      setError(err.message || "Không thể tải danh sách các dịp lễ.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Lấy danh sách dịp theo khoảng ngày (Ví dụ: Cho lịch/calendar) */
  const fetchOccasionsByRange = useCallback(async (from, to) => {
    setLoading(true);
    setError("");
    try {
      const response = await getOccasionsByRange(from, to);
      if (response.success) {
        setOccasions(response.data || []);
      }
      return response;
    } catch (err) {
      setError(
        err.message || "Không thể tải dữ liệu trong khoảng thời gian này.",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Lấy chi tiết một dịp cụ thể (bao gồm cả danh sách tasks) */
  const fetchOccasionById = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await getOccasionDetail(id);
      if (response.success) {
        setCurrentOccasion(response.data);
      }
      return response;
    } catch (err) {
      setError(err.message || "Không thể tải chi tiết dịp lễ.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Thêm mới một dịp lễ */
  const addOccasion = useCallback(async (occasionData) => {
    setLoading(true);
    setError("");
    try {
      const response = await createOccasion(occasionData);
      if (response.success) {
        // Cập nhật state cục bộ để UI thay đổi ngay lập tức
        setOccasions((prev) => [...prev, response.data]);
      }
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi tạo dịp lễ mới.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Cập nhật thông tin dịp lễ */
  const editOccasion = useCallback(async (id, occasionData) => {
    setLoading(true);
    setError("");
    try {
      const response = await updateOccasion(id, occasionData);
      if (response.success) {
        setOccasions((prev) =>
          prev.map((o) => (o.id === id ? response.data : o)),
        );
      }
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật thông tin.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Xóa một dịp lễ */
  const removeOccasion = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await deleteOccasion(id);
      if (response.success) {
        setOccasions((prev) => prev.filter((o) => o.id !== id));
      }
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi xóa dịp lễ.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OccasionContext.Provider
      value={{
        // States
        occasions,
        currentOccasion,
        loading,
        error,
        // Methods
        fetchOccasions,
        fetchOccasionsByRange,
        fetchOccasionById,
        addOccasion,
        editOccasion,
        removeOccasion,
        clearError,
      }}
    >
      {children}
    </OccasionContext.Provider>
  );
}
