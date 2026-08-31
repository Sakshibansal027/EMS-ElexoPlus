import { useState } from "react";
import { useSalesData } from "../hooks/useSalesData";
import { SalesCards } from "../components/SalesCards";
import LeadManagement from "./LeadManagement"; 

const SalesPage = () => {
  const { role, cards } = useSalesData();
  const [activeTab, setActiveTab] = useState("overview"); 

  return (
    <div className="p-6 text-white bg-[#0B0B0B] min-h-screen">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Sales Dashboard ({role})
          </h1>
          <p className="text-zinc-500 text-sm mt-1">ElexoPlus Internal Sales Portal</p>
        </div>
        <div className="text-right text-xs text-zinc-500">
          Status: <span className="text-green-500 font-medium">● System Live</span>
        </div>
      </div>

      {/* Modern Sub-Tabs Navigation */}
      <div className="flex border-b border-zinc-800 gap-6 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition ${
            activeTab === "overview" 
              ? "border-[#FFC107] text-[#FFC107]" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Sales Overview
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition ${
            activeTab === "leads" 
              ? "border-[#FFC107] text-[#FFC107]" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Lead Management
        </button>
      </div>

      {/* Tab Switching Content */}
      {activeTab === "overview" ? (
        <div className="space-y-6 animate-fade-in">
          <SalesCards cards={cards} />
        </div>
      ) : (
        <div className="animate-fade-in">
          <LeadManagement role={role} />
        </div>
      )}
    </div>
  );
};

export default SalesPage;
