
export default function SalesPipelineBoard({ leads, onSelectLead }) {
  const stages = ["New", "Contacted", "Proposal Sent", "Converted"];

  const getStageColor = (stage) => {
    switch (stage) {
      case "New": return "border-t-blue-500";
      case "Contacted": return "border-t-orange-500";
      case "Proposal Sent": return "border-t-purple-500";
      case "Converted": return "border-t-emerald-500";
      default: return "border-t-zinc-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start overflow-x-auto pb-4 mt-4">
      {stages.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage);
        return (
          <div key={stage} className={`bg-[#141414] border border-zinc-800 border-t-2 ${getStageColor(stage)} rounded-xl p-3 min-w-[250px]`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{stage}</span>
              <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full font-mono">{stageLeads.length}</span>
            </div>

            {/* Cards Container */}
            <div className="space-y-2.5 min-h-[350px]">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="bg-[#1a1a1a] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3.5 cursor-pointer shadow-sm group transition-all"
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h5 className="font-bold text-sm text-zinc-100 group-hover:text-[#FFC107] transition-colors truncate">{lead.name}</h5>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${lead.type === "B2B" ? "bg-amber-500/10 text-amber-400" : "bg-cyan-500/10 text-cyan-400"}`}>{lead.type}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mb-4">{lead.company !== "—" ? lead.company : "Retail Client"}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                    <span>{lead.region}</span>
                    <span className="font-bold text-zinc-200">₹{Number(lead.value).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
              
              {stageLeads.length === 0 && (
                <div className="text-center py-12 border border-dashed border-zinc-900 rounded-xl text-xs text-zinc-600">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
