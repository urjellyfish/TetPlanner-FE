import React, { useState, useEffect, useCallback } from "react";
import { Plus, Download, Settings, ChevronDown, Calendar } from "lucide-react";
import { toast } from "react-toastify";

// Components
import ShoppingSummaryCards from "../components/shopping/ShoppingSummaryCards";
import SpendingChart from "../components/shopping/SpendingChart";
import ShoppingTable from "../components/shopping/ShoppingTable";
import ShoppingItemModal from "../components/shopping/ShoppingItemModal";
import DeleteConfirmModal from "../components/shopping/DeleteConfirmModal";
import CategoryModal from "../components/shopping/CategoryModal";
import UpdateBudgetModal from "../components/shopping/UpdateBudgetModal";
import BudgetAlertModal from "../components/shopping/BudgetAlertModal";

// APIs
import { budgetAPI } from "../api/budgetAPI";
import { shoppingItemAPI } from "../api/shoppingItemAPI";

const Shopping = () => {
  // loading flags for asynchronous data
  const [itemsLoading, setItemsLoading] = useState(true); // for shopping items
  const [budgetsLoading, setBudgetsLoading] = useState(false); // for budget list
  const [summary, setSummary] = useState({
    totalBudget: 0,
    spentToday: 0,
    remainingBudget: 0,
  });

  // Budget State
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  // placeholder for occasions list; could be fetched from API
  const [occasions, setOccasions] = useState([]);

  // Items State (Pagination)
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [spendingData, setSpendingData] = useState([]);

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState("warning");
  const [alertPercentage, setAlertPercentage] = useState(80);
  const [currentItem, setCurrentItem] = useState(null);

  // Initial load
  // React 18 StrictMode double-invokes effects in development, which causes
  // budgetAPI.getBudgets() to be called twice and produces duplicate 500 errors
  // if the server is misbehaving.  We guard with a ref so the request runs once.
  const didInitialFetch = React.useRef(false);
  useEffect(() => {
    if (!didInitialFetch.current) {
      fetchBudgets();
      didInitialFetch.current = true;
    }

    // temp hardcoded occasions until API available
    setOccasions([
      { id: "1", name: "New Year" },
      { id: "2", name: "Family Gathering" },
      { id: "3", name: "Travel" },
    ]);
  }, []);

  const fetchBudgets = async () => {
    setBudgetsLoading(true);
    try {
      const res = await budgetAPI.getBudgets(0, 100);
      if (res.success) {
        const bList = res.data.budgets;
        setBudgets(bList);

        // Map all budgets to spending data for the chart
        setSpendingData(
          bList.map((b) => ({
            name: b.name,
            amount: b.actualSpent || 0,
          })),
        );

        if (bList.length > 0 && !selectedBudget) {
          setSelectedBudget(bList[0]);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load budgets");
    } finally {
      setBudgetsLoading(false);
    }
  };

  const fetchItems = useCallback(async () => {
    if (!selectedBudget) return;
    setItemsLoading(true);
    try {
      // 1. Fetch Summary for selected budget
      const summaryRes = await budgetAPI.getBudgetSummary(selectedBudget.id);
      if (summaryRes.success) {
        const s = summaryRes.data;
        setSummary({
          totalBudget: s.totalAmount,
          spentToday: s.actualSpent,
          remainingBudget: s.totalAmount - s.actualSpent,
        });

        // Items from summary might not be paged, so let's fetch paged items instead if needed
        const processedItems = s.shoppingItems.map((item) => ({
          ...item,
          isChecked:
            item.isChecked !== undefined ? item.isChecked : item.checked, // Handle field name variation
        }));
        setItems(processedItems.slice(page * size, (page + 1) * size));
        setTotalElements(processedItems.length);
        setTotalPages(Math.ceil(processedItems.length / size));

        // NOTE: Spending chart is now handled by fetchBudgets to show all budgets

        // Check budget thresholds for alerts
        const percent = (s.actualSpent / s.totalAmount) * 100;
        if (percent >= 100) {
          setAlertType("critical");
          setAlertPercentage(Math.round(percent));
          setIsAlertModalOpen(true);
        } else if (percent >= 80) {
          setAlertType("warning");
          setAlertPercentage(Math.round(percent));
          setIsAlertModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load shopping items");
    } finally {
      setItemsLoading(false);
    }
  }, [selectedBudget, page, size]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleToggleStatus = async (itemId, isChecked) => {
    try {
      const res = await shoppingItemAPI.updateItem(itemId, { isChecked });
      if (res.success) {
        fetchItems();
        fetchBudgets(); // Refresh chart data
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  const openCreateModal = () => {
    setCurrentItem(null);
    setIsItemModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsItemModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Budget & Shopping
          </h1>
          <div className="flex items-center gap-2 mt-2 text-gray-500 font-medium">
            <span className="text-rose-500">Year of the Horse 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm">
              <Calendar size={14} /> BINH NGO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:shadow-md transition-all">
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:shadow-md transition-all"
          >
            <Settings size={18} /> Manage Categories
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} className="stroke-[3]" /> New Item
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Chart & Budget Selection */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 relative">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Spending by Category
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  Allocation across major Tet preparation areas
                </p>
              </div>

              {/* Budget Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                  disabled={budgetsLoading}
                  className="flex items-center gap-3 bg-gray-50/50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedBudget?.name || "Select Budget"}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${showBudgetDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {budgetsLoading && (
                  <span className="ml-2 text-sm text-gray-500">Loading…</span>
                )}

                {showBudgetDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBudgetDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-56 z-20 animate-in fade-in zoom-in-95 duration-200">
                      {budgets.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setSelectedBudget(b);
                            setPage(0);
                            setShowBudgetDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-rose-50 hover:text-rose-600 ${selectedBudget?.id === b.id ? "text-rose-600 bg-rose-50/50" : "text-gray-600"}`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="h-[300px]">
              <SpendingChart data={spendingData} />
            </div>
          </div>
        </div>

        {/* Right Section: Summary Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ShoppingSummaryCards
            summary={summary}
            onEditTotalBudget={() => setIsBudgetModalOpen(true)}
          />
        </div>
      </div>

      {/* Full Width Table */}
      <div className="mt-8">
        <ShoppingTable
          items={items}
          loading={itemsLoading}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalElements={totalElements}
        />
      </div>

      {/* Modals */}
      <ShoppingItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        initialItem={currentItem}
        onSuccess={() => {
          fetchItems();
          fetchBudgets();
        }}
        budgetId={selectedBudget?.id}
        occasionId={selectedBudget?.occasionId} // Assuming occasionId is on budget or passed
        occasions={occasions}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={currentItem}
        onSuccess={() => {
          fetchItems();
          fetchBudgets();
        }}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          fetchItems();
          fetchBudgets();
        }}
      />

      <UpdateBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budget={selectedBudget}
        onSuccess={() => {
          fetchItems();
          fetchBudgets();
        }}
      />

      <BudgetAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        type={alertType}
        percentage={alertPercentage}
      />
    </div>
  );
};

export default Shopping;
