import {
    Calendar,
    FileText,
    PhoneCall,
    Paperclip,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";

const LeaveDetailsSidebar = ({
    leave,
    onClose,
    onCancelLeave,
    onOpenDocument,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(Boolean(leave)));
        return () => cancelAnimationFrame(frame);
    }, [leave]);

    if (!leave) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const statusStyles = {
        Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
        Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5",
        Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5",
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Sidebar Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div 
                    className={`w-screen max-w-lg bg-background/95 backdrop-blur-xl border-l border-border/80 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
                        isVisible ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between bg-card/40">
                        <div className="flex items-center gap-3.5">
                            <div className="h-11 w-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-inner">
                                <FileText size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-foreground">
                                    Leave Application Details
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Leave application details
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="h-9 w-9 rounded-xl border border-border/60 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                        
                        {/* Status Banner */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/80 shadow-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/80" />
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                                <p className="text-sm font-medium text-foreground mt-0.5">Application Decision</p>
                            </div>
                            <span
                                className={`
                                    px-4 py-1.5
                                    rounded-full
                                    text-xs
                                    font-bold
                                    tracking-wide
                                    border
                                    shadow-sm
                                    ${statusStyles[leave.status]}
                                `}
                            >
                                {leave.status}
                            </span>
                        </div>

                        {/* Leave Type & Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-card/40 border border-border/60">
                                <p className="text-xs font-medium text-muted-foreground">Leave Category</p>
                                <p className="font-bold text-sm mt-1.5 text-foreground">
                                    {leave.leaveType}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-card/40 border border-border/60">
                                <p className="text-xs font-medium text-muted-foreground">Total Duration</p>
                                <p className="font-bold text-sm mt-1.5 text-yellow-400">
                                    {leave.duration} <span className="text-xs text-muted-foreground font-normal">({leave.dayType})</span>
                                </p>
                            </div>
                        </div>

                        {/* Timeline / Dates Card */}
                        <div className="p-4 rounded-2xl bg-card/40 border border-border/60 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <Calendar size={14} className="text-yellow-400" />
                                <span>Schedule Period</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="p-3 rounded-xl bg-background/50 border border-border/40">
                                    <p className="text-[11px] text-muted-foreground">From Date</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{leave.fromDate}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-background/50 border border-border/40">
                                    <p className="text-[11px] text-muted-foreground">To Date</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{leave.toDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reason Section */}
                        <div className="p-4 rounded-2xl bg-card/40 border border-border/60 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <FileText size={14} className="text-yellow-400" />
                                <span>Reason for Leave</span>
                            </div>
                            <p className="text-sm font-medium text-foreground/90 bg-background/40 p-3 rounded-xl border border-border/40 leading-relaxed">
                                {leave.reason}
                            </p>
                        </div>

                        {/* Emergency Contact & Document Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Emergency Contact */}
                            <div className="p-4 rounded-2xl bg-card/40 border border-border/60 flex items-start gap-3.5">
                                <div className="h-9 w-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5">
                                    <PhoneCall size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-muted-foreground">Emergency Contact</p>
                                    <p className="font-semibold text-sm mt-0.5 text-foreground truncate">
                                        {leave.emergencyContact || "Not Provided"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {leave.phone || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Supporting Document */}
                            <div className="p-4 rounded-2xl bg-card/40 border border-border/60 flex items-start gap-3.5">
                                <div className="h-9 w-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5">
                                    <Paperclip size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-muted-foreground">Supporting Document</p>
                                    <button type="button" onClick={() => leave.documents?.[0] && onOpenDocument?.(leave.documents[0].id)} disabled={!leave.documents?.[0]} className={`font-medium text-sm mt-0.5 truncate text-left ${!leave.document || leave.document === "Not Attached" ? "text-muted-foreground italic" : "text-yellow-400 underline cursor-pointer"}`}>
                                        {leave.document || "Not Attached"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t border-border/60 bg-card/40 flex items-center justify-between">
                        {["Pending", "Under Review"].includes(leave.status) ? (
                            <button
                                onClick={() => onCancelLeave?.(leave.id)}
                                className="
                                    px-4 py-2.5
                                    rounded-xl
                                    bg-rose-500/10
                                    border border-rose-500/20
                                    text-rose-400
                                    text-sm
                                    font-semibold
                                    hover:bg-rose-500/20
                                    transition-all
                                    duration-200
                                "
                            >
                                Cancel Request
                            </button>
                        ) : <div />}

                        <button
                            onClick={handleClose}
                            className="
                                px-6 py-2.5
                                rounded-xl
                                bg-yellow-500
                                text-black
                                text-sm
                                font-bold
                                hover:bg-yellow-400
                                hover:shadow-lg
                                hover:shadow-yellow-500/20
                                transition-all
                                duration-200
                            "
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LeaveDetailsSidebar;
