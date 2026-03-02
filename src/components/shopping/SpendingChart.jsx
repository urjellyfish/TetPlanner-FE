import React from "react";

const SpendingChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { name: "Food", amount: 150 },
    { name: "Decoration", amount: 100 },
    { name: "Gifts", amount: 250 },
    { name: "Travel", amount: 80 }
  ];

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  return (
    <div className="h-full flex flex-col pt-4 pb-2">
      <div className="flex-1 flex items-end justify-between gap-4">
        {chartData.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          const isHighest = item.amount === maxAmount;
          
          return (
            <div key={index} className="flex-1 h-full flex flex-col justify-end items-center group">
              <div 
                className="w-full relative rounded-t-lg transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80 flex flex-col justify-end"
                style={{ 
                  height: `${Math.max(height, 5)}%`,
                  backgroundColor: isHighest ? '#F97316' : '#FB923C',
                  opacity: isHighest ? 1 : 0.6
                }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  ${item.amount.toLocaleString()}
                </div>
              </div>
              <span className="mt-4 text-sm font-medium text-gray-500">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingChart;
