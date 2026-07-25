import { useState } from "react";
import { DollarSign, X, ArrowUpRight, Calendar, Tag, Plus } from "lucide-react";
import { getExpenseStatusStyle as getStatusStyle, formatAmount, createExpenseClaim } from "../utils/payroll";

const ExpensesReimbursementCard = ({ expenses = [] }) => {
    // Purely initialized with incoming props
    const [expensesList, setExpensesList] = useState(expenses);
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        type: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
    });

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!formData.type || !formData.amount) return;

        const newClaim = createExpenseClaim(
            formData.type,
            formData.amount,
            formData.date,
            expensesList.length
        );

        setExpensesList([newClaim, ...expensesList]);
        setFormData({ type: "", amount: "", date: new Date().toISOString().split("T")[0] });
        setIsAddModalOpen(false);
    };

    const previewExpenses = expensesList.slice(0, 3);

    return (
        <>
            <div className="card p-5 h-full flex flex-col bg-[#141414] border border-[#222] rounded-2xl justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-yellow-500" />
                            <h3 className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">
                                Expenses & Claims
                            </h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="text-[11px] font-bold bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20 px-2 py-1 rounded-lg flex items-center gap-1 transition-all uppercase tracking-wider"
                            >
                                <Plus size={13} /> Apply Claim
                            </button>

                            {expensesList.length > 3 && (
                                <button 
                                    onClick={() => setIsViewAllOpen(true)}
                                    className="text-[11px] font-bold text-yellow-500/80 hover:text-yellow-500 flex items-center gap-0.5 transition-colors uppercase tracking-wider ml-1"
                                >
                                    View All <ArrowUpRight size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table / Empty State */}
                    <div className="overflow-x-auto custom-scrollbar">
                        {expensesList.length === 0 ? (
                            <div className="text-center py-6 text-xs text-gray-500">
                                No expense claims found.
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#2a2a2a]">
                                        <th className="pb-2 text-xs font-bold text-gray-400 uppercase">Type</th>
                                        <th className="pb-2 text-xs font-bold text-gray-400 uppercase text-right">Amount</th>
                                        <th className="pb-2 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a2a]/50">
                                    {previewExpenses.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-[#1a1a1a]/40 transition-colors">
                                            <td className="py-3 pr-2">
                                                <div className="text-xs font-semibold text-gray-200">{exp.type}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">{exp.date}</div>
                                            </td>
                                            <td className="py-3 text-xs font-bold text-gray-100 text-right">
                                                ₹{formatAmount(exp.amount)}
                                            </td>
                                            <td className="py-3 text-center pl-2">
                                                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(exp.status)}`}>
                                                    {exp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Apply Claim */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#161616]">
                            <div className="flex items-center gap-2">
                                <Plus size={18} className="text-yellow-500" />
                                <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">
                                    Apply Expense Claim
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1.5 bg-[#222] text-gray-400 hover:text-white rounded-xl transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                    Expense Category / Type
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Travel Allowance"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
                                >
                                    Submit Claim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View All */}
            {isViewAllOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
                    <div className="w-full max-w-3xl bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#161616]">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                                    <DollarSign size={18} className="text-yellow-500" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">
                                        Expense Claims History
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsViewAllOpen(false)}
                                className="p-1.5 bg-[#222] text-gray-400 hover:text-white rounded-xl transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#222] text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                        <th className="pb-3 pl-2">Claim ID</th>
                                        <th className="pb-3">Transaction Details</th>
                                        <th className="pb-3 text-right">Amount</th>
                                        <th className="pb-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#222]/60">
                                    {expensesList.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-[#161616]/40 transition-colors">
                                            <td className="py-4 pl-2 text-xs font-mono font-bold text-gray-500">
                                                {exp.id}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                                                        <Tag size={12} className="text-yellow-500/60" />
                                                        {exp.type}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                        <Calendar size={11} className="text-gray-500" />
                                                        {exp.date}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-xs font-black text-gray-100 text-right">
                                                ₹{formatAmount(exp.amount)}
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusStyle(exp.status)}`}>
                                                    {exp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExpensesReimbursementCard;
