import { useState, useEffect } from "react";
import axios from "axios";

const CreateNewItem = () => {
  const [formData, setFormData] = useState({
    user_id: "UUID-12345",
    name: "",
    quantity: 1,
    price: 0,
    note: "",
    category_id: "",
    budget_id: "",
    occasion: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "name") setError(null);

    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/shopping-item/create", formData);
      alert("Save successful!");
    } catch (err) {
      console.error("Something went wrong, please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    card: {
      width: "95%",
      maxWidth: "574px",
      margin: "40px auto",
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      position: "relative",
      overflow: "hidden",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.2)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      fontSize: "18px",
    },
    header: { backgroundColor: "#E11D48", padding: "32px", color: "#fff" },
    form: {
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    row: {
      display: "flex",
      gap: "16px",
      flexDirection: isMobile ? "column" : "row",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
    },
    label: { fontSize: "14px", fontWeight: "600", color: "#4b5563" },
    input: {
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      backgroundColor: "#f9fafb",
      outline: "none",
    },
    errorBox: {
      borderRadius: "12px",
      border: "1px solid #FFE4E6",
      background: "#FFF1F2",
      padding: "12px 16px",
      marginTop: "4px",
      color: "#E11D48",
      fontSize: "13px",
      lineHeight: "1.5",
    },
    footer: { display: "flex", gap: "12px", marginTop: "10px" },
    btnSave: {
      flex: 4,
      padding: "16px",
      backgroundColor: "#E11D48",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    btnCancel: {
      flex: 1,
      padding: "16px",
      backgroundColor: "#f3f4f6",
      color: "#4b5563",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.card}>
      <button style={styles.closeBtn} onClick={() => alert("Closed")}>
        ×
      </button>

      <div style={styles.header}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          Add New Item
        </h2>
        <h3 style={{ margin: 0, fontSize: "14px", color: "#f3f4f6" }}>
          Plan ahead for a prosperous New Year.
        </h3>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Item Name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Item name*</label>
          <input
            style={{
              ...styles.input,
              borderColor: error ? "#E11D48" : "#d1d5db",
            }}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g: Buying Flowers"
          />
          {error && (
            <div style={styles.errorBox}>
              <strong>An error occurred.</strong>
              <br />
              {error}
            </div>
          )}
        </div>

        {/* Row: Category & Quantity */}
        <div style={styles.row}>
          <div style={{ ...styles.inputGroup, flex: 2 }}>
            <label style={styles.label}>Category</label>
            <select
              name="category_id"
              style={styles.input}
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="1">Shopping</option>
              <option value="2">Decoration</option>
              <option value="3">Other</option>
            </select>
          </div>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Quantity</label>
            <input
              style={styles.input}
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        {/* Estimate Budget */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Estimate Budget (VND)</label>
          <input
            style={styles.input}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        {/* Occasion*/}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Occasion</label>
          <input
            style={styles.input}
            type="text"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        {/* Note */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Note</label>
          <textarea
            style={{ ...styles.input, height: "60px", resize: "none" }}
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        {/* Footer Buttons */}
        <div style={styles.footer}>
          <button
            type="button"
            style={styles.btnCancel}
            onClick={() => alert("Cancelled")}
          >
            Cancel
          </button>
          <button type="submit" style={styles.btnSave} disabled={loading}>
            {loading ? "SAVING..." : "SAVE ITEM"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewItem;
