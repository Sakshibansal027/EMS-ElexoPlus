import React, { useState } from "react";
import { Pencil } from 'lucide-react';
import CustomSelect from "../../employee-master/components/ui/CustomSelect";

export function SalesTargets({ leads }) {
  const [activeView, setActiveView] = useState("asm");
  const [searchTerm, setSearchTerm] = useState("");
  

  const [selectedRegion, setSelectedRegion] = useState("All");
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [newTargetVal, setNewTargetVal] = useState("");

 
  const [regionQuotas, setRegionQuotas] = useState([
    { id: "reg-1", region: "North", asm: "Vikram Malhotra", target: 8000000, activeAgents: ["Harshit Goel"] },
    { id: "reg-2", region: "West", asm: "Rajesh Clarke", target: 5000000, activeAgents: ["Rohit Verma"] },
    { id: "reg-3", region: "Central", asm: "Sanjana Sen", target: 6000000, activeAgents: ["Neha Raj"] },
    { id: "reg-4", region: "South", asm: "Karthik Raja", target: 4000000, activeAgents: ["Amit"] }
  ]);

  const [seQuotas, setSeQuotas] = useState([
    { id: "se-1", name: "Harshit Goel", target: 5000000, role: "Senior Consultant", region: "North", reportingTo: "Vikram Malhotra" },
    { id: "se-2", name: "Rohit Verma", target: 3000000, role: "Sales Executive", region: "West", reportingTo: "Rajesh Clarke" },
    { id: "se-3", name: "Neha Raj", target: 4000000, role: "Account Manager", region: "Central", reportingTo: "Sanjana Sen" },
    { id: "se-4", name: "Amit", target: 2000000, role: "Junior Executive", region: "South", reportingTo: "Karthik Raja" }
  ]);

 
  const parseCurrencyToNumber = (valStr) => {
    if (!valStr) return 0;
    const cleanNum = String(valStr).replace(/[^0-9]/g, "");
    return cleanNum ? parseInt(cleanNum, 10) : 0;
  };

  const formatToINR = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

 
  const handleSaveQuota = (id, type) => {
    const numericVal = parseInt(newTargetVal.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numericVal) || numericVal <= 0) return;

    if (type === "asm") {
      setRegionQuotas(prev => prev.map(item => item.id === id ? { ...item, target: numericVal } : item));
    } else {
      setSeQuotas(prev => prev.map(item => item.id === id ? { ...item, target: numericVal } : item));
    }
    setEditingId(null);
    setNewTargetVal("");
  };

  
  const asmPerformance = regionQuotas
    .filter(t => selectedRegion === "All" || t.region === selectedRegion)
    .filter(t => t.asm.toLowerCase().includes(searchTerm.toLowerCase()) || t.region.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((territory) => {
      const regionConvertedLeads = leads.filter(l => {
        const matchesRegion = l.region === territory.region;
        const matchesStatus = l.status === "Converted";
        const matchesSegment = segmentFilter === "All" || l.type === segmentFilter;
        return matchesRegion && matchesStatus && matchesSegment;
      });

      const revenue = regionConvertedLeads.reduce((sum, l) => sum + parseCurrencyToNumber(l.value), 0);
      const percentage = territory.target > 0 ? Math.round(Math.min((revenue / territory.target) * 100, 100)) : 0;
      
      let health = { label: "Critical Quota", style: "bg-red-500/10 text-red-400 border-red-500/20" };
      if (percentage >= 75) health = { label: "Optimal Area", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      else if (percentage >= 40) health = { label: "Operational", style: "bg-amber-500/10 text-[#FFC107] border-[#FFC107]/20" };

      return { ...territory, revenue, percentage, health, count: regionConvertedLeads.length };
    });

  // 3. Data Processing & Pipeline Segregation (Ground SE)
  const sePerformance = seQuotas
    .filter(a => selectedRegion === "All" || a.region === selectedRegion)
    .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.role.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((agent) => {
      const agentConvertedLeads = leads.filter(l => {
        const matchesAgent = l.assignedTo === agent.name;
        const matchesStatus = l.status === "Converted";
        const matchesSegment = segmentFilter === "All" || l.type === segmentFilter;
        return matchesAgent && matchesStatus && matchesSegment;
      });

      const revenue = agentConvertedLeads.reduce((sum, l) => sum + parseCurrencyToNumber(l.value), 0);
      const percentage = agent.target > 0 ? Math.round(Math.min((revenue / agent.target) * 100, 100)) : 0;

      let health = { label: "Behind Quota", style: "bg-red-500/10 text-red-400 border-red-500/20" };
      if (percentage >= 100) health = { label: "Star Performer", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      else if (percentage >= 50) health = { label: "On Track", style: "bg-amber-500/10 text-[#FFC107] border-[#FFC107]/20" };

      return { ...agent, revenue, percentage, health, count: agentConvertedLeads.length };
    });

  return (
    <div className="bg-[#141414] border border-zinc-800 rounded-xl p-5 mb-6">
      
      {/* Component Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-5">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Sales Quotas & Conversion Performance
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Live metrics tracking based on closed corporate and consumer pipelines.
          </p>
        </div>

        {/* Dynamic Matrix View Switcher */}
        <div className="bg-[#1e1e1e] p-1 border border-zinc-800 rounded-lg flex items-center gap-1 self-start lg:self-auto">
          <button
            onClick={() => { setActiveView("asm"); setSearchTerm(""); setEditingId(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition duration-150 ${
              activeView === "asm" ? "bg-[#FFC107] text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            Territory Managers (ASM)
          </button>
          <button
            onClick={() => { setActiveView("se"); setSearchTerm(""); setEditingId(null); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition duration-150 ${
              activeView === "se" ? "bg-[#FFC107] text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            Ground Agents (SE)
          </button>
        </div>
      </div>

      {/* Production-grade Utility Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5 w-full">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto min-h-[36px]">
          <input
            type="text"
            placeholder={activeView === "asm" ? "Search ASM or territory..." : "Search agent name, role..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1a1a1b] border border-zinc-800/80 rounded-lg text-xs text-zinc-200 px-3 h-9 w-full sm:w-64 focus:outline-none focus:border-zinc-700 font-sans"
          />
          
          {/* 🚀 FIXED VALUE & ONVALUECHANGE TO BIND CORRECT STATE KEYS */}
          <CustomSelect
            options={[
              { label: "All Regions", value: "All" },
              { label: "North Region", value: "North" },
              { label: "West Region", value: "West" },
              { label: "East Region", value: "East" },
              { label: "South Region", value: "South" },
              { label: "Central Region", value: "Central" }
            ]}
            value={selectedRegion}
            onValueChange={(val) => setSelectedRegion(val)}
            variant="pill"
            width="w-40"
            placeholder="All Regions"
          />
        </div>

        {/* Dynamic Segment Pipeline Filter Selector */}
        <div className="flex items-center gap-2 bg-[#1a1a1b] border border-zinc-800/80 p-1 rounded-lg self-start md:self-auto h-9">
          <button 
            onClick={() => setSegmentFilter("All")}
            className={`px-2.5 h-full text-[10px] font-bold uppercase rounded transition ${segmentFilter === "All" ? "bg-zinc-800 text-white border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            All Deals
          </button>
          <button 
            onClick={() => setSegmentFilter("B2B")}
            className={`px-2.5 h-full text-[10px] font-bold uppercase rounded transition ${segmentFilter === "B2B" ? "bg-zinc-800 text-amber-400 border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            B2B Only
          </button>
          <button 
            onClick={() => setSegmentFilter("B2C")}
            className={`px-2.5 h-full text-[10px] font-bold uppercase rounded transition ${segmentFilter === "B2C" ? "bg-zinc-800 text-emerald-400 border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            B2C Only
          </button>
        </div>
      </div>

      {/* RENDER ASM CORE VIEW */}
      {activeView === "asm" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {asmPerformance.map((item) => (
            <div key={item.id} className="bg-[#101011] border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition duration-150 shadow-sm">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200 truncate">{item.asm}</h4>
                    <p className="text-[10px] text-zinc-500">ASM • {item.region} Territory</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${item.health.style} shrink-0`}>{item.health.label}</span>
                </div>
                <div className="flex">
                  <span className="text-[10px] font-medium text-zinc-400 bg-[#1e1e1f] border border-zinc-800/80 px-2 py-0.5 rounded-md">
                    Team: {item.activeAgents.length} Agent(s)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-mono"><span className="text-zinc-500">Region Revenue:</span><span className="text-emerald-400 font-bold">{formatToINR(item.revenue)}</span></div>
                
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Territory Target:</span>
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        value={newTargetVal}
                        onChange={(e) => setNewTargetVal(e.target.value)}
                        placeholder="e.g. 5000000"
                        className="bg-[#1a1a1b] border border-zinc-700 text-[10px] text-white rounded px-1.5 py-0.5 w-24 text-right focus:outline-none"
                      />
                      <button onClick={() => handleSaveQuota(item.id, "asm")} className="text-[10px] text-emerald-400 font-bold hover:underline">Set</button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] text-zinc-500 font-bold hover:underline">X</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400">{formatToINR(item.target)}</span>
                      <button 
                        onClick={() => { setEditingId(item.id); setNewTargetVal(String(item.target)); }}
                        className="text-[9px] text-[#FFC107]/70 hover:text-[#FFC107] font-semibold"
                      >
                       <Pencil size={14}/>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px]"><span className="text-zinc-500 font-medium">Quota Achieved</span><span className="text-[#FFC107] font-bold font-mono">{item.percentage}%</span></div>
                  <div className="w-full bg-[#1a1a1b] h-2 rounded-full overflow-hidden border border-zinc-800/80 p-[1px]"><div className="bg-gradient-to-r from-[#e0a800] to-[#FFC107] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} /></div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="text-zinc-500">Territory Status: {item.percentage >= 75 ? "Stable" : "Alert"}</span>
                <span className="font-bold text-zinc-300 font-mono bg-[#1a1a1b] px-2 py-0.5 rounded">Deals: {item.count}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER INDIVIDUAL SE VIEW */}
      {activeView === "se" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sePerformance.map((item) => (
            <div key={item.id} className="bg-[#101011] border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition duration-150 shadow-sm">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200 truncate">{item.name}</h4>
                    <p className="text-[10px] text-zinc-500">{item.region} Region</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${item.health.style} shrink-0`}>{item.health.label}</span>
                </div>
                
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="text-[10px] font-medium text-zinc-400 bg-[#1e1e1f] border border-zinc-800/80 px-2 py-1 rounded-md block text-center truncate">
                    Role: {item.role}
                  </div>
                  <div className="text-[10px] font-medium text-amber-400/90 bg-[#FFC107]/5 border border-[#FFC107]/10 px-2 py-1 rounded-md block text-center truncate">
                    Report To: {item.reportingTo}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-mono"><span className="text-zinc-500">Personal Closed:</span><span className="text-emerald-400 font-bold">{formatToINR(item.revenue)}</span></div>
                
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Personal Quota:</span>
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text"
                        value={newTargetVal}
                        onChange={(e) => setNewTargetVal(e.target.value)}
                        placeholder="e.g. 3000000"
                        className="bg-[#1a1a1b] border border-zinc-700 text-[10px] text-white rounded px-1.5 py-0.5 w-24 text-right focus:outline-none"
                      />
                      <button onClick={() => handleSaveQuota(item.id, "se")} className="text-[10px] text-emerald-400 font-bold hover:underline">Set</button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] text-zinc-500 font-bold hover:underline">X</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400">{formatToINR(item.target)}</span>
                      <button 
                        onClick={() => { setEditingId(item.id); setNewTargetVal(String(item.target)); }}
                        className="text-[9px] text-[#FFC107]/70 hover:text-[#FFC107] font-semibold"
                      >
                       <Pencil size={14}/>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px]"><span className="text-zinc-500 font-medium">Quota Achieved</span><span className="text-[#FFC107] font-bold font-mono">{item.percentage}%</span></div>
                  <div className="w-full bg-[#1a1a1b] h-2 rounded-full overflow-hidden border border-zinc-800/80 p-[1px]"><div className="bg-gradient-to-r from-[#e0a800] to-[#FFC107] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} /></div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="text-zinc-500">Tracking: Active</span>
                <span className="font-bold text-zinc-300 font-mono bg-[#1a1a1b] px-2 py-0.5 rounded">Deals: {item.count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}