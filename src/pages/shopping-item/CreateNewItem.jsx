import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useShoppingItem } from "../../hooks/useShoppingItem";
import FormCardLayout from "../../components/FormCardLayout";
import SuccessToast from "../../components/SuccessToast";

const CreateNewItem = ({
  currentBudgetId = "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  currentOccasionId = "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  occasions = [], // array of {id,name}
}) => {
  const navigate = useNavigate();
  const { createItem, undoItem, loading, setLoading } = useShoppingItem();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    price: 0,
    note: "",
    categoryId: 1,
    budgetId: currentBudgetId,
    occasionId: currentOccasionId,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (error && name === "name") setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  /* --- simulate backend for testing SuccessToast ---
  const fakeBackend = (data) =>
    new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: { id: "dummy-123" } }),
        500,
      ),
    );*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await createItem(formData); //fakeBackend(formData);
      if (res.success) {
        const newItemId = res.data.id;
        toast(
          ({ closeToast }) => (
            <SuccessToast
              closeToast={closeToast}
              message="Item Created Successfully!"
              description="Your item has been added to the list"
              undoText="Undo"
              viewText="Shopping List"
              onUndo={async () => {
                const undoRes = await undoItem(newItemId);
                if (undoRes.success) toast.info("Item Removed Successfully!");
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
        setFormData({ ...formData, name: "", quantity: 1, price: 0, note: "" });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCardLayout
      title="Add New Item"
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

        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <div style={{ flex: 2 }}>
            <label
              style={{
                display: "block",
                fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-semibold)",
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

        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
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
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
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
            }}
            value={formData.note}
            onChange={handleChange}
            placeholder="Add note..."
          />
        </div>
      </div>
    </FormCardLayout>
  );
};

export default CreateNewItem;
