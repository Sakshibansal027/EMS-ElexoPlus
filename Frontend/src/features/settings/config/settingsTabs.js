import {
  Building2,
  Layers,
  Briefcase,
  Clock,
  Users,
  Palette,
} from "lucide-react";
import ROLES from "../../../config/roles";

export const SETTINGS_TABS = [
  // ─── Administration ───────────────────────────────
  {
    id: "company",
    label: "Company Settings",
    icon: Building2,
    description: "Manage organization details and preferences",
    roles: [ROLES.ADMIN],
    section: "admin",
  },
  {
    id: "departments",
    label: "Departments",
    icon: Layers,
    description: "Manage organizational departments",
    roles: [ROLES.ADMIN, ROLES.HR],
    section: "admin",
  },
  {
    id: "designations",
    label: "Designations",
    icon: Briefcase,
    description: "Manage job titles and roles",
    roles: [ROLES.ADMIN, ROLES.HR],
    section: "admin",
  },
  {
    id: "employment-types",
    label: "Employment Types",
    icon: Clock,
    description: "Manage employment categories",
    roles: [ROLES.ADMIN, ROLES.HR],
    section: "admin",
  },
  {
    id: "employee-statuses",
    label: "Employee Statuses",
    icon: Users,
    description: "Manage employee status labels",
    roles: [ROLES.ADMIN, ROLES.HR],
    section: "admin",
  },

  // ─── Preferences ─────────────────────────────────
  {
    id: "preferences",
    label: "App Preferences",
    icon: Palette,
    description: "Theme, notifications and personal settings",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.ASM, ROLES.SALES_EXECUTIVE],
    section: "preferences",
  },
];
