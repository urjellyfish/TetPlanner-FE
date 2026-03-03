import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
import CreateBudgetModal from "../components/shopping/CreateBudgetModal";
import BudgetAlertModal from "../components/shopping/BudgetAlertModal";

// APIs
import { budgetAPI } from "../api/budgetAPI";
import { shoppingItemAPI } from "../api/shoppingItemAPI";
import { occasionAPI } from "../api/occasion_temp";
import { shoppingCategoryAPI } from "../api/shoppingCategoryAPI";

const Shopping = () => {
  // --- Loading Flags ---
  const [itemsLoading, setItemsLoading] = useState(true);
  const [budgetsLoading, setBudgetsLoading] = useState(false);

  // --- Summary State ---
  const [summary, setSummary] = useState({
    totalBudget: 0,
    spentToday: 0,
    remainingBudget: 0,
  });

  // --- Budget & Core Data State ---
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [_categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);

  // --- Items & Pagination State ---
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [spendingData, setSpendingData] = useState([]);

  // --- Modal States ---
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCreateBudgetModalOpen, setIsCreateBudgetModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState("warning");
  const [alertPercentage, setAlertPercentage] = useState(80);
  const [currentItem, setCurrentItem] = useState(null);

  // --- Refs (Guards) ---
  const didInitialFetch = useRef(false);
  const alertedBudgets = useRef(new Set());

  // Lấy tên Budget hiện tại
  const currentBudgetName = useMemo(() => {
    if (items && items.length > 0 && items[0].budgetName) {
      return items[0].budgetName;
    }

    return selectedBudget ? selectedBudget.name : null;
  }, [items, selectedBudget]);
  // --- API Fetchers ---
  const fetchCategories = async () => {
    try {
      const res = await shoppingCategoryAPI.getShoppingCategories();
      if (res?.success) setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchOccasions = async () => {
    try {
      const res = await occasionAPI.getOccasions();
      if (res?.success) setOccasions(res.data || []);
    } catch (err) {
      console.error("Failed to load occasions:", err);
    }
  };

  const fetchBudgets = async () => {
    setBudgetsLoading(true);
    try {
      const res = await budgetAPI.getBudgets(0, 100);

      // An toàn trích xuất data (Chống Crash)
      if (res?.success && res?.data?.budgets) {
        const bList = res.data.budgets;
        setBudgets(bList);

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
      console.error("Fetch Budgets Error:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load budgets");
      }
    } finally {
      setBudgetsLoading(false);
    }
  };

  const fetchItems = useCallback(async () => {
    if (!selectedBudget) {
      setItemsLoading(false);
      return;
    }

    setItemsLoading(true);
    try {
      // 1. Lấy Summary an toàn
      const summaryRes = await budgetAPI.getBudgetSummary(selectedBudget.id);
      if (summaryRes?.success && summaryRes?.data) {
        const s = summaryRes.data;
        setSummary({
          totalBudget: s.totalAmount || 0,
          spentToday: s.actualSpent || 0,
          remainingBudget: (s.totalAmount || 0) - (s.actualSpent || 0),
        });

        // Xử lý Alert logic
        if (s.totalAmount > 0) {
          const percent = (s.actualSpent / s.totalAmount) * 100;
          if (percent >= 80 && !alertedBudgets.current.has(selectedBudget.id)) {
            setAlertType(percent >= 100 ? "critical" : "warning");
            setAlertPercentage(Math.round(percent));
            setIsAlertModalOpen(true);
            alertedBudgets.current.add(selectedBudget.id);
          }
        }
      }

      // 2. Lấy Items an toàn
      const itemsRes = await shoppingItemAPI.getItemsByBudget(
        selectedBudget.id,
        page,
        size,
      );
      if (itemsRes?.success && itemsRes?.data) {
        const pagedData = itemsRes.data;
        setItems(pagedData.content || []);
        setTotalElements(pagedData.totalElements || 0);
        setTotalPages(pagedData.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching items data:", error);
    } finally {
      setItemsLoading(false);
    }
  }, [page, size, selectedBudget]);

  // --- Effects ---
  useEffect(() => {
    if (!didInitialFetch.current) {
      didInitialFetch.current = true;
      fetchBudgets();
      fetchOccasions();
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- Handlers ---
  const handleToggleStatus = async (itemId, isChecked) => {
    try {
      const res = await shoppingItemAPI.updateItem(itemId, { isChecked });
      if (res?.success) {
        fetchItems();
        fetchBudgets();
      }
    } catch (err) {
      console.error("Failed to update item status:", err);
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

  // --- Render ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-(--color-bg-main) transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-(--color-text-primary) tracking-tight transition-colors duration-200">
            Budget & Shopping
          </h1>
          <div className="flex items-center gap-2 mt-2 text-(--color-text-secondary) font-medium transition-colors duration-200">
            <span className="text-(--color-primary-500)">
              Year of the Horse 2026
            </span>
            <span>•</span>
            {currentBudgetName && (
              <span className="flex items-center gap-1.5 bg-(--color-bg-card) px-2 py-0.5 rounded-lg border border-(--color-border-light) shadow-(--shadow-sm)">
                <Calendar size={14} /> {currentBudgetName}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-(--color-bg-card) border border-(--color-border-light) rounded-xl text-sm font-bold text-(--color-text-primary) hover:bg-(--color-bg-sidebar) hover:shadow-(--shadow-sm) transition-all">
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-(--color-bg-card) border border-(--color-border-light) rounded-xl text-sm font-bold text-(--color-text-primary) hover:bg-(--color-bg-sidebar) hover:shadow-(--shadow-sm) transition-all"
          >
            <Settings size={18} /> Manage Categories
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-(--btn-primary-bg) text-(--btn-primary-text) rounded-xl text-sm font-bold shadow-(--btn-primary-shadow) hover:opacity-(--btn-primary-hover-opacity) hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} className="stroke-3" /> New Item
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Chart & Budget Selection */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-(--color-bg-card) rounded-3xl p-6 md:p-8 shadow-(--shadow-sm) border border-(--color-border-light) relative transition-colors duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
              <div>
                <h3 className="text-xl font-bold text-(--color-text-primary) mb-1 transition-colors duration-200">
                  Spending by budgets
                </h3>
                <p className="text-sm text-(--color-text-muted) font-medium transition-colors duration-200">
                  Allocation across major Tet preparation areas
                </p>
              </div>

              {/* Budget Selector Dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                  disabled={budgetsLoading}
                  className="w-full sm:w-auto flex items-center justify-between gap-3 bg-(--color-bg-sidebar) hover:bg-(--color-border-light) px-4 py-2 rounded-xl border border-(--color-border-light) text-sm font-bold text-(--color-text-primary) transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate max-w-[150px]">
                    {selectedBudget?.name ||
                      (budgetsLoading ? "Loading..." : "Select Budget")}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${showBudgetDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showBudgetDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBudgetDropdown(false)}
                    ></div>
                    <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 bg-(--color-bg-card) rounded-2xl shadow-(--shadow-lg) border border-(--color-border-light) py-2 w-full sm:w-56 z-20 animate-in fade-in zoom-in-95 duration-200 transition-colors">
                      {budgets.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setSelectedBudget(b);
                            setPage(0);
                            setShowBudgetDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-primary-500)/10 hover:text-(--color-primary-500) truncate ${selectedBudget?.id === b.id ? "text-(--color-primary-500) bg-(--color-primary-500)/10" : "text-(--color-text-secondary)"}`}
                        >
                          {b.name}
                        </button>
                      ))}
                      <div className="border-t border-(--color-border-light) mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsCreateBudgetModalOpen(true);
                            setShowBudgetDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-(--color-primary-500) hover:bg-(--color-bg-sidebar) transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} /> New Budget
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="h-75">
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
          budgetName={currentBudgetName}
        />
      </div>

      {/* --- Modals --- */}
      <ShoppingItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        initialItem={currentItem}
        onSuccess={() => {
          fetchItems();
          fetchBudgets();
        }}
        budgetId={selectedBudget?.id}
        occasionId={selectedBudget?.occasionId}
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

      <CreateBudgetModal
        isOpen={isCreateBudgetModalOpen}
        onClose={() => setIsCreateBudgetModalOpen(false)}
        occasions={occasions}
        onSuccess={() => {
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
