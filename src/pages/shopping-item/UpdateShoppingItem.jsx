// // simulate backend for testing success toast (uncomment below function and use in place of updateItem)
// const fakeBackendUpdate = (id, data) =>
//   new Promise((res) =>
//     setTimeout(() => res({ success: true, data: { id } }), 500),
//   );

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useShoppingItem } from "../../hooks/useShoppingItem";
import FormCardLayout from "../../components/FormCardLayout";
import SuccessToast from "../../components/SuccessToast";

const UpdateShoppingItem = ({ occasions = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateItem, getItemById, loading, setLoading } = useShoppingItem();
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    price: 0,
    note: "",
    categoryId: 1,
    occasionId: "",
    isChecked: false,
  });

  // Fetch item data on mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemById(id);
        if (res.success) {
          setFormData({
            name: res.data.name || "",
            quantity: res.data.quantity || 1,
            price: res.data.price || 0,
            note: res.data.note || "",
            categoryId: res.data.categoryId || 1,
            occasionId: res.data.occasionId || "",
            isChecked: res.data.isChecked || false,
          });
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        toast.error("Failed to load item details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchItem();
  }, [id, getItemById]);

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
      const res = await updateItem(id, formData); //fakeBackendUpdate(id, formData);
      if (res.success) {
        toast(
          ({ closeToast }) => (
            <SuccessToast
              closeToast={closeToast}
              message="Item Updated Successfully!"
              description="Your item has been updated."
              onUndo={() => {
                toast.info("Changes reverted!");
                closeToast();
              }}
              onViewList={() => navigate("/shopping")}
            />
          ),
          {
            position: "top-center",
            autoClose: 10000,
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
      }
    } catch (err) {
      console.error("Error updating item:", err);
      toast.error(err.response?.data?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <FormCardLayout title="Loading..." onCancel={() => navigate(-1)}>
        <div style={{ textAlign: "center", padding: "var(--space-5)" }}>
          <p>Loading item details...</p>
        </div>
      </FormCardLayout>
    );
  }

  return (
    <FormCardLayout
      title="Update Item"
      subtitle="Modify your shopping item details"
      submitText="Save Changes"
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
          <label
            style={{
              display: "block",
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
              marginBottom: "var(--space-1)",
            }}
          >
            Item Name*
          </label>
          <input
            style={{
              width: "100%",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-sm)",
              border: error
                ? "1px solid var(--color-danger)"
                : "1px solid var(--color-border-medium)",
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-family-base)",
            }}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g. Buying Flowers"
          />
          {error && (
            <small
              style={{
                color: "var(--color-danger)",
                display: "block",
                marginTop: "var(--space-1)",
              }}
            >
              {error}
            </small>
          )}
        </div>

        {/* Category & Quantity */}
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <div style={{ flex: 2 }}>
            <label
              style={{
                display: "block",
                fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-semibold)",
                marginBottom: "var(--space-1)",
              }}
            >
              Category
            </label>
            <select
              name="categoryId"
              style={{
                width: "100%",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-medium)",
                backgroundColor: "var(--color-bg-card)",
                color: "var(--color-text-primary)",
              }}
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value={1}>Food & Beverage</option>
              <option value={2}>Decorations</option>
              <option value={3}>Others</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-semibold)",
                marginBottom: "var(--space-1)",
              }}
            >
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              style={{
                width: "100%",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-medium)",
                backgroundColor: "var(--color-bg-card)",
                color: "var(--color-text-primary)",
              }}
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
              marginBottom: "var(--space-1)",
            }}
          >
            Budget (VND)
          </label>
          <input
            type="number"
            name="price"
            style={{
              width: "100%",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border-medium)",
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
            }}
            value={formData.price}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Occasion */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
              marginBottom: "var(--space-1)",
            }}
          >
            Occasion
          </label>
          <select
            name="occasionId"
            style={{
              width: "100%",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border-medium)",
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
            }}
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

        {/* Note */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
              marginBottom: "var(--space-1)",
            }}
          >
            Note
          </label>
          <textarea
            name="note"
            style={{
              width: "100%",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border-medium)",
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
              height: "80px",
              resize: "none",
              fontFamily: "var(--font-family-base)",
            }}
            value={formData.note}
            onChange={handleChange}
            placeholder="Add note..."
          />
        </div>

        {/* Status Checkbox */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <input
            type="checkbox"
            name="isChecked"
            id="isChecked"
            checked={formData.isChecked}
            onChange={handleChange}
            style={{ cursor: "pointer" }}
          />
          <label
            htmlFor="isChecked"
            style={{
              fontSize: "var(--fs-sm)",
              cursor: "pointer",
              margin: 0,
            }}
          >
            Mark as completed
          </label>
        </div>
      </div>
    </FormCardLayout>
  );
};

export default UpdateShoppingItem;
