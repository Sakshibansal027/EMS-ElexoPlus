import ROLES from "../../../config/roles";

const SETTINGS_PERMISSIONS = {
    [ROLES.ADMIN]: {
        company: true,
        departments: true,
        designations: true,
        employmentTypes: true,
        employeeStatuses: true,
        preferences: true,
    },

    [ROLES.HR]: {
        company: false,
        departments: true,
        designations: true,
        employmentTypes: true,
        employeeStatuses: true,
        preferences: true,
    },

    [ROLES.ASM]: {
        company: false,
        departments: false,
        designations: false,
        employmentTypes: false,
        employeeStatuses: false,
        preferences: true,
    },

    [ROLES.SALES_EXECUTIVE]: {
        company: false,
        departments: false,
        designations: false,
        employmentTypes: false,
        employeeStatuses: false,
        preferences: true,
    },
};

export default SETTINGS_PERMISSIONS;