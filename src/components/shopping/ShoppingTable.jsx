import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

// ── Style Maps for Categories ─────────────────────────────────────────
const CATEGORY_STYLES = {
  Food: "bg-(--color-warning)/15 text-(--color-warning)",
  Gift: "bg-(--color-info)/15 text-(--color-info)",
  Decoration: "bg-(--color-danger)/15 text-(--color-danger)",
  General: "bg-(--color-bg-sidebar) text-(--color-text-secondary)",
};

const ShoppingTable = ({
  items = [],
  loading = false,
  onToggleStatus,
  onEdit,
  onDelete,
  page = 0,
  totalPages = 0,
  onPageChange,
  totalElements = 0,
}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="card p-0 bg-(--color-bg-card) border border-(--color-border-light) shadow-(--shadow-sm) rounded-xl mt-8 relative transition-colors duration-200">
      <div className="px-6 py-4 border-b border-(--color-border-light) text-left transition-colors duration-200">
        <h3 className="text-lg font-bold text-(--color-text-primary) transition-colors duration-200">
          Detailed Shopping List
        </h3>
      </div>

      {/* Removed strict overflow-hidden to prevent dropdown clipping */}
      <div className="w-full min-h-75">
        <table className="w-full text-left">
          <thead className="bg-(--color-bg-sidebar) text-(--color-text-secondary) uppercase text-xs font-semibold tracking-wider transition-colors duration-200">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border-light) transition-colors duration-200">
            {/* FIXED BUG 1: Chained rendering logic */}
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-20 text-center text-(--color-text-muted) font-medium"
                >
                  Loading items...
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-(--color-bg-sidebar) transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-left">
                    <span className="font-medium text-(--color-text-primary) transition-colors duration-200">
                      {item.name}
                    </span>
                    {item.note && (
                      <p className="text-xs text-(--color-text-muted) mt-0.5 transition-colors duration-200">
                        {item.note}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors duration-200 ${
                        CATEGORY_STYLES[item.categoryName] ||
                        CATEGORY_STYLES.General
                      }`}
                    >
                      {item.categoryName || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-(--color-text-secondary) text-left transition-colors duration-200">
                    {/* FIXED BUG 2: Fallback to 0 to prevent toLocaleString crashes */}
                    ${(item.price || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-(--color-text-secondary) text-left transition-colors duration-200">
                    {item.quantity || 1}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-(--color-text-primary) transition-colors duration-200">
                    $
                    {(
                      (item.price || 0) * (item.quantity || 1)
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button
                      onClick={() => onToggleStatus(item.id, !item.isChecked)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        item.isChecked
                          ? "bg-(--color-success)/15 text-(--color-success) border border-(--color-success)/30"
                          : "bg-(--color-warning)/15 text-(--color-warning) border border-(--color-warning)/30"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isChecked
                            ? "bg-(--color-success)"
                            : "bg-(--color-warning)"
                        }`}
                      ></div>
                      {item.isChecked ? "Bought" : "Pending"}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right relative">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="text-(--color-text-muted) hover:text-(--color-text-primary) p-1 rounded-lg hover:bg-(--color-bg-sidebar) transition-colors cursor-pointer"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === item.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenu(null)}
                        ></div>
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-(--color-bg-card) rounded-xl shadow-(--shadow-lg) border border-(--color-border-light) py-1 w-32 z-20 animate-in fade-in zoom-in-95 duration-100 transition-colors">
                          <button
                            onClick={() => {
                              onEdit(item);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-bg-sidebar) hover:text-(--color-text-primary) transition-colors"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              onDelete(item);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-20 text-center text-(--color-text-muted) font-medium"
                >
                  No items found in this budget.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-(--color-bg-sidebar) border-t border-(--color-border-light) flex items-center justify-between transition-colors duration-200">
        <span className="text-sm text-(--color-text-secondary) font-medium transition-colors duration-200">
          Showing {items.length} of {totalElements} items
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="px-4 py-1.5 bg-(--color-bg-card) border border-(--color-border-medium) rounded-lg text-sm font-semibold text-(--color-text-primary) hover:bg-(--color-border-light) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-1.5 bg-(--color-bg-card) border border-(--color-border-medium) rounded-lg text-sm font-semibold text-(--color-text-primary) hover:bg-(--color-border-light) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingTable;
