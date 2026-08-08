import { useState, useEffect } from "react";
import { X, Sliders, Check, Trash2 } from "lucide-react";

const LeavePolicyModal = ({ isOpen, onClose, policy, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        leaveTypeName: "",
        leaveTypeCode: "",
        annualQuota: 0,
        accrualFrequency: "Monthly",
        accrualMethod: "Pro-rata",
        carryForwardAllowed: false,
        maxCarryForwardDays: 0,
        description: ""
    });

    useEffect(() => {
        if (policy) {
            setFormData({
                id: policy.id || "",
                leaveTypeName: policy.leaveTypeName || "",
                leaveTypeCode: policy.leaveTypeCode || "",
                annualQuota: policy.annualQuota || 0,
                accrualFrequency: policy.accrualFrequency || "Monthly",
                accrualMethod: policy.accrualMethod || "Pro-rata",
                carryForwardAllowed: policy.carryForwardAllowed || false,
                maxCarryForwardDays: policy.maxCarryForwardDays || 0,
                description: policy.description || ""
            });
        } else {
            setFormData({
                leaveTypeName: "",
                leaveTypeCode: "",
                annualQuota: 0,
                accrualFrequency: "Monthly",
                accrualMethod: "Pro-rata",
                carryForwardAllowed: false,
                maxCarryForwardDays: 0,
                description: ""
            });
        }
    }, [policy, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-card border border-border/80 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <Sliders size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">
                            {policy ? "Configure Leave Policy" : "Add New Leave Type"}
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Leave Name</label>
                            <input 
                                type="text" 
                                value={formData.leaveTypeName} 
                                onChange={(e) => setFormData({...formData, leaveTypeName: e.target.value})}
                                className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Code (e.g., CL, EL)</label>
                            <input 
                                type="text" 
                                value={formData.leaveTypeCode} 
                                onChange={(e) => setFormData({...formData, leaveTypeCode: e.target.value})}
                                className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Annual Quota</label>
                            <input 
                                type="number" 
                                value={formData.annualQuota} 
                                onChange={(e) => setFormData({...formData, annualQuota: Number(e.target.value)})}
                                className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Accrual Freq</label>
                            <select 
                                value={formData.accrualFrequency}
                                onChange={(e) => setFormData({...formData, accrualFrequency: e.target.value})}
                                className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400 bg-card"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Method</label>
                            <select 
                                value={formData.accrualMethod}
                                onChange={(e) => setFormData({...formData, accrualMethod: e.target.value})}
                                className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400 bg-card"
                            >
                                <option value="Pro-rata">Pro-rata</option>
                                <option value="Upfront">Upfront</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                        <div>
                            <span className="text-sm font-semibold text-foreground">Carry Forward Allowed</span>
                            <p className="text-xs text-muted-foreground">Allow unused leaves to pass to next year</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={formData.carryForwardAllowed}
                            onChange={(e) => setFormData({...formData, carryForwardAllowed: e.target.checked})}
                            className="h-4 w-4 accent-yellow-400 rounded cursor-pointer"
                        />
                    </div>

                    {formData.carryForwardAllowed && (
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Max Carry Forward Days</label>
                            <input 
                                type="number" 
                                value={formData.maxCarryForwardDays} 
                                onChange={(e) => setFormData({...formData, maxCarryForwardDays: Number(e.target.value)})}
                                className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Description</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-background/60 border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-400 resize-none h-20"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                        {policy ? (
                            <button 
                                type="button" 
                                onClick={() => { onDelete(policy.id); onClose(); }} 
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        ) : <div />}

                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-all flex items-center gap-2 cursor-pointer">
                                <Check size={16} /> Save Policy
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeavePolicyModal;