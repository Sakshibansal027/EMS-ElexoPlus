// src/features/sales/components/TeamOrders.jsx
import React, { useState } from 'react';
import { useTeamOrders } from '../hooks/useTeamOrders';
import CustomSelect from "../../../features/employee-master/components/ui/CustomSelect"
const TeamOrders = () => {
    const { orders, territories, isLoading, error, allocateTerritory } = useTeamOrders();
    const [isAllOrdersOpen, setIsAllOrdersOpen] = useState(false);
    const [activeAssigneeId, setActiveAssigneeId] = useState(null); // Track custom select dropdown display

    const formatValue = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    if (isLoading) {
        return (
            <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-6 shadow-2xl w-full h-[350px] flex items-center justify-center">
                <div className="text-sm text-gray-500 animate-pulse font-medium">Syncing territory allocation matrices...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-6 shadow-2xl w-full select-none text-gray-200">

            {/* Module Title */}
            <div className="mb-5 flex justify-between items-center">
                <div>
                    <h2 className="text-white text-base font-bold tracking-wide">Team Orders & Allocation</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">North Region Territory Assignment Hub</p>
                </div>
            </div>

            {/* Orders & Assignment Table Grid */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                        <tr className="text-gray-500 font-semibold tracking-wider border-b border-[#1f1f1f]/50">
                            <th className="pb-3 px-2 font-medium">Order No.</th>
                            <th className="pb-3 px-2 font-medium">SE Details / Territory</th>
                            <th className="pb-3 px-2 font-medium">Value (₹)</th>
                            <th className="pb-3 px-2 text-center font-medium">Status</th>
                            <th className="pb-3 px-2 text-right font-medium">Assignment Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f1f1f]/30">
                        {orders.map((order) => (
                            <tr key={order.orderNo} className="hover:bg-[#15130f]/30 transition-colors duration-150 relative">

                                {/* Order Identity */}
                                <td className="py-4 px-2 font-medium text-gray-300 tracking-wide">{order.orderNo}</td>

                                {/* SE Identity + Allocated Live Location Territory badge */}
                                <td className="py-4 px-2">
                                    <div className="text-gray-200 font-bold">{order.seName}</div>
                                    <div className="text-[11px] text-[#cca43b]/80 font-medium mt-0.5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#cca43b] rounded-full inline-block"></span>
                                        {order.territory}
                                    </div>
                                </td>

                                {/* Total Value */}
                                <td className="py-4 px-2 font-mono text-gray-300">{formatValue(order.value)}</td>

                                {/* Dual Condition Strict Status State */}
                                <td className="py-4 px-2 text-center">
                                    {order.status === 'Confirmed' ? (
                                        <span className="inline-block min-w-[85px] px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#211a10] text-[#cca43b]/90 border border-[#42341d]/50">Confirmed</span>
                                    ) : (
                                        <span className="inline-block min-w-[85px] px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#111c15] text-green-500/90 border border-green-950/50">Delivered</span>
                                    )}
                                </td>

                                {/* ACTION LAYER: ASM Dropdown Component Selector */}
                                <td className="py-4 px-2 text-right">
                                    {activeAssigneeId === order.id ? (
                                        <div className="inline-block relative z-10">
                                            <CustomSelect
                                                value={order.territory}
                                                onValueChange={(newValue) => {
                                                    allocateTerritory(order.id, newValue);
                                                    setActiveAssigneeId(null); // Assign hote hi select grid context close
                                                }}
                                                options={territories} // Hamari territories array pass kar di
                                                variant="pill"        // Premium pill variant for minimal clean sizing
                                                width="w-full max-w-[140px]" // Dynamic custom width control
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveAssigneeId(order.id)}
                                            className="text-[11px] bg-[#141311] hover:bg-[#cca43b] text-gray-400 hover:text-black border border-[#262118] hover:border-[#cca43b] px-2.5 py-1 rounded-lg font-semibold transition-all duration-150"
                                        >
                                            Re-Assign Area
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Navigation */}
            <div className="mt-5 pt-2 border-t border-[#1f1f1f]/50">
                <button
                    onClick={() => setIsAllOrdersOpen(true)}
                    className="text-[#cca43b] hover:text-yellow-400 font-bold text-xs tracking-wider flex items-center gap-1.5 uppercase transition-all"
                >
                    View Regional Breakdown Logs <span className="text-sm font-normal">→</span>
                </button>
            </div>

            {/* MODAL POPUP: COMPLETE REGIONAL OVERVIEW OVERLAY */}
            {isAllOrdersOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                        <div className="px-6 py-4 bg-[#161616] border-b border-[#1f1f1f] flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-bold text-base">North Region Territory Mapping Ledger</h3>
                                <p className="text-xs text-gray-400">Active live operational mapping control status sheet</p>
                            </div>
                            <button onClick={() => setIsAllOrdersOpen(false)} className="text-gray-400 hover:text-white text-xs bg-[#222] px-3 py-1.5 rounded-xl">✕ Close</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="space-y-3">
                                {orders.map((item) => (
                                    <div key={item.id} className="bg-[#141414] p-4 rounded-xl border border-[#222] flex justify-between items-center">
                                        <div>
                                            <div className="text-white font-bold text-sm">{item.seName}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">Assigned Target Block: <span className="text-[#cca43b] font-medium">{item.territory}</span></div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-mono text-gray-300 font-bold">₹{formatValue(item.value)}</div>
                                            <div className="text-[10px] text-gray-500 mt-1">Invoice: {item.orderNo}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TeamOrders;