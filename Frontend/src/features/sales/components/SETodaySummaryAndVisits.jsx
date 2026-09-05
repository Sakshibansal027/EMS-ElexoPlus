// src/features/sales/components/SETodaySummaryAndVisits.jsx
import { useState } from 'react';
import { 
  MapPin, 
  Users, 
  ShoppingBag, 
  Receipt, 
  IndianRupee, 
  ArrowRight, 
  X, 
  Search, 
  TrendingUp,
  CreditCard,
  Target
} from 'lucide-react';

const SETodaySummaryAndVisits = ({ summaryData, visitsData }) => {
  const summary = summaryData || {};
  const visitsList = visitsData || [];

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isVisitsDirectoryOpen, setIsVisitsDirectoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalExpenseAmount = summary?.leadExpenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const getVisitBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#0f2417] text-green-400 border-green-800/40';
      case 'In-Progress':
        return 'bg-[#291f0e] text-[#FFC107] border-[#4a3717] animate-pulse';
      case 'Scheduled':
        return 'bg-[#0e221d] text-cyan-400 border-cyan-800/40';
      case 'Cancelled':
        return 'bg-[#281116] text-red-400 border-red-800/40';
      default:
        return 'bg-zinc-800 text-gray-300 border-zinc-700';
    }
  };

  const filteredVisits = visitsList.filter(v => 
    v.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0907;
          border-radius: 4px;
          margin-top: 4px;
          margin-bottom: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFC107;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0a800;
        }

        .custom-scrollbar::-webkit-scrollbar-button:single-button {
          background-color: transparent;
          display: block;
          border-style: solid;
          height: 8px;
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement {
          border-width: 0 3px 5px 3px;
          border-color: transparent transparent #FFC107 transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment {
          border-width: 5px 3px 0 3px;
          border-color: #FFC107 transparent transparent transparent;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full">
        
        {/* ================= LEFT CARD: TODAY'S SUMMARY ================= */}
        <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
          <div>
            <h3 className="text-white text-base font-bold tracking-wide border-b border-[#1f1b14] pb-3 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#FFC107]" />
              Today's Performance Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#14120e] p-3 rounded-xl border border-[#262015]">
                  <span className="text-gray-400 text-[11px] font-medium flex items-center gap-1.5 mb-1">
                    <IndianRupee size={13} className="text-[#FFC107]" /> Order Value
                  </span>
                  <span className="font-mono font-bold text-[#FFC107] text-base block">
                    ₹{summary?.totalOrderValue?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-[#14120e] p-3 rounded-xl border border-[#262015]">
                  <span className="text-gray-400 text-[11px] font-medium flex items-center gap-1.5 mb-1">
                    <CreditCard size={13} className="text-green-400" /> Collection Received
                  </span>
                  <span className="font-mono font-bold text-green-400 text-base block">
                    ₹{summary?.paymentCollected?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#18150f] px-1">
                <span className="flex items-center gap-2 text-gray-300 font-medium">
                  <Target size={15} className="text-[#FFC107]" /> Productive Visits
                </span>
                <span className="font-mono font-bold text-white text-xs">
                  <span className="text-green-400">{summary?.productiveVisits}</span> / {summary?.totalVisits} Total
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#18150f] px-1">
                <span className="flex items-center gap-2 text-gray-300 font-medium">
                  <Users size={15} className="text-[#FFC107]" /> New Leads Onboarded
                </span>
                <span className="font-mono font-bold text-white text-xs">{summary?.newLeads}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#18150f] px-1">
                <span className="flex items-center gap-2 text-gray-300 font-medium">
                  <ShoppingBag size={15} className="text-[#FFC107]" /> Orders Created
                </span>
                <span className="font-mono font-bold text-white text-xs">{summary?.ordersCreated} Orders</span>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="flex items-center gap-2 text-gray-300 font-bold">
                    <Receipt size={15} className="text-[#FFC107]" /> Lead Expenses Log
                  </span>
                  <span className="font-mono text-red-400 font-bold text-xs">
                    Total: ₹{totalExpenseAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {summary?.leadExpenses?.map((expense) => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0a0907] border border-[#1d1810] text-[11px]"
                    >
                      <div>
                        <span className="text-gray-200 font-semibold block">{expense.leadName}</span>
                        <span className="text-gray-500 text-[10px]">{expense.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-red-400 block">
                          ₹{expense.amount.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-[9px] font-bold ${expense.status === 'Approved' ? 'text-green-500' : 'text-orange-400'}`}>
                          {expense.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= RIGHT CARD: TODAY'S VISITS ================= */}
        <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
          <div>
            <h3 className="text-white text-base font-bold tracking-wide border-b border-[#1f1b14] pb-3 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#FFC107]" />
              Today's Visits Log
            </h3>

            <div className="w-full overflow-x-auto rounded-xl border border-[#1f1a12] bg-[#0a0907] custom-scrollbar">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-[#12100d] text-gray-400 font-semibold tracking-wider border-b border-[#1f1a12] text-[11px]">
                    <th className="py-2.5 px-3 font-medium">Customer</th>
                    <th className="py-2.5 px-3 font-medium">Location</th>
                    <th className="py-2.5 px-3 font-medium">Check In</th>
                    <th className="py-2.5 px-3 font-medium">Check Out</th>
                    <th className="py-2.5 px-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1812]">
                  {visitsList.slice(0, 5).map((visit) => (
                    <tr 
                      key={visit.id} 
                      className="hover:bg-[#17140e]/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedVisit(visit)}
                    >
                      <td className="py-2.5 px-3 font-bold text-gray-200 group-hover:text-[#FFC107] transition-colors">
                        {visit.customer}
                      </td>
                      <td className="py-2.5 px-3 text-gray-400">{visit.location}</td>
                      <td className="py-2.5 px-3 text-gray-300 font-mono text-[11px]">{visit.checkIn}</td>
                      <td className="py-2.5 px-3 text-gray-300 font-mono text-[11px]">{visit.checkOut}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${getVisitBadge(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1712]">
            <button 
              onClick={() => setIsVisitsDirectoryOpen(true)}
              className="text-xs text-[#FFC107] font-bold hover:underline flex items-center gap-1.5 cursor-pointer transition-all hover:gap-2 group active:scale-95"
            >
              <span>View All Visits Log</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* --- MODAL 1: VISIT DETAILS POPUP --- */}
        {selectedVisit && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#241f17] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#FFC107] font-bold uppercase tracking-wider">Visit Activity Details</span>
                  <h4 className="text-white text-lg font-bold">{selectedVisit.customer}</h4>
                </div>
                <button 
                  onClick={() => setSelectedVisit(null)}
                  className="p-1.5 text-gray-400 hover:text-white bg-[#1a1813] hover:bg-[#28241d] rounded-xl cursor-pointer transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13] flex justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><MapPin size={14} /> Location:</span>
                  <span className="text-white font-semibold">{selectedVisit.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13]">
                    <span className="text-gray-400 block mb-1">Check In Time</span>
                    <span className="text-green-400 font-mono font-bold text-sm">{selectedVisit.checkIn}</span>
                  </div>
                  <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13]">
                    <span className="text-gray-400 block mb-1">Check Out Time</span>
                    <span className="text-red-400 font-mono font-bold text-sm">{selectedVisit.checkOut}</span>
                  </div>
                </div>

                <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13] space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Visit Purpose:</span>
                    <span className="text-gray-200 font-medium">{selectedVisit.purpose || 'General Visit'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Order Generated:</span>
                    <span className="text-[#FFC107] font-bold font-mono">₹{selectedVisit.orderValue?.toLocaleString('en-IN') || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Status:</span>
                    <span className={`font-bold ${selectedVisit.status === 'Completed' ? 'text-green-400' : selectedVisit.status === 'In-Progress' ? 'text-[#FFC107]' : 'text-red-400'}`}>
                      {selectedVisit.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedVisit(null)}
                className="w-full py-2 bg-[#FFC107] text-black font-bold rounded-xl text-xs hover:bg-[#e0a800] transition-colors cursor-pointer mt-2"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* --- MODAL 2: FULL VISITS DIRECTORY MODAL --- */}
        {isVisitsDirectoryOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-3xl max-h-[85vh] p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#241f17] pb-4">
                  <div>
                    <h3 className="text-white text-base font-bold flex items-center gap-2">
                      <MapPin size={20} className="text-[#FFC107]" />
                      All Visits Directory
                    </h3>
                    <p className="text-xs text-gray-400">Total Visits Recorded Today: {visitsList.length}</p>
                  </div>
                  <button 
                    onClick={() => setIsVisitsDirectoryOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-white bg-[#1a1813] hover:bg-[#28241d] rounded-xl cursor-pointer transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 relative">
                  <Search size={15} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search visits by Customer or Location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFC107]"
                  />
                </div>
              </div>

              <div className="overflow-y-auto my-4 rounded-xl border border-[#1f1a12] max-h-[48vh] pr-1.5 custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-[#17140e] text-gray-400 border-b border-[#292116] z-10">
                    <tr>
                      <th className="py-2.5 px-4">Customer</th>
                      <th className="py-2.5 px-4">Location</th>
                      <th className="py-2.5 px-4">Check In</th>
                      <th className="py-2.5 px-4">Check Out</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1812]">
                    {filteredVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-[#1a1711] transition-colors">
                        <td className="py-2.5 px-4 text-white font-bold">{visit.customer}</td>
                        <td className="py-2.5 px-4 text-gray-300">{visit.location}</td>
                        <td className="py-2.5 px-4 text-green-400 font-mono">{visit.checkIn}</td>
                        <td className="py-2.5 px-4 text-red-400 font-mono">{visit.checkOut}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVisitBadge(visit.status)}`}>
                            {visit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#241f17]">
                <button
                  onClick={() => setIsVisitsDirectoryOpen(false)}
                  className="px-4 py-2 bg-[#FFC107] text-black font-bold rounded-xl text-xs cursor-pointer hover:bg-[#e0a800] transition-colors"
                >
                  Close Directory
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default SETodaySummaryAndVisits;
