import React from "react";

const cardMap = {
  totalASM: "Total ASM",
  totalSE: "Total Sales Executives",
  totalSales: "Total Sales",
  targetAchievement: "Target Achievement",

  activeASM: "Active ASM",
  activeSE: "Active SE",
  performanceSummary: "Performance Summary",
  monthlyAchievement: "Monthly Achievement",

  teamTarget: "Team Target",
  teamAchievement: "Team Achievement",
  lowPerformers: "Low Performers",

  myTarget: "My Target",
  achievement: "Achievement",
  orders: "Orders",
  incentive: "Incentive",
};

export const SalesCards = ({ cards }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card}
          className="p-4 bg-white rounded-xl shadow-sm border"
        >
          <h3 className="text-sm text-gray-500">
            {cardMap[card]}
          </h3>
          <p className="text-xl font-bold mt-2">--</p>
        </div>
      ))}
    </div>
  );
};