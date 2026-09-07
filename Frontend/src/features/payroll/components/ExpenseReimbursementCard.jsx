import { useState, useEffect } from "react";
import { CheckCircle2, Banknote, FileText, Check } from "lucide-react";
import { calculateApprovedExpensesTotal, formatCurrency } from "../utils/payroll";

const ExpenseReimbursementCard = ({ expenses: initialExpenses = [], onApprove }) => {
    const [expensesList, setExpensesList] = useState(initialExpenses);

    useEffect(() => {
        Promise.resolve().then(() => setExpensesList(initialExpenses));
    }, [initialExpenses]);

    const handleApprove = async (id, indexToUpdate) => {
        const item = expensesList[indexToUpdate];
        if (!item || !onApprove) return;
        try {
            await onApprove(id);
        } catch {
            return;
        }
        setExpensesList((previous) => previous.map((item, index) => {
            const isTarget = item.id ? item.id === id && index === indexToUpdate : index === indexToUpdate;
            if (!isTarget) return item;
            const updatedItem = { ...item, status: "Approved" };
            return updatedItem;
        }));
    };

    const renderStatusAction = (item, index) => {
        const status = item.status?.toLowerCase();
        if (status === "pending") {
            return (
                <button type="button" onClick={() => handleApprove(item.id, index)} disabled={!onApprove} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
                    <Check className="w-3 h-3 stroke-[3]" /> Approve
                </button>
            );
        }
        if (status === "approved") {
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
        }
        if (status === "disbursed") {
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Banknote className="w-3 h-3" /> Disbursed</span>;
        }
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">{item.status}</span>;
    };

    const totalAmount = calculateApprovedExpensesTotal(expensesList);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 text-white flex flex-col h-full justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><FileText className="w-4 h-4" /></div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-100">Expense Reimbursements</h3>
                        <p className="text-xs text-zinc-400">Approved expenses added to payroll payout</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[11px] text-zinc-500">Total Claim Value</p>
                    <p className="text-sm font-bold text-amber-400">{formatCurrency(totalAmount)}</p>
                </div>
            </div>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar grow">
                {expensesList?.length ? expensesList.map((item, index) => (
                    <div key={item.id ? `${item.id}-${index}` : `expense-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-medium text-amber-500/90">{item.id || `#${index + 1}`}</span>
                                <h4 className="text-xs sm:text-sm font-medium text-zinc-200 line-clamp-1">{item.type}</h4>
                            </div>
                            <p className="text-[11px] text-zinc-500">Date: {item.date}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                            <span className="text-xs sm:text-sm font-semibold text-zinc-100">{formatCurrency(item.amount)}</span>
                            {renderStatusAction(item, index)}
                        </div>
                    </div>
                )) : <p className="py-6 text-center text-xs text-zinc-500">No reimbursement claims found.</p>}
            </div>
        </div>
    );
};

export default ExpenseReimbursementCard;
