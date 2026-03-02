import React from "react";
import { Wallet, ShoppingCart, Calculator, Pencil } from "lucide-react";

const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  iconBg,
  iconColor,
  textColor,
  onEdit,
}) => (
  <div className="card flex items-center justify-between p-6 bg-white shadow-sm rounded-xl relative group">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1 hover:bg-rose-50 rounded-md text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title="Edit Budget"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
      <span className={`text-2xl font-bold ${textColor || "text-gray-900"}`}>
        đ {amount.toLocaleString()}
      </span>
    </div>
    <div className={`p-3 rounded-lg ${iconBg}`}>
      {Icon && <Icon size={24} className={iconColor} />}
    </div>
  </div>
);

const ShoppingSummaryCards = ({ summary, onEditTotalBudget }) => {
  const {
    totalBudget = 0,
    spentToday = 0,
    remainingBudget = 0,
  } = summary || {};

  return (
    <>
      <SummaryCard
        title="Total Budget"
        amount={totalBudget}
        icon={Wallet}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
        onEdit={onEditTotalBudget}
      />
      <SummaryCard
        title="Spent Today"
        amount={spentToday}
        icon={ShoppingCart}
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
      />
      <SummaryCard
        title="Remaining Budget"
        amount={remainingBudget}
        icon={Calculator}
        iconBg="bg-green-50"
        iconColor="text-emerald-500"
        textColor="text-emerald-600"
      />
    </>
  );
};

export default ShoppingSummaryCards;
