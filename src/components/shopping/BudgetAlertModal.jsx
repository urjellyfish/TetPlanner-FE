import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Modal from "../Modal";

const BudgetAlertModal = ({ isOpen, onClose, type = "warning", percentage = 80 }) => {
  const isCritical = type === "critical" || percentage >= 100;
  
  // Styles based on type
  const bgClass = isCritical 
    ? "bg-gradient-to-br from-[#E11D48] to-[#FB7185] text-white" 
    : "bg-[#FDE68A] text-gray-900";
    
  const buttonPrimaryClass = isCritical
    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200"
    : "bg-[#D97706] text-white hover:bg-[#B45309] shadow-lg shadow-orange-100";
    
  const buttonSecondaryClass = isCritical
    ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
    : "bg-white/40 text-gray-700 hover:bg-white/60 backdrop-blur-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px" hideHeader={true}>
      <div className={`p-10 flex flex-col items-center text-center ${bgClass} rounded-2xl relative overflow-hidden`}>
        {/* Close Button Overlay */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Warning Icon */}
        <div className="mb-6 animate-bounce">
          <AlertTriangle size={64} className={isCritical ? "text-white" : "text-gray-900"} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-black uppercase tracking-tight mb-4 ${isCritical ? "text-white" : "text-gray-900"}`}>
          {isCritical ? "Budget Exceeded!" : "Running Low on Budget"}
        </h2>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-200/50 rounded-full mb-6 border border-black/10 relative overflow-hidden">
          <div 
            className="h-full bg-rose-600 rounded-full transition-all duration-1000 ease-out border-r-2 border-black/5"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {/* Message */}
        <p className={`text-sm font-bold mb-10 px-4 leading-relaxed ${isCritical ? "text-white/90" : "text-gray-700"}`}>
          {isCritical ? (
            <>
              <span className="text-black block mb-1">Attention:</span>
              You have reached {percentage}% of your budget limit. Please increase your budget or stop further transactions.
            </>
          ) : (
            <>
              You've used {percentage}% of your total budget.
              <br />You might want to slow down your spending.
            </>
          )}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={onClose}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold transition-all ${buttonSecondaryClass}`}
          >
            {isCritical ? "Close" : "Dismiss"}
          </button>
          <button
            onClick={onClose} // Logic for "Review Spending" or "Top Up" can be added
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold transition-all ${buttonPrimaryClass}`}
          >
            {isCritical ? "Top Up Budget" : "Review Spending"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BudgetAlertModal;
