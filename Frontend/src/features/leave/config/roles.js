export const ROLES = Object.freeze({
    ADMIN: "ADMIN",
    HR: "HR",
    ASM: "ASM",
    SALES_EXECUTIVE: "SALES_EXECUTIVE",
});

export const DEFAULT_LEAVE_USER = Object.freeze({
    id: "EMP001",
    employeeId: "EMP001",
    role: ROLES.ADMIN,
    asmId: "ASM001",
});

export const normalizeEmployeeId = (id) => {
    if (!id) return DEFAULT_LEAVE_USER.employeeId;
    if (String(id).startsWith("EMP")) return id;

    return `EMP${String(id).padStart(3, "0")}`;
};
