import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormCardLayout from "../../components/FormCardLayout";
import SuccessToast from "../../components/SuccessToast";

const CreateNewItem = ({
  currentUserId = "USER_01",
  currentOccasionId = "TET_2026",
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    user_id: currentUserId,
    name: "",
    quantity: 1,
    price: 0,
    note: "",
    category_id: null,
    occasion_id: currentOccasionId,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (error && name === "name") {
      setError("");
    }
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // --- LOGIC UNDO ---
  const handleUndo = async (itemId) => {
    try {
      await axios.delete(`/api/shopping-item/${itemId}`);
    } catch (err) {
      console.error("Undo failed", err);
      toast.error("Undo failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/shopping-item/create", formData);

      if (res.data.status === "success") {
        const newItemId = res.data.data.id;

        toast(
          ({ closeToast }) => (
            <SuccessToast
              closeToast={closeToast}
              onUndo={() => handleUndo(newItemId)}
              onViewList={() => navigate("/shopping-list")}
            />
          ),
          {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: true,
            closeButton: false,

            style: {
              background: "transparent",
              boxShadow: "none",
              width: "100vw",
              height: "100vh",
              padding: 0,
              margin: 0,
              left: 0,
              top: 0,
            },
          },
        );

        setFormData({ ...formData, name: "", quantity: 1, price: 0, note: "" });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const inputStyle = {
    width: "100%",
    padding: "var(--space-3)",
    border: "1px solid var(--color-border-medium)",
    borderRadius: "var(--radius-sm)",
    fontSize: "var(--fs-md)",
    fontFamily: "var(--font-family-base)",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "var(--fs-sm)",
    fontWeight: "var(--fw-semibold)",
    color: "var(--color-text-primary)",
    marginBottom: "var(--space-1)",
    display: "block",
  };

  return (
    <FormCardLayout
      title="Add New Item"
      subtitle="Plan ahead for a prosperous New Year."
      submitText="Save Item"
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {/* Item Name */}
        <div>
          <label style={labelStyle}>Item Name *</label>
          <input
            style={{
              ...inputStyle,
              borderColor: error
                ? "var(--color-danger)"
                : "var(--color-border-medium)",
            }}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g. Buying Flower"
          />
          {error && (
            <div
              style={{
                color: "var(--color-danger)",
                fontSize: "var(--fs-sm)",
                marginTop: "var(--space-1)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Category & Quantity */}
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Category</label>
            <select
              name="category_id"
              style={inputStyle}
              value={formData.category_id || ""}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="1">Food & Beverage</option>
              <option value="2">Decorations</option>
              <option value="3">Other</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Quantity</label>
            <input
              type="number"
              name="quantity"
              style={inputStyle}
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label style={labelStyle}>Estimate Budget (VND)</label>
          <input
            type="number"
            name="price"
            style={inputStyle}
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* Note */}
        <div>
          <label style={labelStyle}>Note</label>
          <textarea
            name="note"
            style={{ ...inputStyle, height: "80px", resize: "none" }}
            value={formData.note}
            onChange={handleChange}
            placeholder="Add some notes..."
          />
        </div>
      </div>
    </FormCardLayout>
  );
};

export default CreateNewItem;
