import React, { useState } from "react";
import { Trash2 } from "lucide-react"; 
import CustomSelect from "../../employee-master/components/ui/CustomSelect"; 

export function ActivityTimeline({ activities, onActivitiesChange }) {
  const [newNote, setNewNote] = useState("");
  const [logType, setLogType] = useState("Call");


  const handleAddManualLog = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const manualLog = {
      id: Date.now(),
      type: logType,
      note: newNote.trim(),
      user: "Harshit Goel", 
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };

    onActivitiesChange([manualLog, ...activities]);
    setNewNote("");
  };

 
  const handleDeleteLog = (logId) => {
    const updatedActivities = activities.filter((act) => act.id !== logId);
    onActivitiesChange(updatedActivities);
  };

  const getLogBadge = (type) => {
    switch (type) {
      case "Call": 
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Call</span>;
      case "Meeting": 
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">Meeting</span>;
      case "Email": 
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">Email</span>;
      case "System": 
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">System</span>;
      default: 
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400">Note</span>;
    }
  };

  
  const logTypeOptions = [
    { label: "Call Log", value: "Call" },
    { label: "Meeting Note", value: "Meeting" },
    { label: "Email Sent", value: "Email" }
  ];

  return (
    <div className="space-y-4">
      {/* Manual Input Log Form */}
      <form onSubmit={handleAddManualLog} className="bg-[#1c1c1c] p-3 rounded-xl border border-zinc-800 space-y-3">
        <textarea
          placeholder="Add a comment or follow-up note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full bg-[#121212] text-xs text-white p-2 rounded-lg border border-zinc-800 focus:border-[#FFC107] outline-none min-h-[50px] resize-none"
        />
        <div className="flex justify-between items-center gap-2">
           <CustomSelect
            options={logTypeOptions}
            value={logType}
            onValueChange={(val) => setLogType(val)}
            variant="pill"
            width="w-32"
          />

          <button
            type="submit"
            className="bg-[#FFC107] hover:bg-[#e0a800] text-black font-bold text-[11px] px-3 py-1.5 rounded-full transition duration-150 whitespace-nowrap h-9"
          >
            Add Note
          </button>
        </div>
      </form>

    
      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-zinc-600 text-xs border border-dashed border-zinc-900 rounded-lg">
            No activity records found.
          </div>
        ) : (
          activities.map((act) => {
            const isSystem = act.type === "System";
            return (
              <div 
                key={act.id} 
                className={`p-3 rounded-xl border flex flex-col gap-1.5 transition duration-150 relative group ${
                  isSystem 
                    ? "bg-[#181818] border-zinc-800/50" 
                    : "bg-[#1f1f1f] border-zinc-800"
                }`}
              >
                {/* Header Row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getLogBadge(act.type)}
                    <span className="text-xs font-semibold text-zinc-300">
                      {isSystem ? "System Update" : act.user}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-zinc-500 font-medium group-hover:opacity-0 transition-opacity duration-100">{act.time}</span>
                </div>

               
                <p className="text-xs text-zinc-400 leading-normal pl-0.5 pr-6">
                  {act.note}
                </p>

               
                {!isSystem && (
                  <button
                    type="button"
                    onClick={() => handleDeleteLog(act.id)}
                    className="absolute right-3 top-3 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
                    title="Delete Record"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}