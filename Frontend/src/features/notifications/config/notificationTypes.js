import {
  Plane,
  CalendarDays,
  ChartColumn,
  Users,
  Wallet,
  Bell,
  Megaphone,
} from "lucide-react";

export const NOTIFICATION_TYPES = {
  leave: {
    label: "Leave",
    icon: Plane,
    color: "text-[#4dabf7]",
    bg: "bg-[#4dabf7]/10",
  },
  attendance: {
    label: "Attendance",
    icon: CalendarDays,
    color: "text-[#2ecc71]",
    bg: "bg-[#2ecc71]/10",
  },
  sales: {
    label: "Sales",
    icon: ChartColumn,
    color: "text-[#ffbf00]",
    bg: "bg-[#ffbf00]/10",
  },
  employee: {
    label: "Employee",
    icon: Users,
    color: "text-[#e74c3c]",
    bg: "bg-[#e74c3c]/10",
  },
  payroll: {
    label: "Payroll",
    icon: Wallet,
    color: "text-[#9b59b6]",
    bg: "bg-[#9b59b6]/10",
  },
  task: {
    label: "Task",
    icon: Bell,
    color: "text-[#f39c12]",
    bg: "bg-[#f39c12]/10",
  },
  system: {
    label: "System",
    icon: Megaphone,
    color: "text-[#1abc9c]",
    bg: "bg-[#1abc9c]/10",
  },
};

export const NOTIFICATION_TONE = {
  success: "text-[#2ecc71]",
  warning: "text-[#ffbf00]",
  error: "text-[#e74c3c]",
  info: "text-[#4dabf7]",
};

export const NOTIFICATION_BG = {
  success: "bg-[#2ecc71]",
  warning: "bg-[#ffbf00]",
  error: "bg-[#e74c3c]",
  info: "bg-[#4dabf7]",
};

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  ...Object.entries(NOTIFICATION_TYPES).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "info", label: "Info" },
];
