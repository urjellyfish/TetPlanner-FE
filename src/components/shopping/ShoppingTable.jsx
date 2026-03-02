import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

const ShoppingTable = ({
  items = [],
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
    <div className="card p-0 bg-white shadow-sm rounded-xl overflow-hidden mt-8 relative">
      <div className="px-6 py-4 border-b border-gray-50 text-left">
        <h3 className="text-lg font-bold text-gray-800">
          Detailed Shopping List
        </h3>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-semibold tracking-wider">
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
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-left">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  {item.note && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-left">
                  {(() => {
                    console.log(item);
                    const catName = item.categoryName || "General";
                    const isFood = catName.toLowerCase().includes("food");
                    const isGift = catName.toLowerCase().includes("gift");
                    const isDecor = catName.toLowerCase().includes("decor");
                    
                    return (
                      <span
                        className="px-2 py-1 rounded text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: isFood ? "#FEF3C7" : isGift ? "#F3E8FF" : isDecor ? "#FCE7F3" : "#F3F4F6",
                          color: isFood ? "#D97706" : isGift ? "#7E22CE" : isDecor ? "#BE185D" : "#6B7280",
                        }}
                      >
                        {catName}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 text-gray-600 text-left">
                  ${item.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-600 text-left">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ${(item.price * item.quantity).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-left">
                  <button
                    onClick={() => onToggleStatus(item.id, !item.isChecked)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      item.isChecked
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-orange-50 text-orange-600 border border-orange-100"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.isChecked ? "bg-green-500" : "bg-orange-500"}`}
                    ></div>
                    {item.isChecked ? "Bought" : "Pending"}
                  </button>
                </td>
                <td className="px-4 py-4 text-right relative">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {activeMenu === item.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenu(null)}
                      ></div>
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-32 z-20 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => {
                            onEdit(item);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(item);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-20 text-center text-gray-400 font-medium"
                >
                  No items found in this budget.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">
          Showing {items.length} of {totalElements} items
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingTable;
