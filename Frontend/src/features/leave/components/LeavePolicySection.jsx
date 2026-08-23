import { useState, useEffect } from "react";
import { Settings, Plus, Edit3, Trash2 } from "lucide-react";
import { leavePolicyService } from "../services/leavePolicyService";
import LeavePolicyModal from "./LeavePolicyModal";

const LeavePolicySection = () => {
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        const data = await leavePolicyService.getPolicies();
        setPolicies(data);
    };

    const handleSavePolicy = async (policyData) => {
        if (policyData.id) {
            await leavePolicyService.updatePolicy(policyData);
        } else {
            await leavePolicyService.createPolicy(policyData);
        }
        loadPolicies();
    };

    const handleDeletePolicy = async (policyId) => {
        if (window.confirm("Are you sure you want to delete this leave policy?")) {
            await leavePolicyService.deletePolicy(policyId);
            loadPolicies();
            setIsModalOpen(false);
            setSelectedPolicy(null);
        }
    };

    return (
        <div className="mb-8 mt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Leave Policies & Quotas</h2>
                    <p className="text-xs text-muted-foreground">Manage annual quotas, accrual methods, and parameters</p>
                </div>
                <button 
                    onClick={() => { setSelectedPolicy(null); setIsModalOpen(true); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                    <Plus size={14} /> Add Leave Type
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {policies.map((policy) => (
                    <div key={policy.id} className="relative bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between group hover:border-yellow-500/40 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    {policy.leaveTypeCode}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => { setSelectedPolicy(policy); setIsModalOpen(true); }}
                                        className="h-8 w-8 rounded-lg bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-yellow-400 hover:border-yellow-400/40 transition-all cursor-pointer"
                                        title="Configure Policy"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeletePolicy(policy.id)}
                                        className="h-8 w-8 rounded-lg bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-all cursor-pointer"
                                        title="Delete Policy"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-foreground mb-1">{policy.leaveTypeName}</h3>
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{policy.description}</p>
                        </div>

                        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                            <div>
                                <span className="text-muted-foreground block">Annual Quota</span>
                                <span className="font-bold text-foreground text-sm">{policy.annualQuota} Days</span>
                            </div>
                            <div className="text-right">
                                <span className="text-muted-foreground block">Accrual</span>
                                <span className="font-bold text-yellow-400">{policy.accrualFrequency}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <LeavePolicyModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                policy={selectedPolicy}
                onSave={handleSavePolicy}
                onDelete={handleDeletePolicy}
            />
        </div>
    );
};

export default LeavePolicySection;