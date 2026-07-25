import { ROLES } from "../roles.js";

export const leaveNavigation = Object.freeze({
    [ROLES.ADMIN]: ["leave-management"],
    [ROLES.HR]: ["leave-management", "apply-leave"],
    [ROLES.ASM]: ["leave-management", "apply-leave"],
    [ROLES.SALES_EXECUTIVE]: ["leave-management", "apply-leave"],
});
