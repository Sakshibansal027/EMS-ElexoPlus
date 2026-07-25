import { ROLES } from "./roles.js";

export const roleAccess = Object.freeze({
    [ROLES.ADMIN]: { scopes: ["all"], canApplyLeave: false },
    [ROLES.HR]: { scopes: ["asm", "employee"], canApplyLeave: true },
    [ROLES.ASM]: { scopes: ["assigned-employees"], canApplyLeave: true },
    [ROLES.SALES_EXECUTIVE]: { scopes: ["own"], canApplyLeave: true },
});
