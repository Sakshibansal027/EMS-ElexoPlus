// src/features/sales/components/TeamVisitsTracker.jsx
import { useState, useMemo } from 'react';

const TeamVisitsTracker = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Separate Log Controls for Today vs Monthly Popups
  const [isTodayLogOpen, setIsTodayLogOpen] = useState(false);
  const [isMonthlyLogOpen, setIsMonthlyLogOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState(null);

  const [teamDashboardData] = useState([
    { id: "SE001", name: "Amit Verma", todayClient: "Vertex Industries (B2B)", todayStatus: "Completed", todayTime: "10:30 AM", notes: "Discussed bulk contract pricing. Client ready to sign renewal next week.", monthTotal: 42, monthCompleted: 38, monthPending: 4, monthCompliance: 90 },
    { id: "SE002", name: "Rohit Sharma", todayClient: "Suresh Verma (Retail)", todayStatus: "In-Progress", todayTime: "11:45 AM", notes: "Demo session for new product variant ongoing. Client asking for discounts.", monthTotal: 40, monthCompleted: 33, monthPending: 7, monthCompliance: 83 },
    { id: "SE003", name: "Neha Singh", todayClient: "Nexus Labs (B2B)", todayStatus: "Scheduled", todayTime: "02:15 PM", notes: "Technical architecture alignment meeting. Stakeholders to join virtually.", monthTotal: 35, monthCompleted: 28, monthPending: 7, monthCompliance: 80 },
    { id: "SE004", name: "Sanjay Patel", todayClient: "Rohan Gupta (B2C)", todayStatus: "Scheduled", todayTime: "04:00 PM", notes: "Follow-up visit regarding the catalog shared on WhatsApp last Monday.", monthTotal: 30, monthCompleted: 22, monthPending: 8, monthCompliance: 73 },
    { id: "SE005", name: "Vikram Mehta", todayClient: "None (Day Ended)", todayStatus: "Completed", todayTime: "05:30 PM", notes: "All routine area tasks completed. EOD report pushed to the portal.", monthTotal: 28, monthCompleted: 18, monthPending: 10, monthCompliance: 64 }
  ]);

  const filteredData = useMemo(() => {
    return teamDashboardData.filter(se => {
      const targetQuery = searchQuery.toLowerCase().trim();
      if (!targetQuery) return true;
      return (
        se.name.toLowerCase().includes(targetQuery) ||
        se.id.toLowerCase().includes(targetQuery) ||
        (activeTab === 'today' && se.todayClient.toLowerCase().includes(targetQuery))
      );
    });
  }, [teamDashboardData, searchQuery, activeTab]);

  return (
    <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-6 shadow-2xl w-full text-gray-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f1f1f]/60 pb-5 mb-5">
        <div>
          <h2 className="text-white text-lg font-bold tracking-tight">Team Visits Analytics</h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time territorial logging and performance management</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search executive, client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141311] border border-[#262118] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cca43b]"
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-[10px] text-gray-500">✕</button>}
          </div>

          <div className="flex bg-[#141311] border border-[#262118] p-1 rounded-xl">
            <button onClick={() => { setActiveTab('today'); setSearchQuery(''); }} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'today' ? 'bg-[#cca43b] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
              Today's Live Logs
            </button>
            <button onClick={() => { setActiveTab('month'); setSearchQuery(''); }} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'month' ? 'bg-[#cca43b] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
              This Month Summary
            </button>
          </div>
        </div>
      </div>

      {/* RENDER MASTER TABLES */}
      <div className="overflow-x-auto w-full">
        {activeTab === 'today' ? (
          /* TODAY'S TABLE VIEW */
          <table className="w-full text-left text-sm text-gray-300 min-w-[650px]">
            <thead>
              <tr className="text-[#a6926d] text-xs font-semibold tracking-wider border-b border-[#1f1f1f]/80">
                <th className="py-3 px-2">Executive Name</th>
                <th className="py-3 px-2">Client / Meeting Account</th>
                <th className="py-3 px-2">Timeline Slot</th>
                <th className="py-3 px-2 text-center">Live Status</th>
                <th className="py-3 px-2 text-right">Action Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]/30">
              {filteredData.map((se) => (
                <tr key={se.id} className="hover:bg-[#15130f]/40 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-medium text-gray-200">{se.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{se.id}</div>
                  </td>
                  <td className="py-4 px-2 text-gray-300 font-medium">{se.todayClient}</td>
                  <td className="py-4 px-2 font-mono text-xs text-gray-400">{se.todayTime}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${se.todayStatus === 'In-Progress' ? 'bg-amber-950/40 text-amber-500 animate-pulse' : se.todayStatus === 'Completed' ? 'bg-green-950/40 text-green-400' : 'bg-blue-950/40 text-blue-400'}`}>
                      {se.todayStatus}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button onClick={() => setSelectedNotes({ execName: se.name, client: se.todayClient, text: se.notes })} className="text-xs text-gray-400 hover:text-[#cca43b] underline underline-offset-4">View Notes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* MONTHLY TABLE VIEW */
          <table className="w-full text-left text-sm text-gray-300 min-w-[600px]">
            <thead>
              <tr className="text-[#a6926d] text-xs font-semibold tracking-wider border-b border-[#1f1f1f]/80">
                <th className="py-3 px-2">SE Name</th>
                <th className="py-3 px-2 text-center">Total Visits Target</th>
                <th className="py-3 px-2 text-center">Completed Matrix</th>
                <th className="py-3 px-2 text-center">Pending Backlog</th>
                <th className="py-3 px-2 text-right">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]/30">
              {filteredData.map((se) => (
                <tr key={se.id} className="hover:bg-[#15130f]/40 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-medium text-gray-200">{se.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{se.id}</div>
                  </td>
                  <td className="py-4 px-2 text-center font-mono text-gray-300">{se.monthTotal}</td>
                  <td className="py-4 px-2 text-center font-mono text-green-400">{se.monthCompleted}</td>
                  <td className="py-4 px-2 text-center font-mono text-amber-500">{se.monthPending}</td>
                  <td className="py-4 px-2 text-right font-mono font-bold">
                    <span className={se.monthCompliance >= 80 ? 'text-green-400' : 'text-yellow-500'}>{se.monthCompliance}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DYNAMIC ACCURATE ACTION LINK FOOTER */}
      <div className="mt-5 pt-3 border-t border-[#1f1f1f]/50">
        {activeTab === 'today' ? (
          <button onClick={() => setIsTodayLogOpen(true)} className="text-[#cca43b] hover:text-yellow-400 font-bold text-xs tracking-wider flex items-center gap-1.5 uppercase transition-all">
            View All Today's Records <span className="text-sm font-normal">→</span>
          </button>
        ) : (
          <button onClick={() => setIsMonthlyLogOpen(true)} className="text-[#cca43b] hover:text-yellow-400 font-bold text-xs tracking-wider flex items-center gap-1.5 uppercase transition-all">
            View All Monthly Records <span className="text-sm font-normal">→</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* POPUP A: TODAY'S DETAILED TIMELINE BREAKDOWN MODAL */}
      {isTodayLogOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 bg-[#161616] border-b border-[#1f1f1f] flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-base">Today's Live Attendance & Meeting Logs</h3>
                <p className="text-xs text-gray-400">Current ongoing activities on the field right now</p>
              </div>
              <button onClick={() => setIsTodayLogOpen(false)} className="text-gray-400 hover:text-white text-xs bg-[#222] px-3 py-1.5 rounded-xl">✕ Close</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {teamDashboardData.map((item) => (
                  <div key={item.id} className="bg-[#141414] p-4 rounded-xl border border-[#222] flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{item.name} <span className="text-xs text-gray-500 font-mono">({item.id})</span></div>
                      <div className="text-xs text-[#cca43b] mt-1">Client: {item.todayClient}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-gray-400 block mb-1">{item.todayTime}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${item.todayStatus === 'In-Progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>{item.todayStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP B: MONTHLY PERFORMANCE AUDIT GRID MODAL */}
      {isMonthlyLogOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 bg-[#161616] border-b border-[#1f1f1f] flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-base">Monthly Aggregated Compliance Audit</h3>
                <p className="text-xs text-gray-400">Cumulative performance parameters for current billing cycle</p>
              </div>
              <button onClick={() => setIsMonthlyLogOpen(false)} className="text-gray-400 hover:text-white text-xs bg-[#222] px-3 py-1.5 rounded-xl">✕ Close</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-[#111] border-b border-[#222] text-gray-300 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">SE Identity</th>
                      <th className="p-4 text-center">Total Target</th>
                      <th className="p-4 text-center">Completed</th>
                      <th className="p-4 text-center">Pending Backlog</th>
                      <th className="p-4 text-right">Compliance Meter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]/40">
                    {teamDashboardData.map((item) => (
                      <tr key={item.id} className="hover:bg-[#141414]">
                        <td className="p-4 text-white font-medium">{item.name}</td>
                        <td className="p-4 text-center font-mono">{item.monthTotal}</td>
                        <td className="p-4 text-center font-mono text-green-400">{item.monthCompleted}</td>
                        <td className="p-4 text-center font-mono text-amber-500">{item.monthPending}</td>
                        <td className="p-4 text-right font-mono font-bold text-yellow-500">{item.monthCompliance}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP C: INDIVIDUAL VISIT NOTES VIEW */}
      {selectedNotes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-[#181818] border-b border-[#2a2a2a] flex justify-between items-center">
              <div>
                <h4 className="text-white font-semibold text-sm">Live Visit Log Notes</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{selectedNotes.execName} • {selectedNotes.client}</p>
              </div>
              <button onClick={() => setSelectedNotes(null)} className="text-gray-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-300 leading-relaxed bg-[#171717] p-3.5 border border-[#262626] rounded-lg font-mono whitespace-pre-wrap">{selectedNotes.text}</p>
            </div>
            <div className="px-5 py-3.5 bg-[#181818] border-t border-[#2a2a2a] flex justify-end">
              <button onClick={() => setSelectedNotes(null)} className="bg-[#cca43b] text-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">Acknowledge</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamVisitsTracker;
