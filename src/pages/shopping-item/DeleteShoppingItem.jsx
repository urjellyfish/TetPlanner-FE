// simulate backend for testing success toast
// const fakeDelete = (id) =>
//   new Promise((res) => setTimeout(() => res({ success: true }), 500));

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useShoppingItem } from "../../hooks/useShoppingItem";
import SuccessToast from "../../components/SuccessToast";

const DeleteShoppingItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { deleteItem, undoItem, getItemById, loading, setLoading } =
    useShoppingItem();

  const [itemData, setItemData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleted, setDeleted] = useState(false); // prevent multiple deletions

  // Fetch item data on mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemById(id);
        if (res.success) {
          setItemData(res.data);
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteItem(id); //fakeDelete(id);
      if (res.success) {
        setDeleted(true);
        const deletedId = id;
        toast(
          ({ closeToast }) => (
            <SuccessToast
              closeToast={closeToast}
              message="Item Deleted Successfully!"
              description="Your item has been removed."
              undoText="Undo"
              viewText="Go Back"
              onUndo={async () => {
                // call undoItem from context to restore
                const undoRes = await undoItem(deletedId);
                if (undoRes.success) toast.info("Item Restored Successfully!");
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
        setTimeout(() => navigate("/shopping"), 500);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          padding: "var(--space-4)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "var(--color-bg-card)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "var(--space-6)",
            textAlign: "center",
          }}
        >
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "var(--space-4)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--color-bg-card)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            padding: "var(--space-6) var(--space-5)",
            color: "var(--color-text-inverse)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "var(--fs-2xl)",
              fontWeight: "var(--fw-semibold)",
            }}
          >
            Delete Item
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: "var(--space-6) var(--space-5)" }}>
          {/* Warning Icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-danger)",
                fontSize: "28px",
              }}
            >
              ⚠
            </div>
          </div>

          {/* Message */}
          <h3
            style={{
              margin: "0 0 var(--space-3) 0",
              fontSize: "var(--fs-md)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--color-text-primary)",
              textAlign: "center",
            }}
          >
            Delete "{itemData?.name}"?
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "var(--fs-sm)",
              color: "var(--color-text-secondary)",
              textAlign: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            Are you sure you want to delete this item?
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: "var(--space-3)",
                backgroundColor: "var(--color-bg-sidebar)",
                color: "var(--color-text-secondary)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
                fontSize: "var(--fs-md)",
                transition: "all 0.2s ease",
              }}
              onClick={() => navigate(-1)}
            >
              No, keep it
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "var(--space-3)",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "var(--color-text-inverse)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
                fontSize: "var(--fs-md)",
                transition: "all 0.2s ease",
                opacity: 1,
              }}
              onClick={handleDelete}
              disabled={deleted || loading}
            >
              {loading ? "DELETING..." : deleted ? "Deleted" : "Yes, delete it"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteShoppingItem;
