import { Fragment } from "react";
import { X, Calendar, AlertTriangle, TrendingDown } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

import { getLogStatusStyle } from "../utils/payroll";

const defaultAttendanceDetail = {
  drawerSummary: { totalEmployees: 0, criticalCount: 0, warningCount: 0, lopImpact: "0 Days" },
  logs: []
};

const AttendanceDetailDrawer = ({ isOpen, onClose, data = defaultAttendanceDetail }) => {
    const activeData = data || defaultAttendanceDetail;
    const drawerSummary = activeData.drawerSummary || activeData.summary || defaultAttendanceDetail.drawerSummary;
    const logsList = activeData.logs || defaultAttendanceDetail.logs;

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-[#121214] border-l border-zinc-800 p-6 shadow-2xl text-white">
                                        
                                        {/* Drawer Header */}
                                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                            <div>
                                                <Dialog.Title className="text-base font-semibold text-yellow-500 uppercase tracking-wider">
                                                    Attendance & Leave Impact
                                                </Dialog.Title>
                                                <p className="text-xs text-zinc-400 mt-0.5">
                                                    Detailed payroll deduction analysis
                                                </p>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        {/* Top Stats */}
                                        <div className="grid grid-cols-2 gap-3 my-5">
                                            <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-3">
                                                <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium mb-1">
                                                    <TrendingDown size={14} /> Total Deduction
                                                </div>
                                                <p className="text-lg font-bold text-white">
                                                    {drawerSummary.totalDeduction || drawerSummary.estimatedLoss || "₹8,500"}
                                                </p>
                                            </div>
                                            <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-3">
                                                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium mb-1">
                                                    <AlertTriangle size={14} /> High LOP Cases
                                                </div>
                                                <p className="text-lg font-bold text-white">
                                                    {drawerSummary.highLopCases || "4 Members"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Logs List */}
                                        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                                Breakdown Log
                                            </h4>
                                            
                                            {logsList.map((log, idx) => (
                                                <div 
                                                    key={log.id || idx} 
                                                    className="bg-[#18181B] border border-zinc-800/80 hover:border-yellow-500/30 transition-all rounded-xl p-3.5 flex items-center justify-between"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-white">{log.name || log.employee}</span>
                                                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                                                                {log.dept || "Tech"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                                            <span>{log.type}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={10} /> {log.date}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-xs font-bold text-red-400 block">{log.impact}</span>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider ${getLogStatusStyle(log.status)}`}>
                                                            {log.status || "Warning"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Close Button */}
                                        <div className="border-t border-zinc-800 pt-4 mt-auto">
                                            <button 
                                                onClick={onClose}
                                                className="w-full rounded-full border border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 py-2 text-xs font-semibold text-yellow-500 transition-all"
                                            >
                                                Close Analysis
                                            </button>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default AttendanceDetailDrawer;



