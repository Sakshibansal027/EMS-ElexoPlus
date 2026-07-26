import { 
    LayoutDashboard, 
    CheckSquare, 
    Send, 
    Database 
} from "lucide-react";

export const adminTabsConfig = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "operations", label: "Operations & Approvals", icon: CheckSquare },
  { id: "disbursements", label: "Disbursements & Reports", icon: Send },
  { id: "records", label: "Master & Records", icon: Database },
];